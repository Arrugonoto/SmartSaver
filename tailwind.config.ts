import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/react';
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      wide: '1920px',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      darkMode: 'class',
      keyframes: {
        'loading-dots': {
          '0%, 100%': {
            'background-size':
              'calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 100%',
          },
          '33%': {
            'background-size':
              'calc(100%/3) 0%, calc(100%/3) 100%, calc(100%/3) 100%',
          },
          '50%': {
            'background-size':
              'calc(100%/3) 100%, calc(100%/3) 0%, calc(100%/3) 100%',
          },
          '66%': {
            'background-size':
              'calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 0%',
          },
        },
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
      animation: {
        'loading-dots': 'loading-dots 1s infinite linear',
        aurora: 'aurora 60s linear infinite',
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#60bb8f',
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: '#4ea37a',
            },
          },
        },
      },
    }),
    addVariablesForColors,
  ],
};
export default config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}
