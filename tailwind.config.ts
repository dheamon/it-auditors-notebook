import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A365D',
          50: '#EBF0F8',
          100: '#C8D6EC',
          200: '#91AADB',
          300: '#5A7EC9',
          400: '#2D5CB4',
          500: '#1A365D',
          600: '#152C4E',
          700: '#10213A',
          800: '#0B1627',
          900: '#060B13',
        },
        secondary: {
          DEFAULT: '#2D3748',
          50: '#F0F2F5',
          100: '#D5DAE3',
          200: '#AAB5C7',
          300: '#7F90AB',
          400: '#546B8F',
          500: '#2D3748',
          600: '#242D3A',
          700: '#1B222C',
          800: '#12161D',
          900: '#090B0F',
        },
        accent: {
          DEFAULT: '#6366F1',
          50: '#EEEEFF',
          100: '#D4D5FB',
          200: '#ABABF7',
          300: '#8182F3',
          400: '#7172F2',
          500: '#6366F1',
          600: '#4547D6',
          700: '#3334B0',
          800: '#23248A',
          900: '#141464',
        },
      },
      fontFamily: {
        // Bespoke Sans — body text and UI. Use font-weight to pick the variant:
        //   font-light (300) · font-normal (400) · font-medium (500)
        //   font-semibold (600) · font-bold (700) · font-extrabold (800)
        sans:            ['var(--font-bespoke-sans)', 'system-ui', 'sans-serif'],
        'bespoke-sans':  ['var(--font-bespoke-sans)', 'system-ui', 'sans-serif'],

        // Expose — headings and display text. Use font-weight to pick the variant:
        //   font-normal (400) · font-medium (500) · font-bold (700) · font-black (900)
        heading: ['var(--font-expose)', 'system-ui', 'sans-serif'],
        expose:  ['var(--font-expose)', 'system-ui', 'sans-serif'],
      },
      typography: (theme: (path: string) => string) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.accent.DEFAULT'),
              '&:hover': { color: theme('colors.primary.DEFAULT') },
            },
            h1: { color: theme('colors.primary.DEFAULT'), fontWeight: '700' },
            h2: { color: theme('colors.primary.DEFAULT'), fontWeight: '600' },
            h3: { color: theme('colors.secondary.DEFAULT'), fontWeight: '600' },
            blockquote: {
              borderLeftColor: theme('colors.accent.DEFAULT'),
              color: theme('colors.secondary.DEFAULT'),
            },
          },
        },
      }),
    },
  },
  plugins: [],
}

export default config
