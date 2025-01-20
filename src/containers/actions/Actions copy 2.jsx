import { Link, useNavigate } from 'react-router-dom';
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
import { useEffect, useState, useRef } from 'react';
import glo from '../../assets/glo-logo.svg';
import etisalat from '../../assets/9mobile-logo.svg';
import mtn from '../../assets/mtn-logo.svg';
import airtel from '../../assets/airtel-logo.svg';
import smile from '../../assets/smile-logo.svg';
import dstv from '../../assets/dstv-logo.svg';
import gotv from '../../assets/gotv-logo.svg';
import ikeja from '../../assets/ikeja-logo.svg';
import eko from '../../assets/eko-logo.svg';
import bedc from '../../assets/bedc-logo.svg';
import abuja from '../../assets/abuja-logo.svg';
import kaduna from '../../assets/kaduna-logo.svg';
import bet9ja from '../../assets/bet9ja-logo.svg';
import xbet from '../../assets/1xbet-logo.svg';
import betway from '../../assets/betway-logo.svg';
import sportybet from '../../assets/sportybet-logo.svg';
const Actions = () => {
	const [isAirtime, setIsAirtime] = useState(false);
	const [isData, setIsData] = useState(false);
	const [isCable, setIsCable] = useState(false);
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

	const [selected, setSelected] = useState("Select biller...");
    const [isOpen, setIsOpen] = useState(false);

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

	const buy_cable = () => {
		setIsModalOpen(true);
		setIsCable(true);
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

	const checkNumber = (event) => {
		if (event.target.value.length < 11) {
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

	const checkAmount = (event) => {
		if (event.target.value.length < 2) {
			Swal.fire({
				title: 'Warning',
				text: 'Please enter a valid amount',
				icon: 'error',
				// customClass: {
				// 	container: 'borderless',
				// },
			});
		} else {
			setIsDisabled(false);
		}
	};

	useEffect(() => {
		if (isModalOpen === false) {
			setIsCable(false);
			setIsAirtime(false);
			setIsData(false);
			setIsElectricity(false);
			setIsBetting(false);
			setSelected('Select biller...');
			setIsOpen(false);
			setSelectedIcon(null);
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

	const buyData = () => {
		const category = 'buyData';
		const phone = phoneRef.current?.value;
		const amount = amountRef.current?.value;
		const amountInCents= amount.replace("₦", "")
		const id = selectedPlanId;
		setIsDisabled(true);
		if(network===5){
			buySmile(id, phone, amountInCents);
		}else{
			buy(id, phone, category);
		}
		
	};


	const buySmile = async (id, phone, amount) => {
		// axios.post('/api/buy-data',{phone:phoneRef.current?.value})

		var response;
		try {
			if (isData) {
				response = await fetch('http://localhost:3080/purchaseBundle', {
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
				response = await fetch('http://localhost:3080/doBalanceTransfer', {
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
			console.log(data);
			if (data.Done === 'true') {
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
			// navigate('/dashboard', { replace: true });
		} catch (error) {
			// alert('Error:', error);
		}
	};

	const buy = async (id, phone, category, amount) => {
		// axios.post('/api/buy-data',{phone:phoneRef.current?.value})

		var response;
		try {
			if (isData) {
				response = await fetch('http://localhost:3080/api/buy', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						mobile_number: phone,
						plan: id,
						network,
						category: category,
						amount: amount,
					}),
				});
			} else if (isAirtime) {
				response = await fetch('http://localhost:3080/api/buy', {
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
			// alert(data);
			if (data === 'successful') {
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
			// navigate('/dashboard', { replace: true });
		} catch (error) {
			// alert('Error:', error);
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
		console.log(selected);
		// const selectedValue = selected.split('-')[0];
		const price = selected.split('-')[1];
		const plan_id= selected.split('-')[0];
		// const network = selected.split('-')[1];
		console.log(plan_id);
		setSelectedPlanId(plan_id);

		if (typeof selected.split('-')[2] === "undefined"){
			amountRef.current.value = `₦${formatPrice(parseInt(price)+(0.20*parseInt(price)))}`;
			// if(parseInt(selectedValue)<1000){
			// 	amountRef.current.value = `₦${formatPrice(parseInt(selectedValue)+(0.20*parseInt(selectedValue)))}`;
			// }else{
			// 	amountRef.current.value = `₦${formatPrice(parseInt(selectedValue)+(0.20*parseInt(selectedValue)))}`;
			// }
		
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
			const response = await fetch('http://localhost:3080/validateAccount', {
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

    const handleIconChange = async (event) => {
        const selectedValue = event.target.value;
		console.log(selectedValue);
        setSelectedIcon(selectedValue);
		if (selectedValue === '9Mobile') {
			setNetwork(3);
		} else if (selectedValue === 'Airtel') {
			setNetwork(4);
		} else if (selectedValue === 'Glo') {
			setNetwork(2);
		} else if (selectedValue === 'MTN') {
			setNetwork(1);
		}else{
			setNetwork(5);
		}
		if (isData) {
			setDataPlans([]);
			if (selectedValue) {
				if(selectedValue === 'Smile'){
					// try {
					// 	const response = await fetch('http://localhost:3080/checkServiceStatus', {
					// 		method: 'GET',
					// 		headers: {
					// 			'Content-Type': 'application/json',
					// 		}
					// 	});
					// 	const data = await response.json();
					// 	if(data.Done = true){
                    //         try {
                    //             const response = await fetch('http://localhost:3080/getBundleCatalogue', {
                    //                 method: 'GET',
                    //                 headers: {
                    //                     'Content-Type': 'application/json',
                    //                 }
                    //             });
                    //             const data = await response.json();
					// 			const filteredBundles = data.BundleList.Bundle.filter(bundle => !bundle.BundleDescription.includes("SmileVoice"));
					// 			setDataPlans(filteredBundles);
                    //         } catch (error) {
                    //             alert('Error:', error);
                    //         }
					// 	}
					// } catch (error) {
					// 	alert('Error:', error);
					// }

					try {
						const response = await fetch('http://localhost:3080/getBundleCatalogue', {
							method: 'GET',
							headers: {
								'Content-Type': 'application/json',
							}
						});
						const data = await response.json();
						const filteredBundles = data.BundleList.Bundle.filter(bundle => !bundle.BundleDescription.includes("SmileVoice"));
						setDataPlans(filteredBundles);
					} catch (error) {
						alert('Error:', error);
					}
				}else{
					// alert('other');
					try {
						const response = await fetch('http://localhost:3080/api/get_plan', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								selnetwork: selectedValue,
							}),
						});
						const data = await response.json();
						// console.log(data);
					setDataPlans(data.plans);
					} catch (error) {
						alert('Error:', error);
					}
				}
				
			} else {
				setDataPlans([]);
			}
		}

		if (phoneRef.current) {
			phoneRef.current.focus();
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
					const response = await fetch('http://localhost:3080/api/get_plan', {
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

		if (phoneRef.current) {
			phoneRef.current.focus();
		}
	};

	return (
		<div className="super__feature1  lg:mx-[82px] mb-5">
			<div className=" ">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.5 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: -200 },
						}}
						className="ml-[50px] mt-5 lg:ml-3"
					>
						<h3 className="text-bold">Quick Actions</h3>
					</motion.div>
				</div>
			</div>
			<div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					className="grid grid-flow-row-dense grid-cols-3 -ml-3 text-[13px] lg:flex flex-row pl-3  text-[15px] justify-between items-center"
				>
					<button onClick={buy_airtime}>
						<div className="flex flex-col w-full p-3 text-center items-center ">
							<MdSmartphone size={32} className="cta__icon" />
							<h2>Airtime</h2>
						</div>
					</button>
					<button onClick={buy_data}>
						<div className="flex flex-col w-full p-3 text-center items-center  ">
							<MdPhoneAndroid size={32} className="cta__icon" />
							<h2>Data</h2>
						</div>
					</button>
					<button onClick={buy_electricity}>
						<div className="flex flex-col w-full  p-3 text-center items-center  ">
							<MdElectricBolt size={32} className="cta__icon" />
							<h2>Electricity</h2>
						</div>
					</button>
					<button onClick={buy_cable}>
						<div className="flex flex-col w-full  p-3 text-center items-center  ">
							<MdScreenshotMonitor size={35} className="cta__icon" />
							<h2>CableTV</h2>
						</div>
					</button>
					<button onClick={buy_betting}>
						<div className="flex flex-col w-full p-3 text-center items-center ">
							<IoTicketOutline size={32} className="cta__icon" />
							<h2>Betting</h2>
						</div>
					</button>
					<button>
						<div className="flex flex-col w-full p-3 text-center items-center  ">
							<MdOutlineCardGiftcard size={32} className="cta__icon" />
							<h2>Gift Cards</h2>
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
												{/* <select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Network....</option>
													<option value="4">Airtel</option>
													<option value="2">Glo</option>
													<option value="1">MTN</option>
													<option value="3">9Mobile</option>
													<option value="5">Smile</option>
												</select> */}
												<h2>Select Network</h2>
												<div className="icon-container">
													<label className='icon-start'>
														<input type="radio" name="icon" value="Smile" checked={selectedIcon === "Smile"} onChange={handleIconChange}/>
														<div className="icon">
															<img src={smile} alt="Smile"/>
														</div>
													</label>
													
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
													onBlur={checkNumber}
													placeholder="Phone Number"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<input
													type="text"
													ref={amountRef}
													onChange={() => setIsDisabled(false)}
													placeholder="Amount"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<h3 className="mb-2">Save Beneficiary</h3>
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
												{/* <select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Network....</option>
													<option value="4">Airtel</option>
													<option value="2">Glo</option>
													<option value="1">MTN</option>
													<option value="3">9Mobile</option>
													<option value="smile">Smile</option>
												</select> */}
												<h2>Select Network</h2>
												<div className="icon-container">
													<label className='icon-start'>
														<input type="radio" name="icon" value="Smile" checked={selectedIcon === "Smile"} onChange={handleIconChange}/>
														<div className="icon">
															<img src={smile} alt="Smile"/>
														</div>
													</label>
													
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
                                                    className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
												)}
												
												<select
													id="underline_select"
													// value={this.state.selectedPlanId}
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
															<option key={plan.id} value={`${plan.id}-${plan.plan_amount}`}>
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
													disabled
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

								{isCable && (
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
												Cable TV Subscription
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-col">
											<h2>Select Biller</h2>
											<div className="cable-icon-container">
													<label className='cable-icon-start'>
														<input type="radio" name="icon" value="Smile" checked={selectedIcon === "Smile"} onChange={handleIconChange}/>
														<div className="icon">
															<img src={dstv} alt="DSTV"/>
														</div>
													</label>
													
													<label>
														<input type="radio" name="icon" value="9Mobile" checked={selectedIcon === "9Mobile"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={gotv} alt="GoTV"/>
															
														</div>
													</label>
												</div>
												{/* <select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Biller....</option>
													<option value="auto">DSTV</option>
													<option value="manual">GoTV</option>
												</select> */}
												<input
													type="text"
													placeholder="Smart Card/IUC Number"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<select
													onChange={handleSelectChange}
													id="underline_select"
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border border-gray-500 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												>
													<option>Choose Package....</option>
												</select>
												<h3 className="mb-2">Save Smartcard/IUC</h3>
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
