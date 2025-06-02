import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { BenefitsPage, MobileLanding, Login, Signup, Dashboard, Bills, Rides, Landing, Foods, Groceries, Forgot, ResetPassword, FoodVendor, VendorLogin, VendorSignup, Onboarding } from './components';
import { LoadScript } from '@react-google-maps/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Toaster } from 'react-hot-toast';

function App() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
	useEffect(() => {
	  const handleResize = () => setWindowWidth(window.innerWidth);
	  window.addEventListener('resize', handleResize);
	  return () => window.removeEventListener('resize', handleResize);
	}, []);
  
	const isMobile = useMemo(() => windowWidth <= 768, [windowWidth]);

	return (
        // <Router>
        //     <Switch>
		// 		<Route path="/dashboard" exact component={Dashboard} />
		// 		<Route path="/bills" exact component={Bills} />
		// 		<Route path="/rides" exact component={Rides} />
        //         <Route exact path="/" component={Login} />
		// 		<Route path="/signup" component={Signup} />
		// 		<Route path="/login" component={Login} />
        //     </Switch>
        // </Router>
		// <LoadScript 
		// 	googleMapsApiKey="AIzaSyDkp5d4E_9QmKbpgYVWw_6l6ijD8faJ4nI"
		// 	// libraries={["places", "geometry"]}
		// 	onLoad={() => console.log('Google Maps loaded successfully')}
		// 	onError={(error) => console.error('Failed to load Google Maps:', error)}
		// 	loadingElement={<div style={{ display: 'none' }} />}
		// >
		<>
		 <Toaster position="top-right" />
		<Router>
				<Switch>
					<Route path="/dashboard" exact component={Dashboard} />
					<Route path="/bills" exact component={Bills} />
					<Route path="/rides" exact component={Rides} />
					<Route path="/groceries" exact component={Groceries} />
					<Route path="/foods" exact component={Foods} />
					<Route path="/food-vendor" exact component={FoodVendor} />
					<Route path="/vendor-login" exact component={VendorLogin} />
					<Route path="/vendor-onboarding" exact component={Onboarding} />
					<Route path="/vendor-signup" exact component={VendorSignup} />
					<Route exact path="/" component={isMobile ? BenefitsPage : Landing } />
					<Route path="/signup" component={Signup} />
					<Route path="/login" component={Login} />
					<Route path="/forgot-password" component={Forgot} />
					<Route exact path="/reset" component={Forgot} />
					<Route path="/reset/:token" component={ResetPassword} /> {/* Updated Route */}
				</Switch>
			</Router>
		</>
			
		//  </LoadScript>
    );
}

export default App;
