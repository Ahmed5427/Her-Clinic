'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import ImageDropzone from './ImageDropzone';
import { uploadLogo, uploadLogoMark, resetLogo } from '@/app/admin/_actions/branding';
import type { BrandingSettings } from '@/lib/supabase/types';

interface Props {
  initial: BrandingSettings;
}

export default function LogoUploader({ initial }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <ImageDropzone
            label="Full logo (used in Hero medallion)"
            accept="image/*,image/svg+xml"
            currentUrl={initial.logo_url}
            onUpload={uploadLogo}
          />
        </div>
        <div className="admin-card p-6">
          <ImageDropzone
            label="Logo mark (used in Navbar, Footer, favicon)"
            accept="image/*,image/svg+xml"
            currentUrl={initial.logo_mark_url}
            onUpload={uploadLogoMark}
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="button"
          className="admin-btn-secondary text-sm"
          disabled={pending}
          onClick={() => {
            if (!confirm('Reset the logo back to the bundled SVG marks?')) return;
            startTransition(async () => {
              const r = await resetLogo();
              if ('error' in r) toast.error(r.error);
              else toast.success('Logo reset to defaults');
            });
          }}
        >
          <RefreshCw className="w-4 h-4" /> Reset to defaults
        </button>
      </div>
    </div>
  );
}
