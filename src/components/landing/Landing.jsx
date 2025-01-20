import { useHistory } from 'react-router-dom';
import {
	Footer,
	Header,
	Navbar,
	Partners,
	Feature,
	CTA,
} from '../../containers';
import { useEffect } from 'react';
const Landing = () => {
	const user =
		localStorage.getItem('loggedUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedUser'))
			: localStorage.clear();
	const navigate = useHistory();
	useEffect(() => {
		if (user) {
			navigate.push('/dashboard', { replace: true });
		}
	}, [user]);

	return (
		<div className="App">
			<div>
				<Navbar />
				{/* <Header /> */}
			</div>
			{/* <Partners /> */}
			{/* <Feature /> */}
			{/* <CTA /> */}
			{/* <Footer /> */}
		</div>
	);
};

export default Landing;
