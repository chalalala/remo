import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
      },
      colors: {
        indigo: {
          10: 'F9FAFF',
          50: '#EEF2FF',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      boxShadow: {
        loader: '-16px 0 #FFF, 16px 0 #FFF',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        1.5: '6px',
      },
      maxHeight: {
        unset: 'unset',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        loading: {
          '33%': {
            background: '#FFF',
            boxShadow: '-16px 0 var(--primary), 16px 0 #FFF',
          },
          '66%': {
            background: 'var(--primary)',
            boxShadow: '-16px 0 #FFF, 16px 0 #FFF',
          },
          '100%': {
            background: '#FFF',
            boxShadow: '-16px 0 #FFF, 16px 0 var(--primary)',
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        loading: 'loading 2s linear infinite',
        'gradient-x': 'gradient-x 2s ease infinite',
      },
    },
    screens: {
      desktop: '768px',
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.show-child-on-hover': {
          '& .child': {
            opacity: '0',
          },

          '&:hover .child': {
            opacity: '1',
          },
        },
      });
    }),
    require('tailwindcss-animate'),
  ],
} satisfies Config;

export default config;
