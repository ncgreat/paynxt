import { DealContext } from '../../DealContext';
import { Link, useHistory } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// import Swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from 'axios';
import { LuCreditCard, LuHeadphones } from 'react-icons/lu';
// import { BsPhoneFill } from 'react-icons/bs';
import {
	MdPhoneAndroid,
	MdElectricBolt,
	MdScreenshotMonitor,
	MdSmartphone,
	MdOutlineCardGiftcard,
} from 'react-icons/md';
import { IoTicketOutline } from 'react-icons/io5';
import './actions.css';
import { useEffect, useState, useRef, useContext } from 'react';
import glo from '../../assets/glo-logo.svg';
import etisalat from '../../assets/9mobile-logo.svg';
import mtn from '../../assets/mtn-logo.svg';
import airtel from '../../assets/airtel-logo.svg';
import smile from '../../assets/smile.png';
import dstv from '../../assets/dstv-logo.svg';
import gotv from '../../assets/gotv-logo.svg';
import report from '../../assets/report.png';
import call from '../../assets/call.png';
import internet from '../../assets/internet.png';
import ikeja from '../../assets/ikeja-logo.svg';
import eko from '../../assets/eko-logo.svg';
import bedc from '../../assets/bedc-logo.svg';
import abuja from '../../assets/abuja-logo.svg';
import kaduna from '../../assets/kaduna-logo.svg';
import bet9ja from '../../assets/bet9ja-logo.svg';
import xbet from '../../assets/1xbet-logo.svg';
import betway from '../../assets/betway-logo.svg';
import sportybet from '../../assets/sportybet-logo.svg';
const Actions = ({ user }) => {
	// console.log(user.id);
	const [isAirtime, setIsAirtime] = useState(false);
	const [isData, setIsData] = useState(false);
	const [isReport, setIsReport] = useState(false);
	const [isBetting, setIsBetting] = useState(false);
	const [isElectricity, setIsElectricity] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [networkSelected, setNetworkSelected] = useState('');
	const [dataPlans, setDataPlans] = useState([]);
	const phoneRef = useRef(null);
	const amountRef = useRef(null);
	const [selectedPlanId, setSelectedPlanId] = useState(null);
	const [network, setNetwork] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);
	// const [amount, setAmount] = useState('');
    const { updateBalance } = useContext(DealContext);
	const [selected, setSelected] = useState("Select biller...");
    const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false); // Input visibility
	const [phoneNumber, setPhoneNumber] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [userTransactions, setUserTransactions] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);

    const handleSelect = (option) => {
        setSelected(option.label);
        setIsOpen(false);
    };

	const buy_airtime = () => {
		setIsModalOpen(true);
		setIsAirtime(true);
		setNetworkSelected('');
	};

	const buy_data = () => {
		setIsModalOpen(true);
		setIsData(true);
		setNetworkSelected('');
	};

	const sales_report = () => {
		setIsModalOpen(true);
		setIsReport(true);
	};

	const buy_betting = () => {
		setIsModalOpen(true);
		setIsBetting(true);
	};

	const buy_electricity = () => {
		setIsModalOpen(true);
		setIsElectricity(true);
	};



	const elctric_options = [
		{ label: 'Abuja Electric', image: './src/assets/abuja-logo.svg' },
		{ label: 'Benin Electric', image: './src/assets/bedc-logo.svg' },
		{ label: 'Eko Electric', image: './src/assets/eko-logo.svg' },
		{ label: 'Kaduna Electric', image: './src/assets/kaduna-logo.svg' },
		{ label: 'Enugu Electric', image: './src/assets/abuja-logo.svg' },
		{ label: 'Ikeja Electric', image: './src/assets/ikeja-logo.png' },
		// { label: 'Ibadan Electric', image: {kaduna} },
		// { label: 'Ikeja Electric', image: {bedc} },
		// { label: 'Jos Electric', image: {bedc} },
		// { label: 'Kano Electric', image: {kaduna} },
		// { label: 'Port Harcourt Electric', image: {bedc} },
		// { label: 'Yola Electric', image: {bedc} }
	];

	const betting_options = [
		{ label: 'Bet9ja', image: './src/assets/bet9ja-logo.svg' },
		{ label: 'SportyBet', image: './src/assets/sportybet-logo.svg' },
		{ label: '1xBet', image: './src/assets/1xbet-logo.svg' },
		{ label: 'Betway', image: './src/assets/betway-logo.svg' },
	];

	const buttonStyle = {
		color: 'white',
		backgroundColor: isDisabled ? '#CCCCCC' : '#230d29',
		'&:hover': {
			backgroundColor: isDisabled ? '#CCCCCC' : '#230d29',
		},
		'&:focus': {
			outline: 'none',
			backgroundColor: isDisabled ? '#CCCCCC' : '#230d29',
			ring: '4px red',
		},
		'&:focus:dark': {
			ring: '8px red',
		},
		fontWeight: '600', // font-medium
		borderRadius: '0.375rem', // rounded-lg
		fontSize: '0.875rem', // text-sm
		display: 'inline-flex', // inline-flex
		alignItems: 'center', // items-center
		padding: '0.622rem 1.25rem', // px-5 py-2.5
		textAlign: 'center', // text-center
		marginRight: '0.5rem', // mr-2
	};

	useEffect(() => {

		getTransactions();
		// setIsLoaded(false);
		setLoading(false);

}, [currentPage, updateBalance]);


useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // const response = await fetch("http://localhost:8000/api/daily-transactions");
		const response = await fetch('http://localhost:8000/api/daily-transactions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				_id: user.id,
			}),
		});
        const data = await response.json();
        setTransactions(data.transactions);
        setTotalAmount(data.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [updateBalance]);

	const getTransactions = async () => {
		setLoading(true);
		try {
			const response = await fetch(`http://localhost:8000/api/get_transactions?page=${currentPage}&limit=5`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_id: user.id,
				}),
			});
			const data = await response.json();
			setUserTransactions(data.transactions);
			// console.log(data.transactions);
			if(JSON.stringify(data.transactions) !== "[]"){
				setTotalPages(data.totalPages);
			}else{
				setTotalPages(0);
			}
			
			// console.log(data);
			setLoading(false);
		
		} catch (error) {
			console.error("Error fetching transactions:", error);
			setLoading(false);
		}
	};

	 // Block non-numeric input (alphabets or special characters) during keydown
	 const handleKeyDown = (event) => {
		// Allow backspace (for deleting) and digits only
		if (
		  event.key !== 'Backspace' && 
		  event.key !== 'Tab' && 
		  !/^\d$/.test(event.key) // Test if the pressed key is a number
		) {
		  event.preventDefault(); // Block the input
		}
	  };

	  const checkNumber = (event) => {
		if (event.target.value.length.trim() < 11) {
			Swal.fire({
				title: 'Warning',
				text: 'The mobile number you have entered is incomplete',
				icon: 'error',
				// customClass: {
				// 	container: 'borderless',
				// },
			});
		}
	};
	

	useEffect(()=>{
		if(network){
			setIsDisabled(false);
		}
	},[network])

	useEffect(() => {
		if (isModalOpen === false) {
			setIsReport(false);
			setIsAirtime(false);
			setIsData(false);
			setIsElectricity(false);
			setIsBetting(false);
			setSelected('Select biller...');
			setIsOpen(false);
			setSelectedIcon(null);
			setIsVisible(false);
			setIsDisabled(true)
		}
	}, [isModalOpen]);

	const buyAirtime = () => {
		const category = 'buyAirtime';
		var id;
		const phone = phoneRef.current?.value;
		const amount = amountRef.current?.value;
		setIsDisabled(true);
		if(network===5){
			buySmile(id, phone, amount);
		}else{
			buy(id, phone, category, amount);
		}
	};

	const daily_report = () => {
		const category = 'buyData';
		const phone = phoneRef.current?.value;
		const amount = amountRef.current?.value;
		const amountInCents= amount.replace("₦", "")
		const id = selectedPlanId;
		setIsDisabled(true);
		console.log(amountInCents);
		if(network===5){
			buySmile(id, phone, amountInCents);
		}else{
			buy(id, phone, category,amountInCents);
		}
		
	};

	const buyData = () => {
		const category = 'buyData';
		const phone = phoneRef.current?.value;
		const amount = amountRef.current?.value;
		const amountInCents= amount.replace("₦", "")
		const id = selectedPlanId;
		setIsDisabled(true);
		console.log(amountInCents);
		if(network===5){
			buySmile(id, phone, amountInCents);
		}else{
			buy(id, phone, category,amountInCents);
		}
		
	};


	const buySmile = async (id, phone, amount) => {
		// axios.post('/api/buy-data',{phone:phoneRef.current?.value})

		var response;
		try {
			if (isData) {
				response = await fetch('http://localhost:8000/api/purchaseBundle', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						account_id: phone,
						// plan: id,
						bundleTypeCode: id,
						amount: amount,
					}),
				});
			} 
			else if (isAirtime) {
				response = await fetch('http://localhost:8000/api/doBalanceTransfer', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						amount: amount,
						mobile_number: phone,
					}),
				});
			}

			const data = await response.json();
			const transaction_id = data.TxId;
			var service;
			if(isAirtime){
				service = 'Smile Voice';
			}else{
				service = 'Smile Data';
			}
			console.log(data.TxId);
			if (data.Done === 'true') {
				updateBalance(amount);
				const updatedb = await fetch('http://localhost:8000/api/add_transaction', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						service,
						amount: amount,
						phone_num: phone,
						transaction_id,
						status:'Successful',
						creator: user.id,
					}),
				});
				if(updatedb){
						Swal.fire({
						title: 'Transaction Approved',
						text: 'Your purchase was completed successfully',
						icon: 'success',
						customClass: {
							container: 'borderless',
						},
					});
				}
				
			} else {
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Your purchase could not be completed!',
					icon: 'error',
					customClass: {
						container: 'borderless',
					},
				});
			}
			setIsModalOpen(false);
			// navigate('/dashboard', { replace: true });
		} catch (error) {
			// alert('Error:', error);
		}
	};


	const buy = async (id, phone, category, amount) => {
		var response;
		try {
			if (isData) {
				response = await fetch('http://localhost:8000/api/buy', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						mobile_number: phone,
						plan: id,
						network,
						category: category,
						amount,
					}),
				});
			} else if (isAirtime) {
				response = await fetch('http://localhost:8000/api/buy', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						amount: amount,
						mobile_number: phone,
						network,
						plan: '',
						category: category,
					}),
				});
			}
	
			const data = await response.json();
			console.log(data);
			var service;
			if(isAirtime){
				service = 'Airtime';
			}else{
				service = 'Data';
			}
	
			if (data.Status === 'successful') {
				// Update the database or perform any additional actions if needed
				
				const updatedb = await fetch('http://localhost:8000/api/add_transaction', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						service, // 'Data' is hardcoded, adjust as needed
						amount,
						phone_num: data.mobile_number,
						transaction_id: data.ident,
						status: 'Successful',
						user_id: user.id,
					}),
				});
	
				if (updatedb) {
					updateBalance(amount);
					Swal.fire({
						title: 'Transaction Approved',
						text: 'Your purchase was completed successfully',
						icon: 'success',
						customClass: {
							container: 'borderless',
						},
					});
				} else {
					Swal.fire({
						title: 'Transaction Failed',
						text: 'Your purchase could not be completed!',
						icon: 'error',
						customClass: {
							container: 'borderless',
						},
					});
				}
				setIsModalOpen(false);
			}
		} catch (error) {
			// Handle the error if needed
			console.error("Error:", error);
		}
	};
	
	// Function to format the price as currency
    const formatPrice = price => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        }).format(price);
    };

	const handlePlanSelectChange = async (event) => {
		const selected = event.target.value;
		// console.log(selected);
		// const selectedValue = selected.split('-')[0];
		const price = selected.split('-')[1];
		const plan_id= selected.split('-')[0];
		// const network = selected.split('-')[1];
		// console.log(plan_id);
		setSelectedPlanId(plan_id);

		if (typeof selected.split('-')[2] === "undefined"){
			// amountRef.current.value = `₦${formatPrice(parseInt(price)+(0.20*parseInt(price)))}`;
			amountRef.current.value = `₦${formatPrice(parseInt(price))}`;
			
		
		}else{
			amountRef.current.value = `₦${formatPrice(parseInt(price))}`;
		}
		
	

		if (price.length > 0 && phoneRef.current.value) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	};

	const [selectedIcon, setSelectedIcon] = useState(null);

	const validateCustomer = async (event) => {
		const customer = event.target.value;
		console.log(customer);
		try {
			const response = await fetch('http://localhost:8000/validateAccount', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					account: customer,
				}),
			});
			const data = await response.json();
			console.log(data);
			Swal.fire({
				title: `${data.FirstName} ${data.LastName}`,
				// text: 'Account found',
				icon: 'success',
				customClass: {
					container: 'borderless',
				},
			});
		} catch (error) {
			alert('Error:', error);
		}
	}

	const handlePhoneChange = (event) => {
		// Only update the state if the input is a number (allowing an empty string too)
		const value = event.target.value;
		if (/^\d*$/.test(value)) {  // Regular expression to allow only numbers
		  setPhoneNumber(value);
		}
	  };
	

    const handleIconChange = async (event) => {
        const selectedValue = event.target.value;
		// setIsDisabled(false);
        setSelectedIcon(selectedValue);
		setIsVisible(true);
		if(phoneRef.current){
			phoneRef.current.focus();
		}	
	
		const networkMapping = {
			'9Mobile': 3,
			'Airtel': 4,
			'Glo': 2,
			'MTN': 1,
		  };
		  
          setNetwork(networkMapping[selectedValue]);


		if (isData) {
			setDataPlans([]);
			if (selectedValue) {
				
					try {
						const response = await fetch('http://localhost:8000/api/getplans', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								network: selectedValue,
							}),
						});
						const data = await response.json();
						// console.log(data);
					setDataPlans(data.plans);
					} catch (error) {
						alert('Error:', error);
					}
			//	}
				
			} else {
				setDataPlans([]);
			}
		}

		
    };

	const handleSelectChange = async (event) => {
		const selectedValue = event.target.value;
		if (selectedValue === '1') {
			setNetworkSelected(mtn);
			setNetwork(1);
		} else if (selectedValue === '2') {
			setNetworkSelected(glo);
			setNetwork(2);
		} else if (selectedValue === '3') {
			setNetworkSelected(etisalat);
			setNetwork(3);
		} else if (selectedValue === '4') {
			setNetworkSelected(airtel);
			setNetwork(4);
		} else {
			setNetworkSelected('');
		}
		if (isData) {
			setDataPlans([]);

			if (selectedValue) {
				try {
					const response = await fetch('http://localhost:8000/api/getplans', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							network: selectedValue,
						}),
					});
					const data = await response.json();
					// console.log(data);
					setDataPlans(data.plans);
				} catch (error) {
					// alert('Error:', error);
				}
			} else {
				setDataPlans([]);
			}
		}

		
	};

	return (
		<div className="super__feature  lg:mx-[82px] mb-5 overflow-hidden">
			<div className="lg:mx-[15px] md:mx-[28px] mx-[28px]">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.5 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: -200 },
						}}
						className="super__actions-header lg:mb-4"
					>
						<h3 className="text-bold">Quick Actions</h3>
					</motion.div>
				</div>
			</div>
			<div className=''>
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					// className="grid -ml-3 text-[13px] lg:flex flex-row pl-2  text-[15px]  items-center"
					className="super__actions grid grid-flow-row-dense grid-cols-3 -ml-3 text-[13px] lg:flex flex-row pl-5  text-[15px]"
				>

					<button className='cta__btn btn btn-effect-9 mr-5'>
						<div className="top-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							{/* <MdSmartphone size={32} className="cta__icon" /> */}
							<img src={smile} width="65" alt='Smile' className='mb-2'/>
							{/* <h2>Smile</h2> */}
							</div>
						</div>
						<div className="front-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							{/* <MdSmartphone size={32} className="cta__icon" /> */}
							<img src={smile} width="65" alt='Smile' className='mb-2'/>
							{/* <h2>Smile</h2> */}
							</div>
						</div>
					</button>
					
					<button onClick={buy_airtime} className='cta__btn btn btn-effect-9 mr-5'>
						<div className="top-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							<img src={call} width="32" alt='Smile' className='mb-2'/>
							<h2>Airtime</h2>
							</div>
						</div>
						<div className="front-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							<img src={call} width="32" alt='Smile' className='mb-2'/>
							<h2>Airtime</h2>
							</div>
						</div>
					</button>
					
					<button onClick={buy_data} className='cta__btn btn btn-effect-9 mr-5'>
						<div className="top-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							<img src={internet} width="35" alt='Smile' className='mb-2'/>
							<h2>Data</h2>
							</div>
						</div>
						<div className="front-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							<img src={internet} width="35" alt='Smile' className='mb-2'/>
							<h2>Data</h2>
							</div>
						</div>
					</button>
					

					<button onClick={sales_report} className='cta__btn btn btn-effect-9'>
						<div className="top-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							{/* <MdPhoneAndroid size={32} className="cta__icon" /> */}
							<img src={report} width="35" alt='Smile' className='mb-2'/>
							<h2>Report</h2>
							</div>
						</div>
						<div className="front-face">
							<div className="flex flex-col w-full p-3 text-center items-center  ">
							{/* <MdPhoneAndroid size={32} className="cta__icon" /> */}
							<img src={report} width="35" alt='Smile' className='mb-2'/>
							<h2>Report</h2>
							</div>
						</div>
					</button>
					

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
								{isAirtime && (
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
												Purchase Airtime
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											{networkSelected && (
												<div className="mb-3">
													<img
														className="p-2"
														src={networkSelected}
														width="55"
														alt="logo"
													/>
												</div>
											)}
											<div className="flex flex-col">
												<div className="">
												<h2>Select Network</h2>
												</div>
												<div className="icon-container">
													
													<label>
														<input type="radio" name="icon" value="9Mobile" checked={selectedIcon === "9Mobile"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={etisalat} alt="9Mobile"/>
															
														</div>
													</label>
													<label>
														<input type="radio" name="icon" value="Airtel" checked={selectedIcon === "Airtel"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={airtel} alt="Airtel"/>
															
														</div>
													</label>
													<label>
														<input type="radio" name="icon" value="Glo" checked={selectedIcon === "Glo"}
                   											 onChange={handleIconChange}/>
														<div className="icon">
															<img src={glo} alt="Glo"/>
															
														</div>
													</label>
													<label>
														<input type="radio" name="icon" value="MTN" checked={selectedIcon === "MTN"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={mtn} alt="MTN"/>
															{/* <span>MTN</span> */}
														</div>
													</label>
												</div>
												<input
													type="text"
													ref={phoneRef}
													value={phoneNumber} // Bind value to state
													placeholder="Phone Number"
													onKeyDown={handleKeyDown} // Block non-numeric input
													onChange={handlePhoneChange} // Handle the input change
													onBlur={checkNumber} // Trigger checkNumber when the input loses focus
													style={{
														display: isVisible ? "block" : "none",
														appearance: "textfield", // Removes spinner in some browsers
													}}
													inputMode="numeric" // Ensures only numeric input mode
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
												{/* <input
													type="number"
													ref={phoneRef}
													onBlur={checkNumber}
													style={{ display: isVisible ? "block" : "none" }}
													placeholder="Phone Number"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/> */}
												<input
													type="number"
													ref={amountRef}
													placeholder="Amount"
													onBlur={checkNumber} // Trigger checkNumber when the input loses focus
													onKeyDown={handleKeyDown} // Block arrow key behavior
													style={{
														display: isVisible ? "block" : "none",
														appearance: "textfield", // Removes spinner in some browsers
													}}
													inputMode="numeric" // Ensures only numeric input mode
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
												{/* <input
													type="text"
													ref={amountRef}
													onChange={() => setIsDisabled(false)}
													// disabled={isDisabled}
													style={{ display: isVisible ? "block" : "none" }}
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/> */}
												<h3 className="mb-2">Save Beneficiary</h3>
												
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														// data-on="ON"
														// data-off="OFF"
													></span>
												</label>
											</div>

											<button
												onClick={buyAirtime}
												type="button"
												disabled={isDisabled}
												style={buttonStyle}
												// className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
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

								{isData && (
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
												Purchase Data
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											{/* {...dataPlans.plan} */}
											{networkSelected && (
												<div className="mb-3">
													<img
														className="p-2"
														src={networkSelected}
														width="55"
														alt="logo"
													/>
												</div>
											)}
											<div className="flex flex-col">
												
												<h2>Select Network</h2>
												<div className="icon-container">
													
													
													<label>
														<input type="radio" name="icon" value="9Mobile" checked={selectedIcon === "9Mobile"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={etisalat} alt="9Mobile"/>
															
														</div>
													</label>
													<label>
														<input type="radio" name="icon" value="Airtel" checked={selectedIcon === "Airtel"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={airtel} alt="Airtel"/>
															
														</div>
													</label>
													<label>
														<input type="radio" name="icon" value="Glo" checked={selectedIcon === "Glo"}
                   											 onChange={handleIconChange}/>
														<div className="icon">
															<img src={glo} alt="Glo"/>
															
														</div>
													</label>
													<label>
														<input type="radio" name="icon" value="MTN" checked={selectedIcon === "MTN"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={mtn} alt="MTN"/>
														</div>
													</label>
												</div>
												{selectedIcon==='Smile' ? (
													<input
													type="text"
													placeholder="Customer ID"
													onChange={validateCustomer}
													ref={phoneRef}
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												):(
													<input
                                                    type="text"
                                                    placeholder="Phone Number"
                                                    ref={phoneRef}
													style={{ display: isVisible ? "block" : "none" }}
                                                    className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
												)}
												
												<select
													id="underline_select"
													// value={this.state.selectedPlanId}
													style={{ display: isVisible ? "block" : "none" }}
													onChange={handlePlanSelectChange}
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option value="">Select a plan</option>
													{selectedIcon==='Smile' && dataPlans && dataPlans.map((plan) => (
															<option key={plan.BundleTypeCode} value={`${plan.BundleTypeCode}-${plan.BundlePrice/100} - Smile`}>
																{`${plan.BundleDescription} - ₦${formatPrice(plan.BundlePrice/100)}`}
																{/* {`${plan.BundleDescription} - ₦${plan.BundlePrice/100}- ${plan.ValidityDays} days`} */}
															</option>
														))}
													{selectedIcon !== 'Smile' && dataPlans &&
														dataPlans.map((plan) => (
															<option key={plan.id} value={`${plan.id}-${plan.price}`}>
																	{/* <option key={plan.id} value={`${plan.id | plan.plan_amount}`}></option> */}
																{plan.plan_type + ' ' + plan.plan}
																{/* {plan.plan_type +
																		' ' +
																		plan.plan +
																		' ₦' +
																		plan.plan_amount} */}
															</option>
													))}
												
												</select>

												<input
													type="text"
													placeholder="Amount"
													ref={amountRef}
													style={{ display: isVisible ? "block" : "none" }}
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Beneficiary</h3>

												<label className="toggle mb-4 w-[48px]">
													<input type="checkbox" className="w-3" />
													<span className="slider"></span>
													<span
														className="labels"
														// data-on="ON"
														// data-off="OFF"
													></span>
												</label>
											</div>

											<button
												onClick={buyData}
												type="button"
												disabled={isDisabled}
												style={buttonStyle}
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

								{isReport && (
									    <div>
										<motion.div
										  initial={{ x: -200, opacity: 0 }}
										  animate={{
											x: 0,
											opacity: 1,
											transition: { duration: 0.2 },
										  }}
										  className="w-full text-[#ddd]"
										>
										  <span className="font-bold text-[#042326]">Daily Summary</span>
										</motion.div>
										<div className="pt-2">
										  <div className="flex flex-col">
											<h2 className='pb-4'>Today - {new Intl.DateTimeFormat("en-GB").format(new Date())}</h2>
											<div className="mx-3 mb-10 lg:mx-[5px]">
											  <motion.div
												initial="hidden"
												whileInView="visible"
												transition={{ duration: 0.8 }}
												variants={{
												  visible: { opacity: 1 },
												  hidden: { opacity: 0 },
												}}
												className="overflow-hidden rounded-lg"
											  >
												<table className="styled-table text-[13px] lg:text-[14px]">
												  <thead>
													<tr className="text-[12px] lg:text-[14px] ">
													  <th width="20%" style={{paddingLeft:'15px'}}>Services</th>
													  <th width="15%">Amount (NGN)</th>
													</tr>
												  </thead>
												  <tbody>
													{loading ? (
													  <tr>
														<td colSpan="2" className="text-center">
														  Loading...
														</td>
													  </tr>
													) : transactions.length > 0 ? (
													  transactions.map((transaction, index) => (
														<tr key={index}>
														  <td><span className='pl-4'>{transaction.service}</span></td>
														  <td>{transaction.amount}</td>
														</tr>
													  ))
													) : (
													  <tr>
														<td colSpan="2" className="text-center">
														  No Transactions
														</td>
													  </tr>
													)}
												  </tbody>
												  {!loading && transactions.length > 0 && (
													<tfoot>
													  <tr>
														<td className="font-bold"><span className='pl-4'>Total</span></td>
														<td className="font-bold">{totalAmount}</td>
													  </tr>
													</tfoot>
												  )}
												</table>
											  </motion.div>
											</div>
										  </div>

											<button
												// onClick={saveAuto}
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-white bg-[#206657] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Close
											</button>
											{/* <button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Close
											</button> */}
										</div>
									</div>
								)}

								{isBetting && (
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
												Bet Wallet
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">

											<div className="custom-select-container">
												<div 
													className="custom-select"
													onClick={() => setIsOpen(!isOpen)}
												>
													<div className="select-selected">{selected}</div>
													{isOpen && (
														<div className="select-items">
															{betting_options.map((option, index) => (
																<div 
																	key={index} 
																	className="select-item"
																	onClick={() => handleSelect(option)}
																>
																	<img src={option.image} alt={option.label} />
																	<span>{option.label}</span>
																</div>
															))}
														</div>
													)}
												</div>
											</div>
												{/* <select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Biller....</option>
													<option value="auto">1XBET</option>
													<option value="manual">Bet9ja</option>
													<option value="manual">SportyBet</option>
													<option value="manual">Betway</option>
													<option value="manual">BetKing</option>
												</select> */}
												<input
													type="text"
													placeholder="Customer ID"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<input
													type="text"
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Wallet ID</h3>
												{/* <label className="toggle mb-4 h-4 w-3">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														// data-on="ON"
														// data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
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

								{isElectricity && (
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
												Purchase Electricity
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">

											<div className="custom-select-container">
												<div 
													className="custom-select"
													onClick={() => setIsOpen(!isOpen)}
												>
													<div className="select-selected">{selected}</div>
													{isOpen && (
														<div className="select-items">
															{elctric_options.map((option, index) => (
																<div 
																	key={index} 
																	className="select-item"
																	onClick={() => handleSelect(option)}
																>
																	<img src={option.image} alt={option.label} />
																	<span>{option.label}</span>
																</div>
															))}
														</div>
													)}
												</div>
											</div>
												{/* <select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Biller....</option>
													<option value="3"><img src={abuja} alt=''/>Abuja Electric</option>
													<option value="10"><img src={abuja} alt=''/>Benin Electric</option>
													<option value="2"><img src={abuja} alt=''/>Eko Electric</option>
													<option value="5"><img src={abuja} alt=''/>Enugu Electric</option>
													<option value="7"><img src={abuja} alt=''/>Ibadan Electric</option>
													<option value="1"><img src={abuja} alt=''/>Ikeja Electric</option>
													<option value="9"><img src={abuja} alt=''/>Jos Electric</option>
													<option value="8"><img src={abuja} alt=''/>Kaduna Electric</option>
													<option value="4"><img src={abuja} alt=''/>Kano Electric</option>
													<option value="6"><img src={abuja} alt=''/>Port Harcourt Electric</option>
													<option value="11"><img src={abuja} alt=''/>Yola Electric</option>
												</select> */}
												<input
													type="text"
													placeholder="Customer ID"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Tariff Plan....</option>
													<option value="Prepaid">Prepaid</option>
													<option value="Postpaid">Postpaid</option>
												</select>
												<input
													type="text"
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Meter ID</h3>
												{/* <label className="toggle mb-4 h-4 w-2">
													<input type="checkbox" />
													<span className="slider"></span>
												</label> */}
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														// data-on="ON"
														// data-off="OFF"
													></span>
												</label>
											</div>

											<button
												// onClick={saveAuto}
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

								{/* {!apiResponse && (
									<div>
										<p>Loading...</p>
									</div>
								)} */}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</div>
	);
};

export default Actions;
