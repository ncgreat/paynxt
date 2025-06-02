import { useContext, useEffect, useState } from 'react';
import { DealContext } from '../../DealContext';
import {
  Navbar,
  Wallet,
  Actions,
  Transactions,
} from '../../containers';
import { useHistory } from 'react-router-dom';
import { FaWallet, FaExchangeAlt, FaTasks } from 'react-icons/fa'; // Tab Icons

const Dashboard = () => {
  const { loggedUser, setLoggedUser } = useContext(DealContext);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('wallet');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Retrieve user from localStorage
  const user = (() => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      const walletData = JSON.parse(localStorage.getItem('wallet') || '{}');
      const accountData = JSON.parse(localStorage.getItem('account') || '{}');

      if (!loggedUser.id || !walletData.available_balance) {
        localStorage.clear();
        return null;
      }
      return { user: loggedUser, wallet: walletData, account: accountData };
    } catch (error) {
      localStorage.clear();
      return null;
    }
  })();

  useEffect(() => {
    if (!user?.user) {
      localStorage.clear();
      history.push('/');
    } else {
      setLoggedUser(user);
    }
  }, [user, history]);

  return (
    <div className="App min-h-screen bg-[#071a22]">
      {/* Hide Navbar on mobile */}
      {!isMobile && <Navbar user={user} />}

      {/* Content Based on Active Tab */}
      <div>
        {activeTab === 'wallet' && <Wallet user={user} />}
        {activeTab === 'actions' && <Actions user={user} />}
        {activeTab === 'transactions' && <Transactions user={user} />}
      </div>

      {/* Mobile Tab Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-[#0d2b36] text-white flex justify-around py-3 border-t border-gray-700">
          <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center ${activeTab === 'wallet' ? 'text-blue-400' : ''}`}>
            <FaWallet size={20} />
            <span className="text-sm">Wallet</span>
          </button>
          <button onClick={() => setActiveTab('actions')} className={`flex flex-col items-center ${activeTab === 'actions' ? 'text-blue-400' : ''}`}>
            <FaExchangeAlt size={20} />
            <span className="text-sm">Actions</span>
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center ${activeTab === 'transactions' ? 'text-blue-400' : ''}`}>
            <FaTasks size={20} />
            <span className="text-sm">Transactions</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
