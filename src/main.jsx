import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DealProvider } from './DealContext';
import App from './App.jsx';
import './index.css';
import './borderless.css';
// import 'react-loading-skeleton/dist/skeleton.css';


ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<GoogleOAuthProvider
			clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
		>
			<DealProvider>
				<Router>
					<App />
				</Router>
			</DealProvider>
		</GoogleOAuthProvider>
	</React.StrictMode>,
);
