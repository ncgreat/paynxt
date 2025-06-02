import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	plugins: [react()],
	esbuild: {
		loader: 'jsx',
	},
	// server: {
	// 	middleware: (req, res, next) => {
	// 		if (req.originalUrl.startsWith('/transactions/confirm')) {
	// 			req.url = '/index.html'; // Redirect to index.html for React Router
	// 		}
	// 		next();
	// 	},
	// },
	// historyApiFallback: {
	// 	index: '/index.html',
	// 	disableDotRule: true,
	// 	htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
	// },
	optimizeDeps: {
		include: ['react-loading-skeleton'],
		esbuildOptions: {
			loader: {
				'.js': 'jsx',
			},
		},
	},
});
