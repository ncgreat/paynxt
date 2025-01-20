import { motion } from 'framer-motion';
import { AiFillPlusCircle } from 'react-icons/ai';
import { RiWallet2Fill, RiUser3Line, RiSettings2Fill } from 'react-icons/ri';
import { NumericFormat } from 'react-number-format';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './wallet.css';
import { useEffect, useState } from 'react';
const Wallet = ({ user }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [topWallet, setTopWallet] = useState(false);
	const [paymentDetails, setpaymentDetails] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [amount, setAmount] = useState('');
	const [currentBalance, setCurrentBalance] = useState(0);
	const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
	const randomId = uuidv4();
	const topup = () => {
		setIsModalOpen(true);
		setTopWallet(true);
	};

	useEffect(() => {
		if (isModalOpen === false) {
			setTopWallet(false);
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (isPaymentInProgress === true) {
			setCurrentBalance(currentBalance + paymentDetails.authorizedAmount);
			setIsPaymentInProgress(false);
		}
	}, [isPaymentInProgress]);

	const payWithMonnify = () => {
		MonnifySDK.initialize({
			amount: amount.replaceAll(',', ''),
			customerName: user.name,
			customerEmail: user.email,
			paymentReference: randomId,

			currency: 'NGN',
			reference: new String(new Date().getTime()),
			customerFullName: user.name,
			customerEmail: user.email,
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
				// Implement what happens when the transaction is completed.
				console.log(response);
				setIsModalOpen(false);
				setpaymentDetails(response);
				setIsPaymentInProgress(true);
			},
			onClose: function (data) {
				// Implement what should happen when the modal is closed here
				console.log(data);
			},
		});
	};

	const login = async () => {
		const username = import.meta.env.VITE_REACT_APP_MONNIFY_ID;
		const password = import.meta.env.VITE_REACT_APP_MONNIFY_SECRET_KEY;

		try {
			const credentials = `${username}:${password}`;
			const base64Credentials = btoa(credentials);

			const response = await axios.post(
				'https://sandbox.monnify.com/api/v1/auth/login',
				{ grant_type: 'password' },
				{
					headers: {
						Authorization: `Basic ${base64Credentials}`,
						'Content-Type': 'application/json',
					},
				},
			);

			setAccessToken(response.data.responseBody.accessToken);

			// Use the access token as needed
			console.log(accessToken);
		} catch (error) {
			// Handle any errors
			console.log(error);
		}
	};

	const handleChange = (event) => {
		setAmount(event.target.value);
	};

	function makePayment() {
		// console.log(amount);
		setIsModalOpen(true);
		payWithMonnify();
		// login();
		// setIsPaymentInProgress(true);
	}

	function numberWithCommas(currentBalance) {
		return currentBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		// .toFixed(2);
	}

	return (
		<div className="super__feature">
			<div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					className="super__wallet"
				>
					<div className="wallet_content">
						<RiUser3Line size={32} />

						<h3>{user.name}</h3>
					</div>
					<div className="wallet_content">
						<h2 className="flex flex-row">
							<RiWallet2Fill size={18} className="mt-1 mr-2 text-[#582066]" />
							Wallet Balance
						</h2>
						<h3 className="font-semibold">
							NGN {numberWithCommas(currentBalance.toFixed(2))}
						</h3>
						<button type="button" className="top-up" onClick={topup}>
							<AiFillPlusCircle
								size={16}
								color="#f4eff6"
								className="top__icon"
							/>
							Top-Up Wallet
						</button>
					</div>
				</motion.div>
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
						<div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
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
											className=" w-full text-[#ddd]"
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
													onChange={handleChange}
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
