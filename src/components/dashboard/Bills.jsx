import { useContext, useEffect, useState } from 'react';
import { DealContext } from '../../DealContext';
import {
  Navbar,
  Wallet,
  Actions,
  Transactions,
  MTransactions,
  MTrans,
  Settings,
  Stats,
  More,
  Subheader
} from '../../containers';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { MdHome, MdSettings, MdWatchLater, MdWidgets, MdHistory, MdWallet  } from "react-icons/md";


const Bills = () => {
  const { loggedUser, setLoggedUser } = useContext(DealContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useHistory();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { updateBalance, balance  } = useContext(DealContext);

  // console.log(loggedUser);
  const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	 };

   
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

     // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Retrieve user from localStorage
  const user = (() => {
    // const loggedUser = localStorage.getItem('loggedUser');
    // const walletData = localStorage.getItem('wallet');
    // const accountData = localStorage.getItem('account');
    const sessionToken = localStorage.getItem('session_token'); // Get session token

    const walletData = JSON.stringify(loggedUser.wallet);
    const accountData = JSON.stringify(loggedUser?.account);
    const pinData = JSON.stringify(loggedUser?.transaction_pin);
    const userData = JSON.stringify(loggedUser.user);


    // if (!loggedUser || !walletData) {
    //   localStorage.clear();
    //   return null;
    // }

    return {
      user: userData? JSON.parse(userData) : '',
      wallet: walletData ? JSON.parse(walletData) : '',
      account: accountData? JSON.parse(accountData) : '',
      transaction_pin: pinData? JSON.parse(pinData) : '',
      sessionToken, // Store session token
    };
  })();

  let csrfFetched = false;

  // // Check session validity on mount
  useEffect(() => {
    if (!user || !user.user) {
      //localStorage.clear();
      //history.push('/'); // Redirect to login
    } else {
      setLoggedUser(user);
      if (csrfFetched) return;
      checkSessionValidity(); 
      csrfFetched = true;
    }
  }, [balance]);

  useEffect(() => {
  }, [updateBalance]);

  const checkSessionValidity = async () => {
    // console.log(user.user.id);
    try {
        // Fetch CSRF cookie first if using Sanctum
        await axios.get(`${getBaseUrl()}/sanctum/csrf-cookie`, {
            withCredentials: true
        });

        const response = await axios.get(`${getBaseUrl()}/check-session`, {
            withCredentials: true, // Ensures cookies (for Sanctum)
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'User-Id': user.user.id,
                'Session-Token': localStorage.getItem('session_token'),
                'Content-Type': 'application/json',
            },
        });

       // console.log("Session Check Response:", response.data);

        if (response.data.status !== 'active') {
             logoutUser();
        }
    } catch (error) {
        if (error.response?.status === 401) {
             logoutUser();
        }
    }
};

const handleTabChange = (menuKey, link) => {
  if (isMobile && activeTab === 'home') {
    if (!isModalOpen) {
      navigate('/dashboard');
    } else {
      setActiveTab(menuKey); // Update tab without navigating
    }
  } else {
    navigate(link);
  }
};

useEffect(() => {
  if(!isMobile) {
    setActiveTab('');
  }else{
    setActiveTab('home');
  }
}, [isMobile])


  // Logout user and redirect to login
  const logoutUser = () => {
		document.cookie = `lastUser=; path=/; max-age=0`;
		localStorage.clear();
		// resetUser();
		// googleLogout();
		navigate.push('/');
  };
  

  return (
    <div className="App min-h-screen">
      {!isMobile && user && (
        <div>
          <Navbar user={user} />
          <Wallet user={user} />
          {user.user.role === "1" && <Stats user={user} />} {/* Show Stats for role 1 */}
          {/* <Actions user={user} /> */}
          <Actions
            user={user}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
          <Transactions user={user} />
        </div>
      )}

    <div>
      {activeTab === 'home' && (
        <div className='mb-2'>
           {/* <Navbar user={user} /> */}
           <Subheader
              title='Pay Bills'
              subtitle="Airtime, Data & Utilities"
              onBack={() => {
                if (isMobile && activeTab === 'home' && isModalOpen) {
                  // setActiveTab('bills'); // or any other fallback behavior
                  navigate.push('/bills');
                } else {
                  navigate.push('/dashboard');
                }
              }}
            />
           {/* <Wallet user={user} /> */}
           {/* {user.user.role === "1" && <Stats user={user} />}  */}
          {/* <Actions user={user} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>  */}
          <Actions
            user={user}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      )}
      {activeTab === 'wallet' && (
        <div className='mb-14'>
          <Subheader title="My Wallet" subtitle="Manage your wallet"
           onBack={() => {
              setActiveTab('home');
           }}
          />
          {/* <Wallet user={user} /> */}
          {/** wallet transactions **/}
          <MTrans user={user}/>
        </div>
        )}
      {activeTab === 'settings' && (
        <div className='mb-14'>
          <Subheader title='Settings' 
           onBack={() => {
              setActiveTab('home');
           }}
          />
          <Settings user={user} />
        </div>
        )}
      {activeTab === 'transactions' && (
        <div>
          <Subheader title='Transactions' 
          onBack={() => {
              setActiveTab('home');
           }}
          />
          <MTransactions user={user} />
        </div>
      )
      }
      {activeTab === 'more' && (
        <div className='mb-14'>
          <Subheader title='Extras' 
          onBack={() => {
              setActiveTab('home');
           }}/>
          <More user={user} />
        </div>
        )}
      {/* {activeTab === 'logout' && logoutUser()} */}
    </div>

      {isMobile && (
            <div className="fixed bottom-0 left-0 w-full bg-[#0d2b36] rounded-t-2xl text-[#c0c0c0] flex justify-around py-3 shadow-md border-t border-gray-800">
                    <button onClick={() => navigate.push('/')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'home' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdHome size={20} />
                  {/* <span className="text-sm">Home</span> */}
                  {/* {activeTab === 'home' && (<div><span className="text-sm">Home</span></div>)} */}
              </button>
        
              <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'transactions' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWatchLater  size={20} />
              </button>
              <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center rounded-md bg-green-900 p-3 border border-gray-600 ${activeTab === 'wallet' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWallet  size={25} />
              </button>
              
              <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'settings' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdSettings size={20} />
                {/* <span className="text-sm">Settings</span> */}
                {/* {activeTab === 'settings' && (<div><span className="text-sm">Settings</span></div>)} */}
              </button>
              <button onClick={() => setActiveTab('more')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'more' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWidgets size={20} />
              </button> 
              
            </div>
      )}
    </div>
  );
};

export default Bills;
