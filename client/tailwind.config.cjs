/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0c4ea3',
          accent: '#0c63c9',
          strong: '#0d56a8',
          secondary: '#1a5ca9',
          link: '#0f56b0',
          kicker: '#5a7aa4',
        },
        text: {
          primary: '#1f2935',
          heading: '#20262d',
          emphasis: '#16355e',
          secondary: '#677d98',
          muted: '#5d6d80',
          soft: '#72839a',
          control: '#6c7c8f',
          field: '#455568',
          label: '#94a4b6',
          placeholder: '#6d7d90',
        },
        surface: {
          page: '#f5f8fc',
          card: '#ffffff',
          muted: '#eef3fa',
          'brand-soft': '#e6effb',
        },
        border: {
          soft: '#e4ebf5',
          strong: '#d4deec',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'card-sm': '0 8px 24px rgba(16, 35, 61, 0.06)',
        'card-md': '0 16px 36px rgba(16, 35, 61, 0.08)',
      },
      fontSize: {
        kicker: '0.82rem',
        'label-sm': '0.78rem',
        'label-xs': '0.74rem',
        'body-lg': '1rem',
        'body-md': '0.96rem',
        'body-sm': '0.94rem',
        'body-xs': '0.8rem',
        'body-input': '0.95rem',
        'heading-hero': ['clamp(2rem, 5.2vw, 3.2rem)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'heading-section': ['clamp(1.5rem, 3vw, 2.2rem)', { lineHeight: '0.92' }],
        'heading-categories': ['clamp(1.3rem, 2.2vw, 1.7rem)', { lineHeight: '0.92' }],
        'heading-journey': ['clamp(1.2rem, 2vw, 1.5rem)', { lineHeight: '0.92' }],
        'heading-professionals': ['clamp(1.1rem, 1.8vw, 1.3rem)', { lineHeight: '0.92' }],
        'heading-card-lg': ['clamp(1.05rem, 1.4vw, 1.18rem)', { lineHeight: '0.92' }],
        'heading-card-md': ['clamp(0.98rem, 1.1vw, 1.08rem)', { lineHeight: '0.92' }],
        'heading-card-sm': '0.92rem',
        'heading-profile': '1.05rem',
        'heading-cta': ['clamp(1.4rem, 2.2vw, 2rem)', { lineHeight: '0.92' }],
        'badge-value': '1.1rem',
      },
      lineHeight: {
        'body': '1.7',
        'body-compact': '1.45',
      },
      letterSpacing: {
        tight: '-0.03em',
        'hero': '-0.04em',
        wide: '0.08em',
        service: '0.12em',
      },
    },
  },
  plugins: [],
};