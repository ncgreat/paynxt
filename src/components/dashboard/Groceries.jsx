import { useContext, useEffect, useState } from 'react';
import { DealContext } from '../../DealContext';
import {
  Navbar,
  GrocCategories,
  Popular,
  Search,
  MTransactions,
  MTrans,
  Settings,
  More,
  Promo,
  Subheader,
  GrocStores
} from '../../containers';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { FiMapPin } from "react-icons/fi";
import { MdGpsFixed } from "react-icons/md";
import { MdHome, MdSettings, MdWatchLater, MdWidgets, MdHistory, MdWallet  } from "react-icons/md";
import { Store } from 'lucide-react';
import location from '../../assets/location.gif';


const Groceries = () => {
  const { loggedUser, setLoggedUser } = useContext(DealContext);
  const history = useHistory();
  const [userCoords, setUserCoords] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { updateBalance, balance  } = useContext(DealContext);
  const [locationError, setLocationError] = useState(null);
  const [manualAddress, setManualAddress] = useState('');

  const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	 };

     // Handle screen resizing
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Retrieve user from localStorage
  const user = (() => {
    const sessionToken = localStorage.getItem('session_token'); // Get session token

    const walletData = JSON.stringify(loggedUser.wallet);
    const accountData = JSON.stringify(loggedUser?.account);
    const pinData = JSON.stringify(loggedUser?.transaction_pin);
    // const sessionToken = JSON.stringify(loggedUser.session_token); // Get session token
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
     // history.push('/'); // Redirect to login
    } else {
      setLoggedUser(user);
      if (csrfFetched) return;
      checkSessionValidity(); 
      csrfFetched = true;
    }
  }, [balance]);

const getBrowserLocation = () => {
  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported by this browser.");
    getIPFallback();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setUserCoords({ lat: latitude, lng: longitude });
      setLocationError(null); // clear error
    },
    (error) => {
      console.warn("Browser GPS failed:", error.message);
      setLocationError("We couldn’t access your location. You can enter it manually.");
      getIPFallback();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

const getIPFallback = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data && data.latitude && data.longitude) {
      setUserCoords({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
      setLocationError(null); // clear error
    } else {
      setLocationError("Unable to determine your location via IP.");
    }
  } catch (err) {
    console.error("IP fallback error:", err.message);
    setLocationError("Failed to retrieve your location.");
  }
};

const retryGetLocation = () => {
  getBrowserLocation();
};

useEffect(() => {
  // getBrowserLocation();
}, []);


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
		history.push('/');
  };

  // if (userCoords === null && locationError) {
  //   return (
  //         <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start px-6 pt-12">
  //       <img
  //         src={location} // replace with actual illustration
  //         alt="Delivery illustration"
  //         className="w-60 h-60 mb-6"
  //       />
  
  //       <h2 className="text-2xl font-bold text-gray-800 text-center">
  //         Groceries, food and more
  //       </h2>
  //       <p className="text-gray-600 text-center mt-2 mb-4">
  //         Groceries, pharmacies - anything! We need your location to serve you better.
  //       </p>
  
  //       <div className="w-full max-w-sm flex items-center border rounded-md overflow-hidden bg-white shadow-sm mb-4">
  //         <FiMapPin className="mx-3 text-gray-500" />
  //         <input
  //           type="text"
  //           value={manualAddress}
  //           onChange={(e) => setManualAddress(e.target.value)}
  //           placeholder="Enter your address"
  //           className="flex-1 py-2 px-2 outline-none"
  //         />
  //       </div>

  //       <button
  //         onClick={retryGetLocation}
  //         className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow-md mb-4"
  //       >
  //         <MdGpsFixed size={18} /> Try to detect my location
  //       </button>
  
  //       <button className="text-green-700 underline mb-10">
  //         Explore stores around you
  //       </button>

  //       <div className="text-center text-sm text-gray-500">
  //         <p>We deliver in</p>
  //         <div className="flex flex-wrap justify-center gap-2 mt-2">
  //           {[
  //             "Kaduna", "Abuja", "Jos"
  //           ].map((country, i) => (
  //             <span
  //               key={i}
  //               className="bg-white border border-gray-300 px-3 py-1 rounded-full text-sm"
  //             >
  //               {country}
  //             </span>
  //           ))}
  //         </div>
  //       </div>
  
  //       <div className="mt-10 text-xs text-gray-400 text-center">
  //         <p>&copy; {new Date().getFullYear()} PayNxt. All rights reserved.</p>
  //       </div>
  //     </div>
  //   );
  // }
  

  return (
    <div className="App min-h-screen">
      {!isMobile && user && (
        <div>
          <Navbar user={user} />
          {/* <Wallet user={user} /> */}
          {/* {user.user.role === "1" && <Stats user={user} />}  */}
          {/* <Actions user={user} />
          <Transactions user={user} /> */}
        </div>
      )}

    <div>
      {activeTab === 'home' && (
        <div className='mb-14'>
           {/* <Navbar user={user} /> */}
           <Subheader title='Get Groceries' subtitle="Order fresh items"
            onBack={() => {
                history.push('/dashboard');
            }}
           />
           <Search user={user} />
           {/* {<Promo user={user} />}  */}
          <GrocCategories user={user} /> 
          <GrocStores user={user} /> 
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
      {/* {activeTab === 'settings' && <Settings user={user} />} */}
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
           }}
          />
          <More user={user} />
        </div>
        )}
    </div>

      {isMobile && (
            <div className="fixed bottom-0 left-0 w-full bg-[#0d2b36] rounded-t-2xl text-[#c0c0c0] flex justify-around py-3 shadow-md border-t border-gray-800">
                    <button onClick={() => history.push('/')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'home' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdHome size={20} />
                 
              </button>
        
              <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'transactions' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWatchLater  size={20} />
              </button>
              {/* <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center rounded-full bg-green-900 p-3 border border-gray-600 ${activeTab === 'wallet' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWallet  size={25} />
              </button> */}
               <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center rounded-md bg-green-900 p-3 border border-gray-600 ${activeTab === 'wallet' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWallet  size={25} />
              </button>
              
              <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'settings' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdSettings size={20} />
              
              </button>
              <button onClick={() => setActiveTab('more')} className={`flex flex-col items-center bg-gray-800 p-3 mt-1 rounded-md ${activeTab === 'more' ? 'text-green-500 bg-gray-700 p-3 border border-gray-600 rounded-md' : ''}`}>
                <MdWidgets size={20} />
              </button> 
              
            </div>
      )}
    </div>
  );
};

export default Groceries;
