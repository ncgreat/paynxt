/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: false, // 👈 add this line
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      animation: {
        spin: 'spin 5s infinite linear',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        bounce: 'bounce 1s infinite',
      },
    },
    screens: {
      xs: '375px',
      sm: '576px',
      md: '960px',
      lg: '1440px',
    },
  },
  plugins: [],
};
