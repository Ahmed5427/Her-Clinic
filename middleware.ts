import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales } from './i18n';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

const LOCALE_ADMIN_RE = /^\/(en|ar)\/admin(\/.*)?$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /en/admin or /ar/admin — strip the locale and redirect to /admin/...
  const localeAdminMatch = pathname.match(LOCALE_ADMIN_RE);
  if (localeAdminMatch) {
    const url = req.nextUrl.clone();
    url.pathname = `/admin${localeAdminMatch[2] ?? ''}`;
    return NextResponse.redirect(url);
  }

  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  // Public routes go through next-intl. Admin routes skip i18n.
  const res = isAdmin ? NextResponse.next({ request: req }) : intlMiddleware(req);

  // Refresh Supabase auth cookies on every request and read the user.
  const { user } = await updateSession(req, res);

  if (isAdmin) {
    if (pathname === '/admin/login') {
      if (user) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin';
        url.search = '';
        return NextResponse.redirect(url);
      }
    } else if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/(ar|en)/:path*',
    '/admin/:path*',
    '/((?!_next|_vercel|api/track|.*\\..*).*)',
  ],
};
