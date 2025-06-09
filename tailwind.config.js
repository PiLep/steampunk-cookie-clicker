/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'spin-slower': 'spin 30s linear infinite',
        'spin-reverse-slow': 'spin-reverse 15s linear infinite',
        'spin-reverse-slower': 'spin-reverse 25s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-up': 'float-up 1s ease-out forwards',
        'wrench': 'wrench 3s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: {
            transform: 'rotate(360deg)'
          },
          to: {
            transform: 'rotate(0deg)'
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateY(-100px)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'translateY(-200px)',
            opacity: '0',
          }
        },
        'float-up': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-40px) scale(1.5)',
            opacity: '0',
          }
        },
        'wrench': {
          '0%, 100%': {
            transform: 'rotate(-15deg)',
          },
          '50%': {
            transform: 'rotate(15deg)',
          }
        },
        'shine': {
          '0%': {
            left: '-100%',
          },
          '100%': {
            left: '100%',
          }
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};