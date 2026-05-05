import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf6f3',
          100: '#fbe8e0',
          200: '#f6cebf',
          300: '#eea995',
          400: '#e08369',
          500: '#c96049',
          600: '#b04632',
          700: '#8e3527',
          800: '#6e2920',
          900: '#54201b',
        },
        rose: {
          50: '#fff5f6',
          100: '#ffe4e8',
          200: '#fbc8d1',
          300: '#f5a3b3',
          400: '#ec7c91',
          500: '#dc5775',
          600: '#bf3c5b',
          700: '#9a2c47',
          800: '#7a233a',
          900: '#5e1c2e',
        },
        gold: {
          50: '#fbf6ec',
          100: '#f5ead0',
          200: '#ead29a',
          300: '#dcb766',
          400: '#cba14a',
          500: '#b8893a',
          600: '#9a6c2c',
          700: '#7c5326',
          800: '#5f3f1f',
          900: '#473018',
        },
        cream: {
          50: '#fdfaf6',
          100: '#fbf3eb',
          200: '#f3e3d2',
          300: '#e8cdb1',
          400: '#dab48b',
          500: '#c79766',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Playfair Display', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        arabic: ['"Cairo"', '"Tajawal"', 'system-ui', 'sans-serif'],
        arabicDisplay: ['"Amiri"', '"Cairo"', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #fdf6f3 0%, #fff5f6 35%, #fbf3eb 100%)',
        'rose-gold': 'linear-gradient(135deg, #e6b8a2 0%, #c79666 50%, #b8893a 100%)',
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(191, 60, 91, 0.15), 0 8px 16px -8px rgba(184, 137, 58, 0.12)',
        'soft': '0 10px 40px -10px rgba(220, 87, 117, 0.18)',
        'gold-glow': '0 0 30px rgba(220, 175, 110, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'sparkle': 'sparkle 2.4s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'gradient-x': 'gradientX 6s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-22px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.9) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1.15) rotate(180deg)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
