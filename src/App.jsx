// import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// import { createBrowserHistory } from 'history';
// import 'react-loading-skeleton/dist/skeleton.css';

// import './App.css';
// import Dashboard from "./Dashboard.jsx";
// import DefaultLayout from "./components/DefaultLayout";
// import GuestLayout from "./components/GuestLayout";
// import Login from "./views/Login";
// import NotFound from "./views/NotFound";
// import Signup from "./views/Signup";
// import Users from "./views/Users";
// import UserForm from "./views/UserForm";
import { Login, Signup, Dashboard } from './components';

function App() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
	  const mediaQuery = window.matchMedia('(max-width: 768px)');
	  setIsMobile(mediaQuery.matches);
  
	  const handleWindowResize = () => setIsMobile(mediaQuery.matches);
	  mediaQuery.addListener(handleWindowResize);
  
	  return () => mediaQuery.removeListener(handleWindowResize);
	}, []);

	return (
        <Router>
            <Switch>
				{/* <Route exact path="/" component={isMobile ? MobileLanding : Landing } /> */}
				{/* <Route exact path="/dashboard" element={<Dashboard />} /> */}
				<Route path="/dashboard" exact component={Dashboard} />
                <Route exact path="/" component={Login} />
				<Route path="/signup" component={Signup} />
				<Route path="/login" component={Login} />
				{/* <Route path="/users" component={Users} /> */}
				{/* <Route path="/sign-up" element={<Signup />} /> */}
				{/* <Route path="/transactions/confirm" element={<Confirm />} /> */}
            </Switch>
        </Router>
    );
}

export default App;
