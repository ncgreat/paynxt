import { useContext, useEffect } from 'react';
import { DealContext } from '../../DealContext';
import {
  Navbar,
  Wallet,
  Actions,
  Transactions,
} from '../../containers';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const { loggedUser, setLoggedUser } = useContext(DealContext);
  const history = useHistory();

  // Retrieve user from localStorage
  const user = (() => {
    const loggedUser = localStorage.getItem('loggedUser');
    const walletData = localStorage.getItem('wallet');
	const accountData = localStorage.getItem('account');

    if (!loggedUser || loggedUser === 'undefined' || !walletData || walletData === 'undefined') {
      localStorage.clear();
      return null;
    }

    return {
      user: JSON.parse(loggedUser),
      wallet: JSON.parse(walletData),
	  account: JSON.parse(accountData),
    };
  })();

  useEffect(() => {
    if (!user || !user.user) {
      // If user does not exist, clear storage and redirect to login
      localStorage.clear();
      history.push('/'); // Redirect to login or home page
    } else {
      // Set loggedUser in context
      setLoggedUser(user);
    }
  }, []);

  // Render the dashboard if user exists
  return (
    <div className="App">
      {user && (
        <div>
          <Navbar user={user} />
          <Wallet user={user} />
          <Actions user={user} />
          <Transactions user={user} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
