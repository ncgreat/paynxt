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
  More,
  Flashdeals,
  Stats,
  Mdash,
  Promo,
  Subheader
} from '../../containers';
import {
	RiNotification2Fill,
} from 'react-icons/ri';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import user_pic from '../../assets/user-icon.png';
import {  Button } from "../../components/ui/";

import { MdHome, MdSettings, MdWatchLater, MdWallet, MdHistory, MdWidgets  } from "react-icons/md";


const Dashboard = () => {
  const { loggedUser, setLoggedUser, setViewMore } = useContext(DealContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const history = useHistory();
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { updateBalance, balance, viewMore  } = useContext(DealContext);
  const [notifications, setNotifications] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionLength, setTransactionLength] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deals, setDeals] =useState(false);

  const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	 };

     // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const user = (() => {
    const sessionToken = localStorage.getItem('session_token'); // Get session token

    const walletData = JSON.stringify(loggedUser.wallet);
    const accountData = JSON.stringify(loggedUser?.account);
    const pinData = JSON.stringify(loggedUser?.transaction_pin);
    const userData = JSON.stringify(loggedUser.user);


    return {
      user: userData? JSON.parse(userData) : '',
      wallet: walletData ? JSON.parse(walletData) : '',
      account: accountData? JSON.parse(accountData) : '',
      transaction_pin: pinData? JSON.parse(pinData) : '',
      sessionToken, // Store session token
    };
  })();

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    const checkUserSession = () => {
      const encodedUser = getCookie('lastUser');
      // console.log(encodedUser);
      if (!loggedUser || !loggedUser.user) {
        if (encodedUser) {
          try {
            const userFromCookie = JSON.parse(atob(encodedUser));
            if (userFromCookie?.logged) {
              // console.log("Restoring user from cookie:", userFromCookie.logged);
              setLoggedUser(userFromCookie.logged);
            } else {
              history.push('/'); // No valid user, go to login
            }
          } catch (error) {
            console.error("Failed to parse user from cookie", error);
            history.push('/'); // Parsing error, force login
          }
        } else {
          history.push('/'); // No cookie, redirect to login
        }
      }
    };
  
    checkUserSession();
  }, []);

  let csrfFetched = false;

  let loggeduser=user? user.user : loggedUser.user;

	// console.log(balance);
	// console.log(currentBalance);
	let first_name = '';
	if(loggeduser){
		first_name = loggeduser?.name.split(' ')[0];
	}

  // // Check session validity on mount
  useEffect(() => {
    if (!user || !user.user) {
      //localStorage.clear();
    //  history.push('/'); // Redirect to login
    } else {
      // console.log(user);
      setLoggedUser(user);
      if (csrfFetched) return;
      checkSessionValidity(); 
      csrfFetched = true;
// Check if session is still active
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

  const getTransactions = async () => {
    let currentUser = user?.user?.id;
    const encodedUser = getCookie('lastUser');
    if(currentUser == undefined){
      if (!loggedUser || !loggedUser.user) {
        if (encodedUser) {
          try {
            const userFromCookie = JSON.parse(atob(encodedUser));
            if (userFromCookie?.logged) {
              currentUser = userFromCookie.logged.user.id;
            } else {
              history.push('/'); // No valid user, go to login
            }
          } catch (error) {
            console.error("Failed to parse user from cookie", error);
            history.push('/'); // Parsing error, force login
          }
        } else {
          history.push('/'); // No cookie, redirect to login
        }
      }else{
        currentUser = loggedUser
      }
    }
    setLoading(true);
    try {
			const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=5`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: currentUser,
        }),
      });

      const data = await response.json();
      // console.log(data.transactions.length);
      setTransactionLength(data?.transactions?.length);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
  //  getTransactions()
  }, [])
  

useEffect(() => {
  if(!isMobile) {
    setActiveTab('');
  }else{
    setActiveTab('home');
  }
}, [isMobile])


useEffect(()=>{
if(viewMore === true){
  setActiveTab('transactions');
}
},[viewMore])

useEffect(() => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  if (currentHour < 12) {
    setGreeting('Good morning');
  } else if (currentHour < 18) {
    setGreeting('Good afternoon');
  } else {
    setGreeting('Good evening');
  }
}, []);

  // Logout user and redirect to login
  const logoutUser = () => {
		document.cookie = `lastUser=; path=/; max-age=0`;
		localStorage.clear();
		history.push('/');
  };

  useEffect(() => {
    if(transactionLength > 0)
      setDeals(true);
  }, [transactionLength])
  

  if (!loggedUser || !loggedUser.user) {
    return null; // or show a small Loading spinner
  }

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
        <div className='mb-14'>
           {/* <Navbar user={user} /> */}
           {/* <Wallet user={user} /> */}
           <div>
          <div className=" flex flex-row justify-between mt-12">
              <div className='flex flex-row'>
                <img src={user_pic} className='border border-gray-200 shadow-md rounded-lg p-2 w-[55px] h-[55px] mx-6 mt-1 text-xl sm:mx-[95px] md:mx-[95px] lg:ml-[95px]' alt=''/>
                <div className='flex flex-col mt-1 sm:mt-0 lg:mt-0 lg:-ml-[28%]'>
                  <h2 className="flex -mx-4 sm:-mx-[90px] sm:mt-1  lg:-ml-[15px]">
                    {greeting},
                  </h2>
                  <h3 className="flex -mx-4 text-2xl sm:-mx-[90px]  lg:-ml-[16px] ">
    
                    {first_name}
                  </h3>
                </div>
              </div>
              
              <div className="block lg:hidden absolute right-[2.5%]">
              {notifications > 0 && (
                <div 
                  className="btn1 absolute top-1 left-[50%] bg-[#ee2b2b] rounded-full h-4 w-4 flex items-center justify-center text-xs text-white"
                  onClick={() => {setNotifications(1); setShowDropdown(!showDropdown)}}
                >
                  {notifications}
                </div>
              )}
                <RiNotification2Fill 
                  className="text-[#042326] mx-8 mt-3 text-xl sm:mx-[95px] md:mx-[95px] lg:mx-[92px] cursor-pointer" 
                  onClick={() => {setNotifications(1); setShowDropdown(!showDropdown)}}
                />
                {showDropdown && (
                  <div className="absolute top-10 z-50 right-0 bg-white  rounded-lg shadow-lg p-4 w-60">
                    <p className='text-sm text-bold'>🔔 Welcome to PayNxt</p>
                    <p className='pl-6 text-sm text-[#042326]'>Seamless payments guaranteed!!!</p>
                  </div>
                )}
              </div>

            </div>
           </div>
           <Mdash user={user}/>
           <Promo user={user}/> 
           {/* <Flashdeals
              transactionLength={transactionLength}
              style={{ display: transactionLength === 0 ? 'none' : 'block' }}
            /> */}


          
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

      {activeTab === 'more' && (
        <div className='mb-14'>
          <Subheader title='Extras' 
           onBack={() => {
              setActiveTab('home');
           }}
          />
          <More user={user} />
        </div>
        )}

      {activeTab === 'transactions' && (
        <div className='mb-14'>
          <Subheader title='Transactions' 
           onBack={() => {
              setActiveTab('home');
           }}
          />
          <MTransactions user={user} />
        </div>
        )}
      {/* {activeTab === 'transactions' && <MTransactions user={user} />} */}
      {activeTab === 'logout' && logoutUser()}
    </div>

    {isMobile && (
  <div 
    className="fixed bottom-0 left-0 w-full bg-[#0d2b36] rounded-t-2xl text-[#c0c0c0] flex justify-around py-3 shadow-md border-t border-gray-800 z-20"
  >
    <button 
      onClick={() => {setActiveTab('home'); setViewMore(false)}} 
      className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md transform transition-transform duration-600 active:scale-150 ${
        activeTab === 'home' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''
      }`}
    >
      <MdHome size={20} />
    </button>

    <button 
      onClick={() => setActiveTab('transactions')} 
      className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md transform transition-transform duration-600 active:scale-150 ${
        activeTab === 'transactions' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''
      }`}
    >
      <MdWatchLater size={20} />
    </button>

    {/* <button 
      onClick={() => setActiveTab('wallet')} 
      className={`flex flex-col items-center rounded-md bg-green-900 p-3 border border-gray-600 transform transition-transform duration-600 active:scale-90 ${
        activeTab === 'wallet' ? 'text-green-700 border-green-500' : 'text-gray-600'
      }`}
    >
      <MdWallet size={25} />
    </button> */}

    <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center rounded-md bg-green-900 p-3 border border-gray-600 ${activeTab === 'wallet' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
        <MdWallet  size={25} />
     </button>

    <button 
      onClick={() => setActiveTab('settings')} 
      className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md transform transition-transform duration-600 active:scale-150 ${
        activeTab === 'settings' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''
      }`}
    >
      <MdSettings size={20} />
    </button>

    <button 
      onClick={() => setActiveTab('more')} 
      className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md transform transition-transform duration-600 active:scale-150 ${
        activeTab === 'more' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''
      }`}
    >
      <MdWidgets size={20} />
    </button>
  </div>
)}

    </div>
  );
};

export default Dashboard;
