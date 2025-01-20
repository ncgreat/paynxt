/** @type {import('tailwindcss').Config} */
export default {
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
						transform: 'scale(4)',
						opacity: 0,
					},
				},
			},
			animation: {
				spin: 'spin 5s infinite linear',
				ping: 'ping 10s cubic-bezier(0, 0, 0.2, 1) infinite',
			},
		},
		screens: {
			xs: '375px',
			// => @media (min-width: 375px) { ... }
			sm: '576px',
			// => @media (min-width: 576px) { ... }

			md: '960px',
			// => @media (min-width: 960px) { ... }

			lg: '1440px',
			// => @media (min-width: 1440px) { ... }
		},
	},
	plugins: [],
};
