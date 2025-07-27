import { DealContext } from '../../DealContext';
import { motion } from 'framer-motion';
import { AiFillPlusCircle } from 'react-icons/ai';
import React,{ useEffect, useState, useContext, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import { ChevronDown } from "lucide-react";
import PaystackPop from '@paystack/inline-js'
import palmpay from '../../assets/palmpay.png';
import paystack from '../../assets/paystack.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { 
  RiCheckboxCircleFill, 
  RiSmartphoneLine, 
  RiWifiLine, 
  RiTv2Line, 
  RiFootballLine, 
  RiRestaurantLine, 
  RiShoppingCart2Line, 
  RiFlashlightLine, 
  RiWifiOffFill,
  RiWifiFill,
  RiSmartphoneFill
} from "react-icons/ri";

import { Receipt, ShoppingCart, ShoppingBag, CreditCard, Utensils,  Zap,   Smartphone, Tv, BookOpen, Phone } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {  Button } from "../../components/ui/";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import './transactions.css';

const MTrans = ({ user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  // const { updateBalance, viewMore, setViewMore } = useContext(DealContext);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topWallet, setTopWallet] = useState(false);
  const [fundWallet, setFundWallet] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
	const [isVirtual, setIsVirtual] = useState(false);
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [accountName, setAccountName] = useState('');
  const hasInitialized = useRef(false);
  // Safely accessing user
  let wallet = user.wallet;
  user = user?.user;

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  };

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleTransDetails = (transId) => {
    setIsModalOpen(true);
    userTransactions.map((trans) => {
      if (trans.id === transId) {
        setShowDetails(!showDetails);
        setExpandedOrder(expandedOrder === transId ? null : transId);
        // console.log(trans);
        setSelectedTransactions([...selectedTransactions, trans]);
      }
    })
  };

	const fund = () => {
		setIsModalOpen(true);
		setFundWallet(true);
	};

	const topup = () => {
    console.log('topup');
		// setIsModalOpen(true);
		setFundWallet(false);
		setTopWallet(true);
	};

	const [currentBalance, setCurrentBalance] = useState(
		parseFloat(wallet.available_balance),
	);

  	async function topup_wallet(new_balance) {
		try {
			const response = await fetch(`${getBaseUrl()}/wallet-update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
					amount: new_balance,
				}),
			});
			const data = await response.json();
			// console.log(data);
		} catch {}
	}

  function makePayment() {
    console.log('make payment');
		walletUpdate();
		setIsPaymentInProgress(true);
	}

  
    const checkPaymentStatus = async (reference) => {
      try {
        const response = await axios.post(`${getBaseUrl()}/payment-callback`, { reference });
        if (response.data.status === 'success') {
          console.log('Payment verified successfully:', response.data.data);
          // updateBalance(response.data.data.amount);
          updateBalance(response.data.data.amount, response.data.data.reference);
          setIsPaymentInProgress(false);
  
        } else {
          console.log('Payment verification failed:', response.data.message);
        }
      } catch (error) {
        // console.error('Error checking payment status:', error);
      }
    };

  const walletUpdate = async () => {
    console.log('wallet update');
      try {
        // Step 1: Initialize the transaction
        const response = await axios.post(
        `${getBaseUrl()}/wallet-topup`,
        {
          email: user?.email,
          amount: amount,
        },
        {
          headers: {
          'Content-Type': 'application/json',
          },
        }
        );
      
        const data = response?.data;

      
        // Step 2: Extract access_code and reference from response
        const accessCode = data?.data?.data?.access_code;
        const reference = data?.data?.data?.reference;

      
        if (accessCode) {
        setIsModalOpen(false);
      
        // Step 3: Open the Paystack transaction popup
        const popup = new PaystackPop();
        const paystackWindow = popup.resumeTransaction(accessCode);
      
        // Step 4: Monitor `isActive` to detect popup closure
        const monitorPopup = setInterval(() => {
          if (!paystackWindow.isActive) {
          // console.log('Transaction popup closed');
          clearInterval(monitorPopup);
      
          // Step 5: Verify the transaction after popup closure
          if (reference) {
            checkPaymentStatus(reference); // Call a function to verify the transaction status
          } else {
          //   console.error('Transaction reference is missing');
          }
          }
        }, 500); // Check every 500ms
        } else {
        // console.error('Access code not found in the response');
        }
      } catch (error) {
      //   console.error('Error:', error.response || error.message);
      }
  };

  	useEffect(() => {
		setIsPaymentInProgress(false);
	}, [isPaymentInProgress]);


  	const updateBalance = async (topup, transid) => {
		try {
			const response = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			topup = topup/100;
			const data = await response.json();
			let new_balance = parseFloat(data.available_balance) + parseFloat(topup);
			setNewBalance(new_balance);
			setOldBalance(currentBalance);
			setCurrentBalance(new_balance);

			const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
			loggedUser.wallet_balance = new_balance.toString();
			localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

			const wallet = JSON.parse(localStorage.getItem('wallet'));
			wallet.available_balance = new_balance.toString();
			localStorage.setItem('wallet', JSON.stringify(wallet));

			topup_wallet(topup, transid);
		} catch {}
	};

	async function topup_wallet(new_balance) {
		try {
			const response = await fetch(`${getBaseUrl()}/wallet-update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
					amount: new_balance,
				}),
			});
			const data = await response.json();
			// console.log(data);
		} catch {}
	}


  const serviceIcons = {
    airtime: <RiSmartphoneFill size={16} className="transaction__icon-success" />,
    data: <RiWifiFill size={16} className="transaction__icon-success" />,
    cable: <RiTv2Line size={16} className="transaction__icon-success" />,
    betting: <RiFootballLine size={16} className="transaction__icon-success" />,
    food: <RiRestaurantLine size={16} className="transaction__icon-success" />,
    groceries: <RiShoppingCart2Line size={16} className="transaction__icon-success" />,
    electricity: <RiFlashlightLine size={16} className="transaction__icon-success" />,
  };

    useEffect(() => {
      // Centralized modal cleanup logic
      if (!isModalOpen) {
        resetModalStates(); // Reset all modal-related states
      }
  
      }, [isModalOpen]);
  
      const resetModalStates = () => {
        setShowDetails(false);
        setSelectedTransactions([]);
      }

  const getTransactions = async () => {
    setLoading(true);
    try {
      // const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=5`, {
			const response = await fetch(`${getBaseUrl()}/get_transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: user?.id,
        }),
      });

      const data = await response.json();
      setUserTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 0);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // useEffect(() => {
  //   if (hasInitialized.current) return;
  //   hasInitialized.current = true;
  //   if (user?.id) {
  //     getTransactions();
  //   }
  // }, [currentPage, updateBalance, user?.id]);

    useEffect(() => {
    if (user?.id && !hasInitialized.current) {
      hasInitialized.current = true;
      getTransactions();
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (hasInitialized.current && user?.id) {
      getTransactions();
    }
  }, [currentPage]);

    useEffect(() => {
      if (isModalOpen === false) {
        setTopWallet(false);
        setFundWallet(false);
        setAmount('');
      }
    }, [isModalOpen]);
  

    	// Function to format the price as currency
    const formatPrice = price => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        }).format(price);
    };
  
  function numberWithCommas(currentBalance) {
		return (
			currentBalance
				// .toFixed(2)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		);
	}

  const TimestampFormatter = ({ timestamp }) => {
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);

      // Extract date and time components
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return <span>{formatTimestamp(timestamp)}</span>;
  };

     const iconMap = {
      buyData: Smartphone,      // Mobile Data
      buyAirtime: Phone,  // Airtime
      Electricity: Zap,         // Electricity
      CableTV: Tv,              // TV
      Food: Utensils,
      Educational: BookOpen,    // Education
      GiftCards : CreditCard,
    };


  const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
      const colorMap = {
      buyData: "text-emerald-500",
      buyAirtime: "text-orange-500",
      Electricity: "text-yellow-500",
      CableTV: "text-blue-500",
      Educational: "text-purple-500",
    };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // const response = await axios.get(`${getBaseUrl()}/get_transactions`); // Replace with actual endpoint
        const response = await fetch(`${getBaseUrl()}/get_transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: user?.id,
        }),
      });
      const res = await response.json();
      const backendTxns = res.transactions || [];

        const mapped = backendTxns.map((txn) => ({
          id: txn.id,
          merchant: txn.phone_num,
          amount: `₦${Number(txn.amount).toLocaleString()}`,
          type: txn.service,
          time: dayjs(txn.created_at).fromNow(),
          status: txn.status.toLowerCase(), // "Successful" → "successful"
          icon: iconMap[txn.category] || Receipt,
          color: colorMap[txn.category] || "text-gray-500",
        }));



        setTransactions(mapped);
      } catch (error) {
        console.log("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4 hover:shadow-md transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${transaction.color}`}>
                  <transaction.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.merchant}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.type} • {transaction.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">-{transaction.amount}</p>
                <Badge
                  variant={transaction.status === "successful" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SpendingOverview = () => {
  const [categories, setCategories] = useState([]);
  const [changePercent, setChangePercent] = useState(0);

  const colorMap = {
    buyData: "bg-emerald-500",
    buyAirtime: "bg-orange-500",
    Electricity: "bg-yellow-500",
    Food: "bg-purple-500",
    CableTV: "bg-blue-500",
    Educational: "bg-purple-500",
    GiftCards :"bg-green-500"
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/month_transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: user?.id }),
        });

        const res = await response.json();

        const mapped = res.transactions.map(txn => ({
          icon: iconMap[txn.category],
          name: txn.category,
          amount: `₦${txn.total.toLocaleString()}`,
          percentage: txn.percentage,
          color: colorMap[txn.category] || "bg-gray-400",
        }));

        setCategories(mapped);
        setChangePercent(res.change_percent || 0);
      } catch (err) {
        console.error("Failed to load transactions", err);
      }
    };

    fetchTransactions();
  }, []);

  const totalAmount = categories.reduce((sum, c) => {
    const numeric = Number(c.amount.replace(/[₦,]/g, ""));
    return sum + (isNaN(numeric) ? 0 : numeric);
  },0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Spending Overview</h3>
        <span className="text-sm text-muted-foreground">This Month</span>
      </div>
    {loading ? (
         <Card className="p-4 mb-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1"> <Skeleton /></p>
              <p className="text-2xl font-bold text-foreground">
                <Skeleton />
              </p>
              <p className={`text-xs mt-1 ${
                changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {/* {changePercent >= 0 ? `↑ ${changePercent}%` : `↓ ${Math.abs(changePercent)}%`} from last month */}
                <Skeleton />
              </p>
            </div>
          </Card>
            
        ) :(
          <Card className="p-4 mb-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-foreground">
                ₦{totalAmount.toLocaleString()}
              </p>
              <p className={`text-xs mt-1 ${
                changePercent >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {changePercent >= 0 ? `↑ ${changePercent}%` : `↓ ${Math.abs(changePercent)}%`} from last month
              </p>
            </div>
          </Card>
        )

    }
      

      <div className="space-y-4">
        {
         loading ? (
           Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center`}
                >
                  <Skeleton />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    <Skeleton />
                  </p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${<Skeleton />}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground"><Skeleton /></p>
                <p className="text-xs text-muted-foreground"><Skeleton /></p>
              </div>
            </div>
          </Card>
            ))
        ) :
        categories.map((category, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}
                >
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {category.name.replace(/^buy/, "")}
                  </p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                    <div
                      className={`h-2 ${category.color} rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{category.amount}</p>
                <p className="text-xs text-muted-foreground">{category.percentage}%</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


const WalletHeader = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-blue-600"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 text-white">
        {/* Balance Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <div className="text-center items-center justify-center">
            <p className="text-emerald-100 text-sm mb-2">Available Balance</p>
            <h2 className="text-4xl font-bold mb-2">₦{numberWithCommas(currentBalance.toFixed(2))}</h2>
            <div className='flex items-center justify-center'>
              <button
                type="button"
                className='btn1 btn-effect-4 mb-2 flex bg-[#ddd] rounded-md text-gray-800 border border-[#140b16] px-6 py-1 items-center'
                onClick={fund}
            >
              <AiFillPlusCircle className=" mr-1" />
                Top-Up		
            </button>
            </div>
            
            
            {/* <div className="flex flex-col">
              <h2>Top Up Summary</h2>
              <div className='flex justify-center space-x-4'>
                <div className="text-center">
                  <p className="text-2xl font-semibold">₦458.20</p>
                  <p className="text-emerald-100 text-xs">This Month</p>
                </div>
                <div className="w-px bg-white/20 mx-4"></div>
                <div className="text-center">
                  <p className="text-2xl font-semibold">₦189.45</p>
                  <p className="text-emerald-100 text-xs">This Week</p>
                </div>
              </div>
              
            </div> */}
          </div>
        </Card>
      </div>
    </div>
  );
};


  return (
    <div className="super__feature overflow-hidden">
      <WalletHeader/>
      <SpendingOverview/>
      <div className='p-5'/>
      {/* <RecentTransactions/> */}
      
            {isModalOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="fixed z-10 inset-0 overflow-y-auto backdrop-blur"
              >
                <motion.div
                  initial={{
                    scale: 0.5,
                  }}
                  animate={{ scale: 1, transition: { duration: 0.2 } }}
                  className="flex items-center justify-center min-h-screen px-4"
                >
                  <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"></div>
                  <div className="bg-white rounded-lg overflow-hidden mx-2 shadow-xl transform transition-all sm:max-w-lg w-full">
                    <div className="flex bg-[#fafafa] px-4 py-3 sm:px-6 justify-between">
                      <div className="flex items-center">
                        {/* <img src={logo} alt="logo" className="w-12" /> */}
                        <motion.div
                          initial={{ x: 200, opacity: 0 }}
                          animate={{
                            x: 0,
                            opacity: 1,
                            transition: { duration: 0.2 },
                          }}
                          className=" w-full text-[#206657]"
                        >
                          <span className="font-bold drop-shadow">PayNxt</span>{' '}
                        </motion.div>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-[#042326] hover:text-[#582066] transition ease-in-out duration-150 "
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      {fundWallet && (
                        <div>
                          <motion.div
                            initial={{ x: -200, opacity: 0 }}
                            animate={{
                              x: 0,
                              opacity: 1,
                              transition: { duration: 0.2 },
                            }}
                            className="flex w-full text-[#ddd] md:w-1/2 lg:1/4"
                          >
                            <span className="font-bold text-[#042326]">
                              Fund Wallet
                            </span>{' '}
                          </motion.div>
                          <div className="pt-4">
                            <div className="relative flex flex-col w-full text-gray-500 focus-within:text-gray-700">
                            <button
                              onClick={topup}
                              type="button"
                              className="text-white bg-[#206657] hover:bg-[#230d29] mb-5 focus:ring-2 focus:outline-none focus:ring-[#2d917b] dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                            >
                              <img 
                                src={paystack} 
                                className="w-8 mr-2 rounded-lg border border-[#257765] p-1" 
                                style={{ boxShadow: 'inset 0 0 10px 2px #206657' }} 
                                alt="paystack"
                              />
                              Pay With Paystack
                            </button>
                              <div className="flex flex-row justify-center">
                                  <div className="or-spacer">
                                  <div className="mask"></div>
                                  </div>
                                </div>
                              {/* <div>
                                <div className='flex flex-row bg-gray-100 rounded-lg shadow-md mb-8'>
                                  <div className=" ml-2 w-[90%] mb-8 rounded-md p-3 lg:ml-8 mt-4">
                                    <h2 className="">
                                      <span className="text-gray-700 text-xs">Direct Wallet Top Up By Transfer</span>
                                    </h2>
                                    <h3>Account Name: <span className='text-bold text-gray-800'>{accountName}</span></h3>	
                                    <h1>Account Number: <span className='text-bold text-gray-800'>{accountNumber}</span></h1>	
                                    <h2>Bank: <span className='text-bold text-gray-800'>{bank}</span></h2>
                                  </div>
                                  <div>
                                    <img src={palmpay} className='mr-8 h-[55px] rounded-xl shadow-xl mt-10 lg:mr-4' alt=''/>	       
                                  </div>
                                </div>      
                              </div> */}
                            </div>
                            
                            <button
                              onClick={() => setIsModalOpen(false)}
                              type="button"
                              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                      {topWallet && (
                        <div>
                          <motion.div
                            initial={{ x: -200, opacity: 0 }}
                            animate={{
                              x: 0,
                              opacity: 1,
                              transition: { duration: 0.2 },
                            }}
                            className="flex w-full text-[#ddd] md:w-1/2 lg:1/4"
                          >
                            <span className="font-bold text-[#042326] -mt-3">
                              Top Up Wallet
                            </span>{' '}
                          </motion.div>
                          <div className="pt-4">
                            <div className="relative flex items-center w-full text-gray-500 focus-within:text-gray-700">
                              <span className="absolute px-4 -mt-2 leading-5 font-medium">
                                &#8358;
                              </span>
                              <NumericFormat
                                value={amount}
                                allowLeadingZeros
                                placeholder="Amount"
                                onChange={(e) => setAmount(e.target.value)}
                                // onChange={handleChange}
                                thousandSeparator=","
                                className="block py-3 pr-3 pl-8 px-5 w-full text-gray-500 leading-4 bg-transparent mb-2 rounded-lg border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                              />
                            </div>
                            <button
                               onClick={() => {
                                makePayment();
                                // handleFlutterPayment({
                                //   callback: (response) => {
                                // 	  closePaymentModal() // this will close the modal programmatically
                                //   },
                                //   onClose: () => {},
                                // });
                                setIsModalOpen(false);
                                }}
                              type="button"
                              className="text-white bg-[#206657] mt-2 hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                            >
                              Continue
                            </button>
                            <button
                              onClick={() => setIsModalOpen(false)}
                              type="button"
                              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
      
                      {isVirtual && (
                        <div>
                          <motion.div
                            initial={{ x: -200, opacity: 0 }}
                            animate={{
                              x: 0,
                              opacity: 1,
                              transition: { duration: 0.2 },
                            }}
                            className="flex w-full text-[#ddd] md:w-1/2 lg:1/4"
                          >
                            <span className="font-bold text-[#042326]">
                              Verification Information
                            </span>{' '}
                          </motion.div>
                          <div className="pt-4">
                          <div className="relative flex flex-col items-center w-full text-gray-500 focus-within:text-gray-700">
                            <input
                                  ref={phoneRef}
                                  type="text"
                                  placeholder="Phone Number"
                                  value={phoneNumber ? phoneNumber: ''}
                                  required
                                  onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only digits
                                  if (/^\d*$/.test(value)) {
                                    setPhoneNumber(value);
                                    setPhoneError(""); // Clear error when user types
                                  }
                                  }}
                                  // style={{ display: isVisible ? "block" : "none" }}
                                  className="block py-3 pr-3 pl-2 px-5  w-full text-gray-500 leading-4 bg-transparent mb-2 rounded-lg border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                  // className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                                />
                      
                            </div>
                            {phoneError && (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-1 mb-2 rounded-md">
                                    <p>{phoneError}</p>
                                  </motion.div>
                                  )}
                            <div className="relative flex items-center w-full text-gray-500 focus-within:text-gray-700">
                            
                              <NumericFormat
                                value={input? input: ''}
                                allowLeadingZeros
                                placeholder="NIN"
                                required
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow only digits
                                  if (/^\d*$/.test(value)) {
                                    setInput(value);
                                    setInputError(""); // Clear error when user types
                                  }
                                  }}
                                // onChange={handleChange}
                                // thousandSeparator=","
                                className="block py-3 pr-3 pl-2 px-5  w-full text-gray-500 leading-4 bg-transparent mb-2 rounded-lg border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                              />
                            </div>
                            {inputError && (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-1 mb-2 rounded-md">
                                    <p>{inputError}</p>
                                  </motion.div>
                                  )}
                            <button
                              onClick={handleContinue}
                              type="button"
                              className="text-white bg-[#230d29] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                            >
                              Continue
                            </button>
                            <button
                              onClick={() => {setIsModalOpen(false); setIsVirtual(false); setInputError('');setPhoneNumber(''); setInput('')}}
                              type="button"
                              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
    </div>
  );
};

export default MTrans;
