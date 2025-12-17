# Her Clinic - Health and Wellness Website

A beautiful, animated bilingual website for Dr. Reham Mohamed's beauty and wellness clinic.

## Features

- ✨ Beautiful animations using Framer Motion
- 🌐 Bilingual support (English & Arabic) with next-intl
- 🎨 Elegant design with custom pink/rose color palette
- 📱 Fully responsive design
- ⚡ Built with Next.js 14 and TypeScript
- 🎯 Optimized for Vercel deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Internationalization**: next-intl
- **Icons**: Lucide React
- **Fonts**: Playfair Display, Inter, Tajawal

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Her-Clinic
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy!

The site will automatically deploy on every push to your main branch.

## Customization

### Colors

Edit the color palette in `tailwind.config.ts`:
- Primary: Pink/Rose tones
- Gold: Accent colors
- Customize gradients and effects

### Content

Edit translations in:
- `messages/en.json` - English content
- `messages/ar.json` - Arabic content

### Fonts

Fonts are configured in `app/[locale]/layout.tsx`

## Structure

```
Her-Clinic/
├── app/
│   ├── [locale]/        # Internationalized pages
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── messages/           # Translation files
│   ├── en.json
│   └── ar.json
└── public/            # Static assets

```

## License

© 2024 Her Clinic. All rights reserved.

## Contact

For questions or support, please contact:
- Email: info@herclinic.com
- Website: [herclinic.com](https://herclinic.com)
