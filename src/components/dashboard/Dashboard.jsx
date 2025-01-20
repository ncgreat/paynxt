import { useContext, useEffect } from 'react';
import { DealContext } from '../../DealContext';
import {
	Footer,
	Navbar,
	Wallet,
	Actions,
	Transactions,
} from '../../containers';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
	const { loggedUser, setLoggedUser } = useContext(DealContext);
	const navigate = useHistory();
	const user =
		localStorage.getItem('loggedUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedUser'))
			: localStorage.clear();
	const wallet =
		localStorage.getItem('loggedUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('wallet'))
			: localStorage.clear();

	useEffect(() => {
		const navigationEntries = window.performance.getEntriesByType('navigation');
		if (user === null) {
			navigate.push('/', { replace: true });
		}
		if (
			navigationEntries.length > 0 &&
			navigationEntries[0].type === 'reload'
		) {
			// console.log(user);
			if (user !== null) {
				// console.log('Page was reloaded' + user.name);
				setLoggedUser(user);
				// navigate('/dashboard', { replace: true });
			} else {
				navigate.push('/', { replace: true });
			}
		}
	}, []);

	return (
		<div className="App">
			{user && (
				<div>
					<div>
						<Navbar user={user && user} />
					</div>
					<Wallet user={user && wallet} />
					<Actions user={user && user}/>
					<Transactions user={user && user} />
					{/* <Footer /> */}
				</div>
			)}
		</div>
	);
};

export default Dashboard;
