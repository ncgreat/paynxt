import { motion } from 'framer-motion';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
	RiWallet2Fill,
	RiUser3Line,
	RiSettings2Fill,
	RiNotification2Fill,
} from 'react-icons/ri';
import { FiEye, FiEyeOff  } from 'react-icons/fi'
import { IoIosWallet } from 'react-icons/io';
import { FaDiaspora } from "react-icons/fa";
import { NumericFormat } from 'react-number-format';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import PaystackPop from '@paystack/inline-js'
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useHistory } from 'react-router-dom';
import { useFlutterwave, closePaymentModal  } from 'flutterwave-react-v3';

import './wallet.css';
import { useEffect, useState, useContext, useRef  } from 'react';
import { DealContext } from '../../DealContext';
import palmpay from '../../assets/palmpay.png';
import paystack from '../../assets/paystack.png';
import user_pic from '../../assets/user-icon.png';
import logo from '../../assets/logo.png';
const Wallet = ({ user }) => {
	const {loggedUser, setLoggedUser, balance, resetBalance  } = useContext(DealContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [topWallet, setTopWallet] = useState(false);
	const [fundWallet, setFundWallet] = useState(false);
	const [paymentDetails, setpaymentDetails] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [amount, setAmount] = useState('');
	const [newBalance, setNewBalance] = useState(0);
	const [isBalanceVisible, setIsBalanceVisible] = useState(true);
	const [isVirtual, setIsVirtual] = useState(false);
	const phoneRef = useRef(null);
	const [input, setInput] = useState('');
	const [inputError, setInputError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [showDropdown, setShowDropdown] = useState(false);
	const [notifications, setNotifications] = useState(1);
	// const [paymentData, setPaymentData] = useState('');
	const [bank, setBank] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [accountName, setAccountName] = useState('');
	const [isGenerate, setIsGenerate] = useState(false);


	let wallet = user.wallet;
	const [currentBalance, setCurrentBalance] = useState(
		parseFloat(wallet.available_balance),
	);
	const [oldBalance, setOldBalance] = useState(0);
	const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
	const [isPaymentCount, setIsPaymentCount] = useState(0);
	const [greeting, setGreeting] = useState('');
	const navigate = useHistory();

	const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	 };

	 const getCookie = (name) => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	  };

	  
	  useEffect(() => {
		const encodedUser = getCookie('lastUser');
		// console.log(encodedUser);
		if(!encodedUser){
			navigate.push('/'); // Redirect to login
		}
	
	  }, [])

	  useEffect(() => {
		// const userName = getCookie('lastUserName');
		const encodedUser = getCookie('lastUser');
		if (encodedUser) {
		  try {
			const user1 = JSON.parse(atob(encodedUser));
			// setUser(user);
			// console.log(user1.logged);
			setLoggedUser(user1.logged);
			user = user1.logged.user;
			// console.log(user);
			first_name = user?.name.split(' ')[0];
		  } catch (err) {
			console.error("Error decoding user cookie:", err);
		  }
		}
		if(user == undefined){
			user=user? user.user : loggedUser.user;
			first_name = user?.name.split(' ')[0];
			// console.log(user);
		}
	  }, []);


	const randomId = uuidv4();
	// user=user.user;
	user=user? user.user : loggedUser.user;

	// console.log(balance);
	// console.log(currentBalance);
	let first_name = '';
	if(user){
		first_name = user?.name.split(' ')[0];
	}

	

	const fund = () => {
		setIsModalOpen(true);
		setFundWallet(true);
	};

	const topup = () => {
		// setIsModalOpen(true);
		setFundWallet(false);
		setTopWallet(true);
	};

	
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


	const updateBalance1 = async (amount) => {
		// console.log(amount);
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
			//topup = topup/100;
			const data = await response.json();
			// console.log(data);
			let new_balance = parseFloat(data.available_balance) + parseFloat(amount);
			setNewBalance(new_balance);
			setOldBalance(currentBalance);
			setCurrentBalance(new_balance);

			const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
			loggedUser.wallet_balance = new_balance.toString();
			localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

			const wallet = JSON.parse(localStorage.getItem('wallet'));
			wallet.available_balance = new_balance.toString();
			localStorage.setItem('wallet', JSON.stringify(wallet));
			topup_wallet(new_balance);
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



	const generateVirtual = () => {
		console.log("Generating virtual wallet...");
		setIsModalOpen(true);
		setIsVirtual(true);
	} 

	const handleContinue = async() => {
		// console.log(input);
		if(!input || !phoneNumber){
			if(phoneNumber.length < 11 || phoneNumber.length > 11) {
				setPhoneError("Phone number is invalid.");
			}

			if(input.length < 11 || input.length > 11) {
				setInputError("BVN/NIN is invalid.");
				return;
			}

		}
		setPhoneError(""); // Clear error if valid
		setInputError("");
		const response = await fetch(`${getBaseUrl()}/virtual_account`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: user.email,
				name:user.name,
				phoneNumber,
				nin:input,
				bvn:input,
				_id:user.id
			}),
		});
		const data = await response.json();
		// console.log(data);
		setIsModalOpen(false);
		setIsVirtual(false);
		if (data && data.account) {
			const wallet = JSON.parse(localStorage.getItem('wallet')) || {};
			
			// Update wallet with the new account details
			wallet.bank = data.account.bank_name;
			wallet.account_name = data.account.account_name;
			wallet.account_number = data.account.account_number;
		
			// Save updated wallet to localStorage
			localStorage.setItem('wallet', JSON.stringify(wallet));
			window.location.reload();
			console.log('Wallet updated successfully:', wallet);
		} else {
			console.error('Invalid response data:', data);
		}

	};
		
	// Function to format the price as currency
    const formatPrice = price => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        }).format(price);
    };
	
	useEffect(() => {
		// Pusher.logToConsole = true;
		if (!user?.id) return;
	
		const pusher = new Pusher("63d0c602062f1948fc04", {
			cluster: "mt1",
			encrypted: true,
			enabledTransports: ["ws", "wss"], 
		});
	
		const userId = user?.id; // Ensure user is defined
	
		if (!userId) return;
	
		const channel = pusher.subscribe(`user.${userId}`);
	
		// console.log(`Subscribed to user.${userId}`);
	
		// Handle Wallet Update Event
		channel.bind("transactionUpdated", function (data) {
			updateWalletBalance(data.amount);
			const wallet = JSON.parse(localStorage.getItem("wallet"));
			let old_balance = wallet.available_balance;
			let new_balance = parseFloat(old_balance) + parseFloat(data.amount);
			wallet.available_balance = new_balance.toString();
			localStorage.setItem("wallet", JSON.stringify(wallet));
			// updateBalance(new_balance);
			setNewBalance(new_balance);
			setOldBalance(old_balance);
			setCurrentBalance(new_balance);
	
			Swal.fire({
				title: "Wallet Update",
				text: `Your wallet has just received ₦${formatPrice(data.amount)}`,
				icon: "success",
				customClass: { container: "borderless" },
			});
		});
	
		// ✅ Handle User Logout Event
		channel.bind("user-logout", () => {
			// console.log("Logging out due to another login...");

			document.cookie = `lastUser=; path=/; max-age=0`;
			localStorage.clear();
			// resetUser();
			// googleLogout();
	
			// Redirect to login page
			navigate.push("/");
	
			Swal.fire({
				title: "Session Expired",
				text: "You've been logged out because your account was accessed from another device.",
				icon: "warning",
				confirmButtonText: "OK",
			});
		});
	
		channel.bind("pusher:subscription_succeeded", () => {
			// console.log(`Successfully subscribed to user.${userId}`);
		});
	
		pusher.connection.bind("error", (err) => {
			// console.error("Pusher error:", err);
		});
	
		return () => {
			channel.unbind_all();
			channel.unsubscribe();
			// pusher.disconnect();
		};
	}, [user?.id]);
	
	
	

	useEffect(() => {
		if(parseFloat(balance)>0){
			let new_balance = parseFloat(currentBalance) - parseFloat(balance);
			// let new_balance = parseFloat(balance);
			setNewBalance(new_balance);
			setOldBalance(currentBalance);
			setCurrentBalance(new_balance);
	
			const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
			loggedUser.wallet_balance = new_balance.toString();
			localStorage.setItem('loggedUser', JSON.stringify(loggedUser));
	
			const paymentRecord = {
				id: randomId,
				paymentDetails: paymentDetails,
				amount: amount,
				oldBalance: currentBalance,
				newBalance: new_balance,
				timestamp: new Date().getTime(),
			};
			localStorage.setItem('paymentRecord', JSON.stringify(paymentRecord));
			resetBalance();
			// topup_wallet(new_balance);y
		}
	}, [balance, resetBalance]);
	
	

	async function getPlans() {
		try {
			const response = await fetch(`${getBaseUrl()}/getplans`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				// body: JSON.stringify({
				// 	email,
				// 	password,
				// }),
			});

			const data = await response.json();
			console.log(data);
		} catch {}
	}

	const updateWalletBalance = async (topup) => {
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
			// topup = topup/100;
			const data = await response.json();
			// console.log(data.balance.available_balance);
			let new_balance = parseFloat(data.balance.available_balance);
			new_balance = parseFloat(new_balance) + parseFloat(topup);
			setNewBalance(new_balance);
			setOldBalance(currentBalance);
			setCurrentBalance(new_balance);

			const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
			loggedUser.wallet_balance = new_balance.toString();
			localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

			console.log(new_balance);
			// const wallet = JSON.parse(localStorage.getItem('wallet'));
			// wallet.available_balance = new_balance.toString();
			// localStorage.setItem('wallet', JSON.stringify(new_balance));

		} catch {}
	};

	useEffect(() => {
		if (!loggedUser?.wallet) return;
		// console.log(loggedUser);
		// Encode user data and store in cookie
		const encodedUser = btoa(JSON.stringify({
			logged: loggedUser
		}));
		document.cookie = `lastUser=${encodedUser}; path=/; max-age=${60 * 60 * 24 * 7}`;
		const wallet = loggedUser.wallet;
		let new_balance = parseFloat(wallet.available_balance);
	  
		setBank(wallet.bank);
		setAccountName(wallet.account_name);
		setAccountNumber(wallet.account_number);
		setCurrentBalance(new_balance); 
	  
	  }, [bank, loggedUser]);


	useEffect(() => {
		if (isModalOpen === false) {
			setTopWallet(false);
			setFundWallet(false);
			setAmount('');
		}
	}, [isModalOpen]);

	useEffect(() => {
		// setIsModalOpen(true);
		// getPlans();
		// payWithMonnify();
		setIsPaymentInProgress(false);
	}, [isPaymentInProgress]);
	// useEffect(() => {
	// 	getPlans;
	// }, []);

	const toggleEye = () => {
		// console.log('toggle');
		setIsBalanceVisible(!isBalanceVisible);
	}

	const config = {
		public_key: 'FLWPUBK-06ac0a7566cb386765adfee21cf4b779-X',
		tx_ref: Date.now(),
		amount: amount,
		currency: 'NGN',
		payment_options: 'card,mobilemoney,ussd',
		customer: {
		  email: user?.email,
		//    phone_number: '08036398894',
		  name: user?.name,
		},
		customizations: {
		  title: 'PayNxt',
		  description: 'Payment for items in cart',
		  logo: logo,
		},
	  };
	
	  const handleFlutterPayment = useFlutterwave(config);

	  
	  const walletUpdate = async () => {
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
	  

	async function topup_wallet(topup, transid) {
		try {
			const response = await fetch(`${getBaseUrl()}/wallet-update`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
					amount: topup,
					transid,
				}),
			});
			const data = await response.json();
			// console.log(data);
		} catch {}
	}


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

	function makePayment() {
		// setIsModalOpen(true);
		// getPlans();
		// payWithMonnify();
		// topup_wallet();
		walletUpdate();
		setIsPaymentInProgress(true);
	}

	function numberWithCommas(currentBalance) {
		return (
			currentBalance
				// .toFixed(2)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		);
	}

	// console.log(user.role);

	return (
		<div className="super__feature mt-5 overflow-hidden">
			<div>
				
				
				
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					className="flex flex-col w-full  lg:flex-row  "
				>
						
					<div className="flex flex-col w-full">
						{/* <div className=" flex flex-row justify-between ">
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

						</div> */}

						{/* <h2 className="mx-6 sm:mx-[95px] md:mx-[95px] lg:mx-[93px]">
							{greeting}
						</h2>
						<h3 className="flex mx-5 text-3xl sm:mx-[93px]  lg:mx-[92px] ">
							{first_name}
						</h3> */}
						{user.role != 1 && (
							<div>
							<h4 className="hidden mx-5 my-2 text-2xl mt-0 sm:mx-[93px]  lg:block mx-[91px]">
							What can we help you with?
							</h4>
						</div>
						)}
						
					</div>

				

					<div className=" flex flex-col w-full mx-0 sm:w-full md:w-full lg:w-1/5 mr-[105px] ">
					{user.role != 1 && (
						<div className=" flex lg:flex-col sm:flex flex-col md:w-full   text-[#ddd] items-center rounded-lg p-5 lg:-mt-5  border-b border-b-gray-400 rounded-b-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
						{/* <div className=" flex lg:flex-col sm:flex flex-col md:w-full m-3  text-[#ddd] items-center bg-[#582066] rounded-lg p-5"> */}
							<h2 className="flex flex-row ">
								<RiWallet2Fill className="mr-2 text-l text-[#0d2b36]" />
								{/* <span className="text-[#ccc] text-xs ">Available Balance</span> */}
								<span className="text-[#0d2b36] text-xs ">Available Balance</span>
							</h2>
							<div className='flex flex-row'>
								{isBalanceVisible ? (
								<h3 className="text-2xl mb-2 font-semibold text-[#2e2b43]">
									&#8358;{numberWithCommas(currentBalance.toFixed(2))}
								</h3>
								) : (
									<div className='flex flex-row text-gray-800 pt-2 pb-3'>
										<FaDiaspora size={14}/><FaDiaspora size={14}/><FaDiaspora size={14}/><FaDiaspora size={14}/>
									</div>
								
								)
								}
								{isBalanceVisible ? (
									<button type="button" onClick={toggleEye} className='ml-2 pb-1 text-gray-800' >
										<FiEyeOff size={16} />
									</button>
								): <button type="button" onClick={toggleEye} className='ml-2  text-gray-800' >
									<FiEye size={16} />
								</button>
								}
							</div>
						
							<button
								type="button"
								className='btn1 btn-effect-4 flex bg-[#ddd] rounded-md text-gray-800 border border-[#722984] px-6 py-1 items-center'
								onClick={fund}
							>
								<AiFillPlusCircle className=" mr-1" />
								Top-Up		
							</button>

							{/* <button
								type="button"
								className="flex bg-[#43184e] rounded-md text-[#ddd] border border-[#722984] px-2 py-1 items-center"
							>
								<IoIosWallet className="text-[#ddd] mr-1" />
								Manage Wallet
							</button> */}
						</div>
					)}
					</div>
					
				</motion.div>
				{!user.role && wallet['bank'] ===null && (
					<div className='mt-3'>
					<div className='flex flex-row bg-gray-100 mx-[1.8%] sm:mx-[95px] md:mx-3 lg:mx-[92px] rounded-lg shadow-md mb-8 pr-4'>
					<div>
						<button
						onClick={generateVirtual}
						aria-label="Generate a virtual account"
						className='bg-gray-800 p-2 m-3 rounded-md text-[#ddd] shadow-md'>
						Generate Account..
						</button>
					</div>
					
					<div className="marquee mt-5">
						<p className='mt-3 lg:mt-0'>
						In compliance with <span className='font-bold'>CBN regulations</span>, we wish to notify you that we will require your <span className='font-bold'>NIN</span> to generate a virtual account.
						</p>
					</div>
					</div>

					<div className="flex flex-row justify-center">
					<div className="or-spacer">
						<div className="mask"></div>
					</div>
					</div>

				</div>
				)}
{/* 				
				{user.role != 1 && wallet['bank']&& (
					<div>
						<div className='flex flex-row bg-gray-100 mx-[5.8%] rounded-lg shadow-md mb-8'>
							<div className=" ml-2 w-[90%] mb-8 rounded-md p-3 lg:ml-8 mt-4">
								<h2 className="">
									<span className="text-gray-700 text-xs">Direct Wallet Top Up</span>
								</h2>
								<h3>Account Name: <span className='text-bold text-gray-800'>{wallet['account_name']}</span></h3>	
								<h1>Account Number: <span className='text-bold text-gray-800'>{wallet['account_number']}</span></h1>	
								<h2>Bank: <span className='text-bold text-gray-800'>{wallet['bank']}</span></h2>
								
							</div>
							<div>
								<img src={palmpay} className='mr-8 h-[55px] rounded-xl shadow-xl mt-10 lg:mr-4' alt=''/>	
							
							</div>
							
						</div>
						<div className="flex flex-row justify-center">
							<div className="or-spacer">
							<div className="mask"></div>
							</div>
						</div>
					</div>
				)} */}
				{/* <input
					type="text"
					placeholder="Amount"
					onChange={(e) => setAmount(e.target.value)}
					className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
				/>
				<button type="submit" className="form-submit" onClick={topup_wallet}>
					Submit
				</button> */}
			</div>

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
												<div>
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
															{/* <h2>Fee:<span className='text-bold text-gray-800'> 1%</span></h2> */}
															
														</div>
														
													</div>
													{/* <div className="flex flex-row justify-center">
														<div className="or-spacer">
														<div className="mask"></div>
														</div>
													</div> */}
												</div>
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

export default Wallet;
