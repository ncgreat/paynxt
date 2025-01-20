import { motion } from 'framer-motion';
import { AiFillPlusCircle } from 'react-icons/ai';
import {
	RiWallet2Fill,
	RiUser3Line,
	RiSettings2Fill,
	RiNotification2Fill,
} from 'react-icons/ri';
import { IoIosWallet } from 'react-icons/io';
import { NumericFormat } from 'react-number-format';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './wallet.css';
import { useEffect, useState, useContext  } from 'react';
import { DealContext } from '../../DealContext';
const Wallet = ({ user }) => {
	const { balance, resetBalance  } = useContext(DealContext);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [topWallet, setTopWallet] = useState(false);
	const [paymentDetails, setpaymentDetails] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [amount, setAmount] = useState('');
	const [newBalance, setNewBalance] = useState(0);



	const [currentBalance, setCurrentBalance] = useState(
		parseFloat(user.available_balance),
	);
	const [oldBalance, setOldBalance] = useState(0);
	const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
	const [isPaymentCount, setIsPaymentCount] = useState(0);
	const [greeting, setGreeting] = useState('');

	const randomId = uuidv4();


	// console.log(user);

	const topup = () => {
		setIsModalOpen(true);
		setTopWallet(true);
	};

	useEffect(() => {
		if(parseFloat(balance)>0){
			// console.log(parseFloat(balance));
			// console.log(currentBalance);
			let new_balance = parseFloat(currentBalance) - parseFloat(balance);
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
			topup_wallet(new_balance);
		}
	}, [balance, resetBalance]);
	
	

	async function getPlans() {
		try {
			const response = await fetch('http://192.168.0.6:3080/api/getplans', {
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

	// const getPlans = async () => {
	// 	try {
	// 		const response = await fetch('http://localhost:3080/api/getplan', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				transId: 'MGlo4562545',
	// 				msisdn: '2348055576661',
	// 				bucketId: 12,
	// 				planId: 550,
	// 				sponsorId: 'Glotest',
	// 				quantity: 3,
	// 			}),
	// 		});
	// 		const data = await response.json();
	// 		console.log(data);
	// 	} catch {}
	// };
	const updateBalance = async (topup) => {
		try {
			const response = await fetch('http://localhost:3080/api/get_balance', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.wallet_id,
				}),
			});
			const data = await response.json();
			// console.log(data);
			let new_balance = parseFloat(data.balance) + parseFloat(topup);
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
			topup_wallet(new_balance);
		} catch {}
	};

	useEffect(() => {
		if (isModalOpen === false) {
			setTopWallet(false);
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

	const payWithMonnify = () => {
		try {
			MonnifySDK.initialize({
				amount: amount.replaceAll(',', ''),
				customerName: user.name,
				customerEmail: user.email,
				paymentReference: randomId,

				currency: 'NGN',
				reference: new String(new Date().getTime()),
				customerFullName: user.name,
				// customerEmail: user.email,
				apiKey: import.meta.env.VITE_REACT_APP_MONNIFY_ID,
				contractCode: '4980947450',
				paymentDescription: 'Trial transaction',

				// onLoadStart: () => {
				// 	console.log('loading has started');
				// },
				// onLoadComplete: () => {
				// 	console.log('SDK is UP');
				// },
				onComplete: function (response) {
					let topup = response.authorizedAmount;
					if (topup === undefined) {
						topup = response.amountPaid;
					}

					console.log(topup);
					// updateBalance(topup);

					setIsPaymentCount((prevCount) => prevCount + 1);
					setIsModalOpen(false);
					setAmount('');
				},
				onClose: function (data) {
					// Implement what should happen when the modal is closed here
					console.log(data);
				},
			});
		} catch {}
	};

	async function topup_wallet(new_balance) {
		try {
			const response = await fetch('http://localhost:3080/api/wallet-update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.wallet_id,
					amount: new_balance,
				}),
			});
			const data = await response.json();
			console.log(data);
		} catch {}
	}

	// const login = async () => {
	// 	const username = import.meta.env.VITE_REACT_APP_MONNIFY_ID;
	// 	const password = import.meta.env.VITE_REACT_APP_MONNIFY_SECRET_KEY;

	// 	try {
	// 		const credentials = `${username}:${password}`;
	// 		const base64Credentials = btoa(credentials);

	// 		const response = await axios.post(
	// 			'https://sandbox.monnify.com/api/v1/auth/login',
	// 			{ grant_type: 'password' },
	// 			{
	// 				headers: {
	// 					Authorization: `Basic ${base64Credentials}`,
	// 					'Content-Type': 'application/json',
	// 				},
	// 			},
	// 		);

	// 		setAccessToken(response.data.responseBody.accessToken);

	// 		// Use the access token as needed
	// 		console.log(accessToken);
	// 	} catch (error) {
	// 		// Handle any errors
	// 		console.log(error);
	// 	}
	// };

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
		payWithMonnify();
		// setIsPaymentInProgress(true);
	}

	function numberWithCommas(currentBalance) {
		return (
			currentBalance
				// .toFixed(2)
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		);
	}

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
					<div className="flex flex-col w-full ">
						<div className=" flex flex-row justify-between ">
							<RiUser3Line className="mx-6 mt-3 text-xl sm:mx-[95px] md:mx-[95px] lg:mx-[130px]" />
							<div className="block lg:hidden">
								<RiNotification2Fill className=" mx-8 mt-3 text-xl sm:mx-[95px] md:mx-[95px] lg:mx-[92px]" />
							</div>
						</div>

						<h2 className="mx-6 sm:mx-[95px] md:mx-[95px] lg:mx-[93px]">
							{greeting}
						</h2>
						<h3 className="mx-5 text-3xl sm:mx-[93px]  lg:mx-[91px]">
							{user.name}
						</h3>
						<h4 className="hidden mx-5 text-2xl mt-8 sm:mx-[93px]  lg:block mx-[91px]">
							What can we help you with?
						</h4>
					</div>

					<div className=" flex flex-col w-full mx-0 sm:w-full md:w-full lg:w-1/5 mr-[105px] mb-5">
						<div className=" flex lg:flex-col sm:flex flex-col md:w-full m-3  text-[#ddd] items-center rounded-lg p-5">
						{/* <div className=" flex lg:flex-col sm:flex flex-col md:w-full m-3  text-[#ddd] items-center bg-[#582066] rounded-lg p-5"> */}
							<h2 className="flex flex-row ">
								<RiWallet2Fill className="mr-2 text-l text-[#0f3512]" />
								{/* <span className="text-[#ccc] text-xs ">Available Balance</span> */}
								<span className="text-[#0f3512] text-xs ">Available Balance</span>
							</h2>
							<h3 className="text-2xl mb-2 font-semibold text-[#2e2b43]">
								&#8358;{numberWithCommas(currentBalance.toFixed(2))}
							</h3>
							{/* <button
								type="button"
								className='btn1 btn-effect-4 flex bg-[#ddd] rounded-md text-gray-800 border border-[#722984] px-6 py-0.5 items-center mb-2'
								onClick={topup}
							>
								<AiFillPlusCircle className=" mr-1" />
								Top-Up		
							</button> */}
							{/* <button
								type="button"
								className="flex bg-[#43184e] rounded-md text-[#ddd] border border-[#722984] px-2 py-1 items-center"
							>
								<IoIosWallet className="text-[#ddd] mr-1" />
								Manage Wallet
							</button> */}
						</div>
						{/* <div className="ml-3  bg-[#582066] rounded-md p-5">
							<h2 className="flex flex-row ">
				
								<span className="text-[#ccc] text-xs">Wallet History</span>
							</h2>
							
							<button
								type="button"
								className="flex bg-[#ddd] rounded-md text-gray-800 px-2 py-1 items-center"
							
							>
								<AiFillPlusCircle className="text-[#582066] " />
								View History
							</button>
						</div> */}
					</div>
				</motion.div>

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
										className=" w-full text-[#582066]"
									>
										<span className="font-bold drop-shadow">MegaDeals</span>{' '}
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
											<span className="font-bold text-[#042326]">
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
													className="block py-3 pr-3 pl-8 px-5  w-full text-gray-500 leading-4 bg-transparent mb-2 rounded-lg border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
											</div>
											<button
												onClick={makePayment}
												type="button"
												className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
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
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

export default Wallet;
