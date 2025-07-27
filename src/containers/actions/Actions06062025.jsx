import { DealContext } from '../../DealContext';
import { Link, useHistory } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAddressBook } from "react-icons/fa";
// import Swal from 'sweetalert2';
// import Swal from 'sweetalert2/dist/sweetalert2.js';
import Swal from 'sweetalert2';
import axios from 'axios';
import { LuCreditCard, LuHeadphones } from 'react-icons/lu';
// import { BsPhoneFill } from 'react-icons/bs';
import { Listbox, Transition  } from "@headlessui/react";
import { useFloating, autoUpdate, offset, flip, arrow, shift } from "@floating-ui/react-dom";
import { ChevronsUpDown, ChevronDown, Check } from "lucide-react";
import { jsPDF } from "jspdf";
import { useSwipeable } from 'react-swipeable';
import 'sweetalert2/dist/sweetalert2.min.css'; // Base styling




import { IoTicketOutline, IoCheckbox } from 'react-icons/io5';
import './actions.css';
import { useEffect, useState, useRef, useContext, useDebounce } from 'react';
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
import jos from '../../assets/jed-logo.png';
import eko from '../../assets/eko-logo.svg';
import bedc from '../../assets/bedc-logo.svg';
import abuja from '../../assets/abuja-logo.svg';
import kaduna from '../../assets/kaduna-logo.svg';
import kano from '../../assets/kano.jpg';
import enugu from '../../assets/enugu.jpg';
import ibadan from '../../assets/ibadan.jpg';
import yola from '../../assets/yola.jpg';
import phed from '../../assets/phed.jpg';
import aba from '../../assets/aba.jpg';
import bet9ja from '../../assets/bet9ja-logo.svg';
import xbet from '../../assets/1xbet-logo.svg';
import betway from '../../assets/betway-logo.svg';
// import sportybet from '../../assets/sportybet-logo.svg';
import sporty from '../../assets/sporty.jpg';
import smile_voice from '../../assets/smile_voice_logo.png';
import wait from '../../assets/loading.gif';
import one_day from '../../assets/1_day.png';
import seven_days from '../../assets/7_days.png';
import thirty_days from '../../assets/30_days.png';
import sixty_days from '../../assets/60_days.png';
import ninety_days from '../../assets/90_days.png';
import one_year from '../../assets/365_days.png';
import bet from '../../assets/bet.png';
import bolt from '../../assets/bolt.png';
import tv from '../../assets/tv.png';
import book from '../../assets/book_grad.png';
import user1 from '../../assets/user.png';
import pack from '../../assets/package.png';
import jamb from '../../assets/jamb.png';
import waec from '../../assets/waec.png';
import neco from '../../assets/neco.png';
import nabteb from '../../assets/nabteb.png';
import logo from '../../assets/logo.png';

const Actions = ({ user }) => {
	// console.log(user.account.transaction_pin);

  	const hasInitialized = useRef(false);
	const [isAirtime, setIsAirtime] = useState(false);
	const [isData, setIsData] = useState(false);
	const [isReport, setIsReport] = useState(false);
	const [isBetting, setIsBetting] = useState(false);
	const [isSmile, setIsSmile] = useState(false);
	const [isSmileVoice, setIsSmileVoice] = useState(false);
	const [isSmileData, setIsSmileData] = useState(false);
	const [isElectricity, setIsElectricity] = useState(false);
	const [isElectric, setIsElectric] = useState(false);
	const [isCable, setIsCable] = useState(false);
	const [isEd, setIsEd] = useState(false);
	const [isJAMB, setIsJAMB] = useState(false);
	const [isWAEC, setIsWAEC] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [networkSelected, setNetworkSelected] = useState('');
	const [dataPlans, setDataPlans] = useState([]);
	const [servicePlans, setServicePlans] = useState([]);
	const [smilePlans, setSmilePlans] = useState([]);
	const phoneRef = useRef(null);
	const codeRef = useRef(null);
	const arrowRef = useRef(null);
	const amountRef = useRef(null);
	const selectRef = useRef(null); // Reference for the select input
	const [selectedPlanId, setSelectedPlanId] = useState('');
	const [selectedSmilePlanId, setSelectedSmilePlanId] = useState(null);
	const [phoneError, setPhoneError] = useState("");
	const [amountError, setAmountError] = useState("");
	// const [selectedPlan, setSelectedPlan] = useState(null);
	const [selectedPlan, setSelectedPlan] = useState(servicePlans[0] || { name: "Choose Package..." });


	const [network, setNetwork] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);
	const [amount, setAmount] = useState('');
    const { loggedUser, setLoggedUser, updateBalance, settings, isSettings, isMenuOpen, setIsMenuOpen, setIsSettings } = useContext(DealContext);
	// const debouncedUpdateBalance = useDebounce(updateBalance, 300); // Wait 300ms
	const [selected, setSelected] = useState("Select biller...");
	// const [smileSelected, setSmileSelected] = useState("Select plan...");
    const [isOpen, setIsOpen] = useState(false);
	const [isTransactionPin, setIsTransactionPin] = useState(true);
	const [isVisible, setIsVisible] = useState(false); // Input visibility
	const [phoneNumber, setPhoneNumber] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false); // State to track loading
	const [userTransactions, setUserTransactions] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [totalAmount, setTotalAmount] = useState(0);
	const [activeTab, setActiveTab] = useState("account");
	const [dailyActiveTab, setDailyActiveTab] = useState("today");
	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [otp, setOtp] = useState("");
	const [newPin, setNewPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
	const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
	const [isResetPassword, setIsResetPassword] = useState(false);
	const [isResetTransactionPin, setIsResetTransactionPin] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otpError, setOtpError] = useState('');
	const [isPinVisible, setIsPinVisible] = useState(true);
	const [isPassVisible, setIsPassVisible] = useState(true);
	const [isValidated, setIsValidated] = useState(false);
	const [smileSelected, setSmileSelected] = useState(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const [customerName, setCustomerName] = useState("");
	const [currentPackage, setCurrentPackage] = useState("");
	const [isValidateLoading, setIsValidateLoading] = useState(false);
	const [isCableLoading, setIsCableLoading] = useState(false);
	const [isValidateDisabled, setIsValidateDisabled] = useState(true);
	const [selectedElectricPlan, setSelectedElectricPlan] = useState('prepaid');
	const [edCategory, setEdCategory] = useState('');
	const [electricImage, setElectricImage] = useState(null);
	const [todayTransactions, setTodayTransactions] = useState([]);
	const [yesterdayTransactions, setYesterdayTransactions] = useState([]);
	const [yesterdayTotal, setYesterdayTotal] = useState(0);
	const [todayTotal, setTodayTotal] = useState(0);
	const [dailyTransactions, setDailyTransactions] = useState([[], [], [], [], []]); // Stores data for 5 days
	const [isAddressBook, setIsAddressBook] = useState(false);
	const [addressBook, setAddressBook] = useState([]);
	const [category, setCategory] = useState('');
	const [currentAddPage, setCurrentAddPage] = useState(1);
	const itemsPerPage = 10;

	// const [selectedJAMBPlan, setSelectedJAMBPlan] = useState('');

    //PAYSCRIBE
	const [betID, setBetID] = useState("");
	const [customerCode, setCustomerCode] = useState("");
	const [account, setAccount] = useState("");

	//VTPASS 
	const [serviceID, setServiceID] = useState("");
	const [phone, setPhone] = useState("");
	const [billerCode, setBillerCode] = useState("");
	const [variationCode, setVariationCode] = useState("");
	const [subscriptionType, setSubscriptionType] = useState("");
	const [responseMessage, setResponseMessage] = useState("");
	const [service, setService] = useState("");
	const [activeButton, setActiveButton] = useState("prepaid"); //
	const [provider, setProvider] = useState('');


	  // Single `useFloating` instance for both dropdown and tooltip
	  const { refs, floatingStyles, middlewareData } = useFloating({
        placement: "bottom", // Placement for dropdown (adjust dynamically for tooltip)
        middleware: [offset(9), flip(), shift(), arrow({ element: arrowRef })],
        whileElementsMounted: autoUpdate,
    });

	// console.log(user);
	// // const buttonRef = useRef(null);
    // const { refs, floatingStyles } = useFloating({
    //     placement: "bottom-start", // Ensures dropdown opens below the button
    //     middleware: [offset(8), flip()], // Prevents clipping
    //     whileElementsMounted: autoUpdate, // Auto-updates position on resize/scroll
    // });

	// // Floating UI for positioning tooltip above codeRef
	// const { serviceRefs, serviceFloatingStyles, serviceMiddlewareData } = useFloating({
	// 	placement: 'left',
    //     middleware: [offset(1), shift(), arrow({ element: arrowRef })],
    //     whileElementsMounted: autoUpdate,
	//   });


    // const { refs, floatingStyles, middlewareData } = useFloating({
    //     placement: 'bottom',
    //     middleware: [offset(0), shift(), arrow({ element: arrowRef })],
    //     whileElementsMounted: autoUpdate,
    // });

	const getCookie = (name) => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	  };

	
	  useEffect(() => {

		const encodedUser = getCookie('lastUser');
		// console.log(encodedUser);
	
		if (encodedUser) {

		  try {
			const user = JSON.parse(atob(encodedUser));
			setLoggedUser(user.logged);
		  } catch (err) {
			console.log("Error decoding user cookie:", err);
		  }
		}
	  }, []);

	//   useEffect(()=>{
	// 	console.log(loggedUser);
	//   }, [loggedUser])

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
	
		// const data = {
		//   service_id: serviceID,
		//   phone: phone,
		//   biller_code: billerCode,
		//   variation_code: variationCode,
		//   amount: amount,
		//   subscription_type: subscriptionType,
		// };
	
		try {
		  const response = await axios.post("http://127.0.0.1:8000/api/vtservices_buy", data);
		  setResponseMessage(`Success: ${response.data.message}`);
		} catch (error) {
		  if (error.response) {
			setResponseMessage(`Error: ${error.response.data.message}`);
		  } else {
			setResponseMessage("Error: Unable to connect to the server");
		  }
		} finally {
		  setLoading(false);
		}
	  };

	  const verifyBet = async()=>{
		// setIsValidateLoading(true);
		// let bet_id =  '';
		// let customer_id =  '';
		// const data = {
		// 	bet_id: betID,
		// 	customer_id: customerCode,
		//   };
		console.log(selectedIcon);
		//   setIsValidateLoading(true);
		try {
	
			setIsValidateLoading(true);
			
			const response = await fetch(`${getBaseUrl()}/payscribe_verify?bet_id=${selectedIcon}&customer_id=${customerCode}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					_id: user.id,
				}),
			});


			const data = await response.json();
			console.log(data);
			let customerName = '';
			let account = '';
			if(selectedIcon === 'SportyBet'){
				customerName =  customerCode;
				account = customerCode
			}else{
				customerName = data.message.details.name;
				account = data.message.details.account;
			}
			
			
			// // const customerName = data.data?.content?.Customer_Name || "Unknown";
			// const currentPackage = data.data?.content?.Current_Bouquet || "Unknown";
			// // const errorResponse = data.data?.content?.error || "Unknown";
			// // console.log(data);
			setIsValidateDisabled(false);
			setAccount(account);

			setCustomerName(customerName); // Save customer name for tooltip
			setIsDisabled(false);
		} catch (error) {
		  if (error.response) {
			// setResponseMessage(`Error: ${error.response.data.message}`);
			// setCustomerName("");
		  } else {
			setResponseMessage("Error: Unable to connect to the server");
		  }
		} finally {
		
				setIsValidateLoading(false);
		}
	  }

	  const verifyService = async()=>{
		// setIsValidateLoading(true);
		// console.log(serviceID);


		const data = {
			service_id: serviceID,
			biller_code: billerCode,
			type: variationCode 
		  };

		//   setIsValidateLoading(true);
		try {
	
			setIsValidateLoading(true);
			
			
			const response = await fetch(`${getBaseUrl()}/vtservices_verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service_id: serviceID,
					phone: phone,
					biller_code: billerCode,
					variation_code: variationCode,
					type: variationCode,
					amount: amount,
					subscription_type: subscriptionType,
				}),
			});


			const data = await response.json();
			const customerName = data.data.content.Customer_Name;
			const phoneNumber = data.data.content.Customer_Number;
			// const customerName = data.data?.content?.Customer_Name || "Unknown";
			const currentPackage = data.data?.content?.Current_Bouquet || "Unknown";
			// const errorResponse = data.data?.content?.error || "Unknown";
			// console.log(data);
			setIsValidateDisabled(false);
			setPhoneNumber(phoneNumber);
			setCurrentPackage(currentPackage);
			// console.log(errorResponse);
			if(customerName === 'undefined') {
				setCustomerName("");
			}
			
			setCustomerName(customerName); // Save customer name for tooltip
			setCurrentPackage(currentPackage);
			setIsValidateLoading(false);
		} catch (error) {
		  if (error.response) {
			setResponseMessage(`Error: ${error.response.data.message}`);
			setCustomerName("");
		  } else {
			setResponseMessage("Error: Unable to connect to the server");
		  }
		} finally {
		
				setIsValidateLoading(false);
		}
	  }

	  const handleContinue = () => {
		console.log(amount);
		if(!amount || !phoneNumber){
			if (!phoneNumber) {
				setPhoneError("Phone number is required.");
			}
			if(!amount){
				setAmountError("Amount is required.");
			}	
			return;
		}
		setAmountError("");
		setPhoneError(""); // Clear error if valid
		buyElectric();
	};


	const handleSmileChange = (input) => {
		if (input && input.target) {
		  // Handle as event
		  const value = parseInt(input.target.value, 10);
		  const selectedOption = smilePlans.find(
			(plan) => plan.BundleTypeCode === value
		  );
	  
		  if (selectedOption) {
			setSmileSelected(selectedOption);
			console.log("Selected option:", selectedOption);
		  } else {
			// console.error("No matching plan found for value:", value);
		  }
		} else if (input && typeof input === "object") {
		  // Handle as direct object input
		  setSmileSelected(input);
		  console.log("Selected option (direct):", input);
		} else {
		//   console.error("Invalid input passed to handleSmileChange:", input);
		}
	  };
	  
	  

	// console.log(isTransactionPin);
	let trans_pin = loggedUser.transaction_pin;
	// console.log(loggedUser.transaction_pin);
	// console.log(account);
	// console.log(loggedUser);
	if(user.user == ''){
		user = loggedUser.user
	}
	user=user? user.user : loggedUser.user;

	// // console.log(user);

	// let first_name = user.name.split(' ')[0];

	//  let loggeduser=user? user.user : loggedUser.user;

	// // console.log(balance);
	// // console.log(currentBalance);
	// let first_name = '';
	// if(loggeduser){
	// 	first_name = loggeduser?.name.split(' ')[0];
	// }


	const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	 };

    const handleSelect = (option) => {
        setSelected(option.label);
        setIsOpen(false);
    };

	const buy_smile = () => {
		setIsModalOpen(true);
		setIsMenuOpen(false);
	
		// Convert transaction_pin to a proper boolean for evaluation
		const hasTransactionPin = trans_pin === "true"; // Adjust for the string representation
	
		if (!hasTransactionPin) {
			setIsSmile(false);
			setIsTransactionPin(false);
		} else {
			setIsSmile(true);
			setNetwork(5);
			setNetworkSelected('');
		}
	};

	const buy_airtime = () => {
		setIsModalOpen(true);
		setIsMenuOpen(false);
	
		// Convert transaction_pin to a proper boolean for evaluation
		const hasTransactionPin = trans_pin === "true"; // Adjust for the string representation
	
		if (!hasTransactionPin) {
			setIsAirtime(false);
			setIsTransactionPin(false);
		} else {
			setIsAirtime(true);
			setNetworkSelected('');
		}
	};

	const buy_data = () => {
		// console.log(user);
		setIsModalOpen(true);
		setIsMenuOpen(false);

		const hasTransactionPin = trans_pin === "true"; // Adjust for the string representation
	
		if (!hasTransactionPin) {
			setIsData(false);
			setIsTransactionPin(false);
			// console.log("Setting transaction");
		}else{
			setIsData(true);
			setNetworkSelected('');
		}
		
	};

	const buy_cable = () => {
		// console.log(user);
		setIsModalOpen(true);
		setIsMenuOpen(false);

		const hasTransactionPin = trans_pin === "true"; // Adjust for the string representation
	
		if (!hasTransactionPin) {
			setIsData(false);
			setIsTransactionPin(false);
			// console.log("Setting transaction");
		}else{
			setIsCable(true);
		}

	};

	const buy_ed = () => {

		setIsModalOpen(true);
		setIsMenuOpen(false);

		const hasTransactionPin = trans_pin === "true"; // Adjust for the string representation
	
		if (!hasTransactionPin) {
			setIsData(false);
			setIsTransactionPin(false);
			// console.log("Setting transaction");
		}else{
			setIsEd(true);
		}

	};

	const sales_report = () => {
		setIsModalOpen(true);
		setIsMenuOpen(false);
		setIsReport(true);
	};

	 const smile_box= async(category) => {
		setIsSmile(false);
		
		if(category === 'buyAirtime'){
			setIsModalOpen(true);
			setIsMenuOpen(false);
			setIsSmileVoice(true);
			
		}else{
			setIsModalOpen(true);
			setIsMenuOpen(false);
			setIsSmileData(true);
		}
		try {
			setIsLoading(true); // Set loading to true when the process starts
			const response = await fetch(`${getBaseUrl()}/getsmileplans`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					category,
				}),
			});
			const data = await response.json();
			// console.log(data.BundleList.Bundle);
		 setSmilePlans(data.bundles);
		} catch (error) {
			// console.error("Error:", error);
		} finally {
			setIsLoading(false); // Set loading to false when the process ends
		}
	};

	const transaction_pin = () => {
		setIsModalOpen(true);
		setIsMenuOpen(false);
		setIsReport(true);
	};

	const setting = () => {
		setIsModalOpen(true);
		setIsMenuOpen(false);
		// setIsSettings(true);
	}

const totalAddPages = Math.ceil(addressBook.length / itemsPerPage);
const paginatedAddresses = addressBook.slice(
	(currentAddPage - 1) * itemsPerPage,
	currentAddPage * itemsPerPage
);

// Swipe logic
const swipeHandlers = useSwipeable({
	onSwipedLeft: () => setCurrentAddPage((prev) => Math.min(prev + 1, totalAddPages)),
	onSwipedRight: () => setCurrentAddPage((prev) => Math.max(prev - 1, 1)),
	preventScrollOnSwipe: true,
	trackMouse: true // enables mouse swipes on desktop too
  });

	const getAddressBook = () => {
        // setIsModalOpen(true);
		
		setIsAddressBook(true);
		setIsData(false);
		setIsAirtime(false);
    };


	const buy_betting = () => {
		setIsModalOpen(true);
		setIsBetting(true);
	};

	const buy_electricity = () => {
		setIsModalOpen(true);
		setIsMenuOpen(false);

		const hasTransactionPin = trans_pin === "true"; // Adjust for the string representation
	
		if (!hasTransactionPin) {
			setIsData(false);
			setIsTransactionPin(false);
			// console.log("Setting transaction");
		}else{
			setIsElectricity(true);
		}
		
	};

	const buttonStyle = {
		color: "white",
		backgroundColor: isCable
			? isValidateDisabled 
				? "#CCCCCC" 
				: "#230d29"
			: isDisabled 
				? "#CCCCCC" 
				: "#230d29",
		"&:hover": {
			backgroundColor: isCable
				? isValidateDisabled 
					? "#CCCCCC" 
					: "#230d29"
				: isDisabled 
					? "#CCCCCC" 
					: "#230d29",
		},
		"&:focus": {
			outline: "none",
			backgroundColor: isCable
				? isValidateDisabled 
					? "#CCCCCC" 
					: "#230d29"
				: isDisabled 
					? "#CCCCCC" 
					: "#230d29",
			ring: "4px red",
		},
		"&:focus:dark": {
			ring: "8px red",
		},
		fontWeight: "600", // font-medium
		borderRadius: "0.375rem", // rounded-lg
		fontSize: "0.875rem", // text-sm
		display: "inline-flex", // inline-flex
		alignItems: "center", // items-center
		padding: "0.622rem 1.25rem", // px-5 py-2.5
		textAlign: "center", // text-center
		marginRight: "0.5rem", // mr-2
	};

	const betButtonStyle = {
		color: 'white',
		backgroundColor: '#230d29',
		'&:hover': {
			backgroundColor:  '#230d29',
		},
		'&:focus': {
			outline: 'none',
			backgroundColor:  '#230d29',
			ring: '4px red',
		},
		'&:focus:dark': {
			ring: '8px red',
		},
		fontWeight: '600', // font-medium
		borderRadius: "0 0.5rem 0.5rem 0",
		fontSize: '0.875rem', // text-sm
		display: 'inline-flex', // inline-flex
		alignItems: 'center', // items-center
		padding: '0.622rem 1.25rem', // px-5 py-2.5
		textAlign: 'center', // text-center
		marginRight: '0.5rem', // mr-2
		height: "42px", 
		boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
		marginTop: "8px"
	};

	

	const validateButtonStyle = {
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
		borderRadius: "0 0.5rem 0.5rem 0",
		fontSize: '0.875rem', // text-sm
		display: 'inline-flex', // inline-flex
		alignItems: 'center', // items-center
		padding: '0.622rem 1.25rem', // px-5 py-2.5
		textAlign: 'center', // text-center
		marginRight: '0.5rem', // mr-2
		height: "42px", 
		boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
		marginTop: "8px"
	};

	useEffect(() => {

		// getTransactions();
		// setIsLoaded(false);
		setLoading(false);

}, [currentPage, updateBalance]);


useEffect(() => {
	const getAddressBook = async() => {
		if(isAddressBook){
			try{
				setIsLoading(true);
				const response = await fetch(`${getBaseUrl()}/get_address_book`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: user.id,
						category
					}),
				});
				const data = await response.json();
				// console.log(data.addressBook);
				setAddressBook(data.addressBook);
				// console.log(addressBook);
			}catch(error){

			}finally{
				setIsLoading(false);
                // setIsAddressBook(false);
			}
		}
	}
	getAddressBook();
}, [isAddressBook])



useEffect(() => {
	if (edCategory) {
	  buyEdu();
	}
	if(serviceID){
		verifyService();
	}
  }, [edCategory, serviceID]); 

//   useEffect(() => {
// 	if (selectedPlanId && selectRef.current) {
// 	  selectRef.current.value = selectedPlanId; // Ensure select input reflects state
// 	}
//   }, [selectedPlanId]);

var role;
if(user?.id === 3){
role = 'admin';
}else if(user?.role === "2"){
	role = 'shop_user';
}else{
	role = 'user';
}


useEffect(() => {
	const fetchTransactions = async () => {
		if (!user?.id) return;
		if (hasInitialized.current) return;
		if (dailyTransactions.some(transactions => transactions.length > 0)) return;

		hasInitialized.current = true;

		try {
			const results = await Promise.all([...Array(5)].map(async (_, index) => {
				const date = new Date();
				date.setDate(date.getDate() - index);
				const formattedDate = date.toISOString().split("T")[0];

				const response = await fetch(`${getBaseUrl()}/daily-transactions`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ _id: user.id, date: formattedDate }),
				});

				const data = await response.json();
				return data.transactions || [];
			}));

			setDailyTransactions(results);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.error("Failed to fetch transactions:", error);
		}
	};

	fetchTransactions();
}, []);

  


	const getTransactions = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=5`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem("token")}`, // Ensure token is included
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
			// console.error("Error fetching transactions:", error);
			setLoading(false);
		}
	};


	const sendOtp = async () => {
		try {
		  setLoading(true);
		  const response = await fetch(`${getBaseUrl()}/send-otp`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: user.id }),
		  });
	  
		  const data = await response.json();
	  
		  if (data.success) {
			setOtpSent(true);
			Swal.fire('Success', 'OTP sent to your email.', 'success');
		  } else {
			throw new Error(data.message || 'Failed to send OTP');
		  }
		} catch (error) {
		  Swal.fire('Error', error.message, 'error');
		} finally {
		  setLoading(false);
		}
	  };
	  
	  const verifyOtp = async () => {
		try {
		  setLoading(true);
		  const response = await fetch(`${getBaseUrl()}/verify-otp`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userId: user.id, otp }),
		  });
	  
		  const data = await response.json();
	  
		  if (data.success) {
			setIsTwoFactorEnabled(true);
			setOtpSent(false);
			setOtp('');
			Swal.fire('Success', 'Two-Factor Authentication enabled.', 'success');
		  } else {
			setOtpError(data.message || 'Invalid OTP');
		  }
		} catch (error) {
		  setOtpError('Failed to verify OTP. Please try again.');
		} finally {
		  setLoading(false);
		}
	  };

	//   useEffect(() => {
	// 	if(servicePlans.length>0) {
	// 		console.log(servicePlans);
	// 	}
	  
	//   }, [servicePlans])
	  
	  
	  useEffect(() => {
		if(isData){
			if (phoneNumber?.length === 11 && selectedPlanId !== null) {
				setIsDisabled(false);
			  }else {
				setIsDisabled(true);
				if (amountRef.current) amountRef.current.value = ''; // Clear the amount field
				if (selectRef.current) {
				  selectRef.current.value = ''; // Reset the select input to default
				  setSelectedPlanId(null); // Reset selectedPlanId state
				}
			  }
		}

		if(isCable || isElectric || isJAMB) {
			if (billerCode.length >= 10) {
				setIsDisabled(false);
			  }else {
				setIsDisabled(true);
				setIsValidateDisabled(true);
				setCustomerName('');
				if (amountRef.current) amountRef.current.value = ''; // Clear the amount field
				if (selectRef.current) {
				  selectRef.current.value = ''; // Reset the select input to default
				  setSelectedPlanId(null); // Reset selectedPlanId state
				}
			  }
		}
		
		if(isAirtime){
			// console.log('airtime');
			if (phoneNumber && phoneNumber?.length < 11 && amount < 49) {
				
				setIsDisabled(true);
				if (amountRef.current) {
					amountRef.current.value = ''; // Clear the amount field
				}
			  }else {
				setIsDisabled(false);
			  }
		}

		if(isSmileVoice || isSmileData){
			// console.log('smile voice');
            if (phoneNumber.length >= 10) {
                setIsDisabled(false);
				setIsVisible(true);
              } else {
                setIsDisabled(true);
				setIsVisible(false)
                if (amountRef.current) amountRef.current.value = ''; // Clear the amount field
                if (selectRef.current) {
					selectRef.current.value = ''; // Reset the select input to default
                  setSelectedSmilePlanId(null); // Reset selectedSmilePlanId state
                }
              }
		}
		
	  }, [phoneNumber, selectedPlanId, amount, billerCode]); // Dependency array: triggers when phoneNumber or selectedPlanId changes


	useEffect(() => {
		// Centralized modal cleanup logic
		if (!isModalOpen) {
		  resetModalStates(); // Reset all modal-related states
		}
	  
		// Avoid reopening modal unnecessarily
		if (isMenuOpen && isSettings && !isModalOpen) {
		  setIsModalOpen(true);
		  setIsSettings(true);
		}

		if(!isTransactionPin){
			if(isModalOpen && isReport || isModalOpen && isSettings){
				setIsTransactionPin(true);
			}
		}
		

	  }, [isModalOpen, isMenuOpen]);

	  const resetModalStates = () => {
		setIsReport(false);
		setIsAirtime(false);
		setIsData(false);
		setIsElectricity(false);
		setIsSmile(false);
		setIsBetting(false);
		setSelected("Select biller...");
		setSmileSelected("Select plan...");
		setIsOpen(false);
		setSelectedIcon(null);
		setSelectedPlanId(null); 
		setIsVisible(false);
		setIsDisabled(true);
		setIsSettings(false);
		setIsMenuOpen(false);
		setActiveTab("account"); // Reset to the default tab
		setDailyActiveTab("today"); 
		setIsOtpVerified(false); // Reset OTP verification state
		setOtp(""); // Clear OTP input
		setNewPin(""); // Clear new PIN input
		setConfirmPin(""); // Clear confirm PIN input
		setIsResetPassword(false);
		setIsResetTransactionPin(false);
		setIsPassVisible(true);
		setIsPinVisible(true);
		setIsSmileVoice(false);
		setIsSmileData(false);
		setAmount('');
		setPhoneNumber('');
		setIsCable(false);
		setIsEd(false);
		setServicePlans('Choose Package...');
		setSelectedPlan(null);
		setIsValidated(false);
		setCustomerName('');
		setIsValidateDisabled(true);
		setSelectedElectricPlan('prepaid');
		setEdCategory('');
		setIsJAMB(false);
		setIsWAEC(false);
		setBillerCode('');
		setIsValidateLoading(false);
		setIsElectric(false);
		setAccount('');
		setIsAddressBook(false);
		setCurrentAddPage(1);
		// setIsCableLoading(false);
		// setIsTransactionPin(false);
		// resetSettingsStates();
	  };
	  

	  // Handle OTP Verification
	const handleOtpVerification = (e) => {
	e.preventDefault();
	// Logic to verify the OTP
	if (otp === "123456") {
	  setIsOtpVerified(true); // Mock verification success
	} else {
	  alert("Invalid OTP. Please try again.");
	}
  };
  
  // Handle PIN Modification
  const handlePinModification = async(e) => {
	e.preventDefault();
	if (newPin !== confirmPin) {
		Swal.fire({
			title: 'Error',
			text: 'PIN do not match. Please try again.',
			icon: 'error',
			customClass: {
				container: 'borderless',
			},
		});
	  return;
	}
	if (newPin.length !== 4) {
		Swal.fire({
			title: 'Error',
			text: 'PIN must be 4 digits.',
			icon: 'error',
			customClass: {
				container: 'borderless',
			},
		});
	  return;
	}
	const response = await fetch(`${getBaseUrl()}/set-pin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			pin: newPin,
			user_id: user.id
		}),
	});
	const data = await response.json();

	if (data.status === 'successful') {
		const account = JSON.parse(localStorage.getItem('account'));
		account.transaction_pin = 'true';
		localStorage.setItem('account', JSON.stringify(account));
		setIsTransactionPin(true);
		setIsModalOpen(false);
		Swal.fire({
			title: 'PIN Update',
			text: 'Your PIN was set successfully',
			icon: 'success',
			customClass: {
				container: 'borderless',
			},
		});
	}
  };

  const buyAirtime = () => {
    const category = 'buyAirtime';
    var id = ""; // Initialize id with a default value
    const phone = phoneRef.current?.value;
    const amount = amountRef.current?.value;

	if(!isSmile){
		// Validate inputs
		if (!phone) {
			alert("Phone number is required.");
			setIsDisabled(false);
			return;
		}

		if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
			alert("Please enter a valid amount.");
			setIsDisabled(false);
			return;
		}
	}
   

    if (typeof network === "undefined" || network === null) {
        alert("Network selection is required.");
        setIsDisabled(false);
        return;
    }

    if (network === 5) {
        // Smile Voice processing
        smile_box(category);
    } else {
        // Process normal airtime purchase
        buy(id, phone, category, amount);
    }
};

const buyCable = async () => {
    const biller_code = codeRef.current.value;
    const variation_code = selectedPlan;
    const service_id = selectedIcon;
    let subscription_type = "renew";
    let bundleAmount = amount.replace(/[^\d.]/g, ""); // Remove non-numeric characters
    let current_package = currentPackage.split(' + ');

    if (variation_code.name !== current_package[0]) {
        subscription_type = "change";
    } else {
        subscription_type = "renew";
    }

    try {
        // Get Wallet Balance
        const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_id: user.id }),
        });

        const walletData = await walletResponse.json();
        let old_balance = parseFloat(walletData?.available_balance || 0);

        // Check if balance is sufficient
        if (old_balance < bundleAmount) {
            Swal.fire({
                title: 'Insufficient Balance',
                text: `You need at least NGN ${bundleAmount} to proceed.`,
                icon: 'error',
                customClass: { container: 'borderless' },
            });
            setIsDisabled(false);
            return;
        }

        // Deduct balance & Log transaction as "Pending"
        let new_balance = old_balance - bundleAmount;
        const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category: 'CableTV',
                service: service_id,
                amount: bundleAmount,
                phone_num: phoneNumber,
                transaction_id: `TXN-${Date.now()}`, // Generate a unique transaction ID
                prev_balance: old_balance,
                new_balance: new_balance,
                status: 'Pending',
                user_id: user.id,
            }),
        });

        const transactionData = await transactionResponse.json();

        if (!transactionData.success) {
            Swal.fire({
                title: 'Transaction Failed',
                text: 'Unable to debit your wallet. Please try again later.',
                icon: 'error',
                customClass: { container: 'borderless' },
            });
            return;
        }

        // Proceed with the actual cable purchase request
        const response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id,
                phone: phoneNumber,
                biller_code,
                variation_code: variation_code.variation_code,
                subscription_type,
            }),
        });

        const data = await response.json();

        if (data.status === 'success') {
            // Update the transaction status to "Successful"
            await fetch(`${getBaseUrl()}/update_transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transaction_id: transactionData.transaction_id,
                    status: 'Successful',
                }),
            });

			// ✅ Update React Context balance
			setLoggedUser(prev => ({
				...prev,
				wallet: {
				...prev.wallet,
				available_balance: new_balance
				}
			}));

            // updateBalance(bundleAmount);
            // localStorage.setItem('wallet', JSON.stringify({ available_balance: new_balance }));

            Swal.fire({
                title: 'Transaction Approved',
                text: 'Your purchase was completed successfully',
                icon: 'success',
                customClass: { container: 'borderless' },
            });

        } else {
            // If the transaction failed, reverse the wallet deduction
            await fetch(`${getBaseUrl()}/add_transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: 'CableTV',
                    service: service_id,
                    amount: bundleAmount,
                    phone_num: phoneNumber,
                    transaction_id: `REV-${Date.now()}`, // Unique reversal transaction ID
                    prev_balance: new_balance,
                    new_balance: old_balance,
                    status: 'Reversed',
                    user_id: user.id,
                }),
            });

            Swal.fire({
                title: 'Transaction Failed',
                text: 'Your purchase could not be completed. Your wallet has been refunded.',
                icon: 'error',
                customClass: { container: 'borderless' },
            });
        }
    } catch (error) {
        alert('Error:', error);
    }
};


	const buyCable_b = async() => {
		
		const biller_code = codeRef.current.value;
		const variation_code = selectedPlan;
		const service_id = selectedIcon;
		let subscription_type = "renew"; // Default subscription type is renew unless explicitly stated otherwise
		let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters;
		// console.log(variation_code);
		let current_package = currentPackage.split(' + ');
		
		if (variation_code.name !== current_package[0] ) {
            subscription_type = "change"; // No change in plan, so it's a renewal

        } else {
            subscription_type = "renew"; // Change in plan, so it's a change subscription
        }

		try {
			// setIsLoading(true); // Set loading to true when the process starts

			// Get Wallet Balance
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0); 
			// const wallet = JSON.parse(localStorage.getItem('wallet'));
			// let old_balance = parseFloat(wallet?.available_balance || 0);

			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}

			// const response = await fetch("http://127.0.0.1:8000/api/vtservices_buy", {
			const response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service_id,
					phone: phoneNumber,
					biller_code,
					variation_code: variation_code.variation_code,
					subscription_type,
				}),
			});
			const data = await response.json();
			console.log(data);
			if (data.status === 'success') {
				console.log(data.data.content.transactions.phone);
				// Update the database or perform any additional actions if needed
				const wallet = JSON.parse(localStorage.getItem('wallet'));
				let old_balance = wallet.available_balance;
				let new_balance = old_balance - bundleAmount;

				const updatedb = await fetch(`${getBaseUrl()}/add_transaction`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						category: 'CableTV',
						service: service_id,
						amount: data.data.amount,
						phone_num: data.data.content.transactions.phone,
						transaction_id: data.data.content.transactions.transactionId,
						prev_balance: old_balance,
						new_balance: new_balance,
						status: 'Successful',
						user_id: user.id,
					}),
				});
				
	
				if (updatedb) {
					// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
					// updateBalance(bundleAmount);
					// localStorage.setItem('wallet', JSON.stringify(wallet));
				
					Swal.fire({
						title: 'Transaction Approved',
						text: 'Your purchase was completed successfully',
						icon: 'success',
						customClass: {
							container: 'borderless',
						},
					});
				} 
				else {
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
			}else if(data.status === 'processing'){
				Swal.fire({
                    title: 'Transaction Processing',
                    text: 'Your purchase is being processed. Please wait.',
                    icon: 'info',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}else{
				Swal.fire({
                    title: 'Transaction Failed',
                    text: 'Failed to process your purchase. Please try again later.',
                    icon: 'error',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}

		} catch (error) {
			alert('Error:', error);
		}finally{
			// setIsLoading(false); // Set loading to false when the process ends
		}
				
	};

	const buyBetting = async () => {
		let bundleAmount = parseFloat(amountRef.current.value);
		const bet_id = selectedIcon;
		const customer_id = customerCode;
		const customer_name = customerName;
	
		try {
			setIsDisabled(true);
	
			// 1️⃣ Get Wallet Balance
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet_id: user.id }),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0);
	
			// 2️⃣ Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}
	
			let new_balance = old_balance - bundleAmount;
	
			// 3️⃣ Add a "Pending" Transaction
			const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: 'Betting',
					service: selectedIcon,
					amount: bundleAmount,
					phone_num: account,
					transaction_id: `TXN_${Date.now()}`, // Temporary transaction ID
					prev_balance: old_balance,
					new_balance: new_balance,
					status: 'Pending',
					user_id: user.id,
				}),
			});
	
			const transactionData = await transactionResponse.json();
			if (!transactionData.success) {
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Unable to initiate transaction. Please try again.',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}
	
			const transaction_id = transactionData.transaction_id;
	
			// 4️⃣ Process the Payment
			const response = await fetch(`${getBaseUrl()}/payscribe_buy`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bet_id, customer_id, customer_name, amount: bundleAmount }),
			});
	
			const data = await response.json();
	
			// 5️⃣ Update Transaction Status
			if (data.status === true || data.message.details.transactions.status === 'success') {
				// Update transaction as "Successful"
				// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
				// updateBalance(bundleAmount);
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Successful' }),
				});
	
				// Update local wallet balance
				let wallet = JSON.parse(localStorage.getItem('wallet'));
				wallet.available_balance -= bundleAmount;
				localStorage.setItem('wallet', JSON.stringify(wallet));
	
				Swal.fire({
					title: 'Transaction Approved',
					text: 'Your purchase was completed successfully',
					icon: 'success',
					customClass: { container: 'borderless' },
				});
			} else {
				// Reverse the transaction
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Reversed' }),
				});
	
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Failed to process your purchase. Please try again later.',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
			}
	
			setIsModalOpen(false);
		} catch (error) {
			console.error('Error:', error);
			Swal.fire({
				title: 'Error',
				text: 'An unexpected error occurred. Please try again.',
				icon: 'error',
				customClass: { container: 'borderless' },
			});
		} finally {
			setIsDisabled(false);
		}
	};
	

	const buyBetting_b = async() => {
		
		let bundleAmount = amountRef.current.value;
		// console.log(variation_code);
		const bet_id = selectedIcon;
		const customer_id = customerCode;
		const customer_name = customerName;
		// console.log(bundleAmount);
		
		try {
			setIsDisabled(true);
			// setIsLoading(true); // Set loading to true when the process starts

			// Get Wallet Balance
			// Fetch the latest wallet balance from the server
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0); 

			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}
			

			// const response = await fetch("http://127.0.0.1:8000/api/vtservices_buy", {
			const response = await fetch(`${getBaseUrl()}/payscribe_buy`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					bet_id,
					customer_id,
					customer_name,
					amount: bundleAmount,
				}),
			});
			const data = await response.json();
			console.log(data);
			if (data.status === true || data.message.details.transactions.status === 'success') {
				// Update the database or perform any additional actions if needed
				const wallet = JSON.parse(localStorage.getItem('wallet'));
				let old_balance = wallet.available_balance;
				let new_balance = old_balance - bundleAmount;

				const updatedb = await fetch(`${getBaseUrl()}/add_transaction`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						category: 'Betting',
						service: selectedIcon,
						amount: bundleAmount,
						phone_num: account,
						transaction_id: data.message.details.trans_id,
						prev_balance: old_balance,
						new_balance: new_balance,
						status: 'Successful',
						user_id: user.id,
					}),
				});
				
	
				if (updatedb) {
					// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
					// updateBalance(bundleAmount);
					// const wallet = JSON.parse(localStorage.getItem('wallet'));
					// let old_balance = wallet.available_balance;
					// let new_balance = old_balance - amount;
					// wallet.available_balance = new_balance.toString();
					// localStorage.setItem('wallet', JSON.stringify(wallet));
				
					Swal.fire({
						title: 'Transaction Approved',
						text: 'Your purchase was completed successfully',
						icon: 'success',
						customClass: {
							container: 'borderless',
						},
					});
				} 
				else {
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
			}else if(data.status === 'processing'){
				Swal.fire({
                    title: 'Transaction Processing',
                    text: 'Your purchase is being processed. Please wait.',
                    icon: 'info',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}else{
				Swal.fire({
                    title: 'Transaction Failed',
                    text: 'Failed to process your purchase. Please try again later.',
                    icon: 'error',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}

		} catch (error) {
			alert('Error:', error);
		}finally{
			// setIsLoading(false); // Set loading to false when the process ends
		}
				
	};

	const buyEdu = async() => {
		// alert(edCategory);
		if(edCategory === 'JAMB'){
			// console.log('JAMB');
			setIsEd(false);
			setIsJAMB(true);
			try {
				setIsLoading(true); // Set loading to true when the process starts

				// const response = await fetch(`${getBaseUrl()}/get-multi-plans`, {
				const response = await fetch(`${getBaseUrl()}/get-multi-plans`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						service_id: edCategory,
					}),
				});
				const data = await response.json();
				// console.log(data.data.content.variations);
				setServicePlans(data.data.content.variations);
			} catch (error) {
				alert('Error:', error);
			}finally{
				setIsLoading(false); // Set loading to false when the process ends
			}
		}

		if (edCategory ==='WAEC'){
			setIsWAEC(true);
		}
				
	};


	const buyEd = async () => {
		const biller_code = codeRef.current.value;
		let variation_code = selectedPlan.variation_code || 'utme';
		const service_id = edCategory;
		let bundleAmount = parseFloat(amount.replace(/[^\d.]/g, "")); // Remove non-numeric characters
	
		try {
			setIsLoading(true);
	
			// Get Wallet Balance
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet_id: user.id }),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0);
	
			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsLoading(false);
				return;
			}
	
			let new_balance = old_balance - bundleAmount;
	
			// Add a "Pending" Transaction
			const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: 'Educational',
					service: service_id,
					amount: bundleAmount,
					phone_num: phoneNumber,
					transaction_id: `TXN_${Date.now()}`, // Temporary transaction ID
					prev_balance: old_balance,
					new_balance: new_balance,
					status: 'Pending',
					user_id: user.id,
				}),
			});
			const transactionData = await transactionResponse.json();
			if (!transactionData.success) {
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Unable to initiate transaction. Please try again.',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsLoading(false);
				return;
			}
			const transaction_id = transactionData.transaction_id;
	
			// Process Payment
			const response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ service_id, phone: phoneNumber, amount: bundleAmount, biller_code, variation_code }),
			});
			const data = await response.json();
	
			if (data.status === 'success') {
				// Update transaction as "Successful"
				// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
				// updateBalance(bundleAmount);
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Successful' }),
				});
	
				// Update Wallet Balance Locally
				let wallet = JSON.parse(localStorage.getItem('wallet'));
				wallet.available_balance -= bundleAmount;
				localStorage.setItem('wallet', JSON.stringify(wallet));
	
				// Show Success Message
				Swal.fire({
					title: 'Transaction Approved',
					text: 'Your purchase was completed successfully',
					icon: 'success',
					customClass: { container: 'borderless' },
				});
			} else {
				// Reverse the transaction if failed
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Reversed' }),
				});
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Failed to process your purchase. Please try again later.',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
			}
	
			setIsModalOpen(false);
		} catch (error) {
			console.error('Error:', error);
			Swal.fire({
				title: 'Error',
				text: 'An unexpected error occurred. Please try again.',
				icon: 'error',
				customClass: { container: 'borderless' },
			});
		} finally {
			setIsLoading(false);
		}
	};
	


	const buyEd_b = async() => {
		const biller_code = codeRef.current.value;
		let variation_code = selectedPlan.variation_code;
		const service_id = edCategory;	
		let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters
		
		if(variation_code === null || variation_code === '' || !variation_code){
			variation_code = 'utme';
		}

		try {
			setIsLoading(true); // Set loading to true when the process starts

			// Get Wallet Balance
			// Fetch the latest wallet balance from the server
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0); 

			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}

			const response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
			// const response = await fetch("http://127.0.0.1:8000/api/vtservices_buy", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service_id,
					phone: phoneNumber,
					amount: bundleAmount,
					biller_code,
					variation_code,
				}),
			});
			const data = await response.json();
			console.log(data);
			if (data.status === 'success') {
				console.log(data.data.content.transactions.phone);
				// Update the database or perform any additional actions if needed
				const wallet = JSON.parse(localStorage.getItem('wallet'));
				let old_balance = wallet.available_balance;
				let new_balance = old_balance - bundleAmount;

				const updatedb = await fetch(`${getBaseUrl()}/add_transaction`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						category: 'Educational',
						service: service_id,
						amount: data.data.content.transactions.amount,
						phone_num: data.data.content.transactions.phone,
						prev_balance: old_balance,
						new_balance: new_balance,
						transaction_id: data.data.content.transactions.transactionId,
						status: 'Successful',
						user_id: user.id,
					}),
				});
				if (updatedb) {
					// updateBalance(amount);
					// const wallet = JSON.parse(localStorage.getItem('wallet'));
					// let old_balance = wallet.available_balance;
					// let new_balance = old_balance - bundleAmount;
					// wallet.available_balance = new_balance.toString();
					// localStorage.setItem('wallet', JSON.stringify(wallet));

					// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
				

					   // Create receipt content
					const receiptContent = `
					<div id="receiptContent">
						<h3>Transaction Receipt</h3>
						<p><strong>PIN:</strong> ${data.data.purchased_code}</p>
						<p><strong>Phone:</strong> ${data.data.content.transactions.phone}</p>
						<p><strong>Profile ID:</strong> ${data.data.content.transactions.unique_element}</p>
						<p><strong>Amount:</strong> ${data.data.amount}</p>
						<p>${data.data.Pin}</p>
					</div>
				`;

					Swal.fire({
					title: 'Transaction Approved',
					html: receiptContent + `
						<br/>
						<button id="printReceipt" class="swal2-confirm swal2-styled" style="background-color: #4CAF50;">Print</button>
						<button id="exportPDF" class="swal2-confirm swal2-styled" style="background-color: #008CBA;">Export to PDF</button>
					`,
					icon: 'success',
					customClass: {
						container: 'borderless',
					},
					didOpen: () => {
						document.getElementById('printReceipt').addEventListener('click', () => {
							const printWindow = window.open('', '', 'width=600,height=600');
							printWindow.document.write('<html><head><title>Receipt</title></head><body>');
							printWindow.document.write(receiptContent);
							printWindow.document.write('</body></html>');
							printWindow.document.close();
							printWindow.print();
						});
			
						document.getElementById('exportPDF').addEventListener('click', async () => {
							const { jsPDF } = await import('jspdf'); // Import jsPDF dynamically
							const doc = new jsPDF();
							doc.text('Transaction Receipt', 10, 10);
							doc.text(`PIN: ${data.data.purchased_code}`, 10, 20);
							doc.text(`Phone: ${data.data.content.transactions.phone}`, 10, 30);
							doc.text(`Profile ID: ${data.data.content.transactions.unique_element}`, 10, 40);
							doc.text(`Amount: ${data.data.amount}`, 10, 50);
							doc.text(`${data.data.Pin}`, 10, 60);
							doc.save('Transaction_Receipt.pdf');
						});
					},
				});
			}
	
				
				else {
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
			}else if(data.status === 'processing'){
				Swal.fire({
                    title: 'Transaction Processing',
                    text: 'Your purchase is being processed. Please wait.',
                    icon: 'info',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}else{
				Swal.fire({
                    title: 'Transaction Failed',
                    text: 'Failed to process your purchase. Please try again later.',
                    icon: 'error',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}

		} catch (error) {
			alert('Error:', error);
		}finally{
			setIsLoading(false); // Set loading to false when the process ends
		}
				
	};

	const buyElectric = async () => {
		const biller_code = codeRef.current.value;
		const variation_code = selectedElectricPlan;
		const service_id = selectedIcon;

	
		const bundleAmount = amountRef.current.value || 0;
	
		try {
			setIsLoading(true);
	
			// Fetch Wallet Balance
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet_id: user.id }),
			});
			const walletData = await walletResponse.json();
			const old_balance = parseFloat(walletData?.available_balance || 0);
	
			// Check balance sufficiency
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				return;
			}

			let new_balance = old_balance - bundleAmount;

			//console.log(amount);
	
			// 3️⃣ Deduct amount & add a "Pending" Transaction
			const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: 'Electricity',
					service: service_id,
					amount: bundleAmount,
					phone_num: phone,
					transaction_id: `TXN_${Date.now()}`,
					prev_balance: old_balance,
					new_balance: new_balance,
					status: 'Pending',
					user_id: user.id,
				}),
			});
	
			const transactionData = await transactionResponse.json();
			if (!transactionData.success) {
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Unable to initiate transaction. Please try again.',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				setIsModalOpen(false);
				return;
			}
	
			const transaction_id = transactionData.transaction_id;
	
	
			// Process purchase
			const response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					service_id,
					phone: phoneNumber,
					amount: bundleAmount,
					biller_code,
					variation_code,
				}),
			});
			const data = await response.json();
	
			if (data.status === 'success') {
				const transaction = data.data.content.transactions;
				const new_balance = old_balance - bundleAmount;
	
				// Update transaction record
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Successful' }),
				});
	
				// Update local storage balance
				// const wallet = JSON.parse(localStorage.getItem('wallet'));
				// wallet.available_balance = new_balance.toString();
				// localStorage.setItem('wallet', JSON.stringify(wallet));
				// updateBalance(parseFloat(bundleAmount.replace(/[^\d.]/g, "")));
				// ✅ Update React Context balance
				setLoggedUser(prev => ({
					...prev,
					wallet: {
					...prev.wallet,
					available_balance: new_balance
					}
				}));
	
				// Show receipt modal
				showReceipt(data.data);
				setIsModalOpen(false);
			} else if (data.Status === 'processing') {
				Swal.fire({
					title: 'Transaction Processing',
					text: 'Your purchase is being processed. Please wait.',
					icon: 'info',
					customClass: { container: 'borderless' },
				});
				setIsModalOpen(false);
			} else {
				// ❗ Transaction failed, restore wallet balance
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Reversed' }),
				});
	
				// ✅ Restore deducted amount
				let reversedBalance = old_balance; // Reset balance to original value
				localStorage.setItem('wallet', JSON.stringify({ available_balance: reversedBalance }));
	
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Failed to process your purchase...',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsModalOpen(false);
			}

		} catch (error) {
			console.error('Transaction Error:', error);
			Swal.fire({ title: 'Error', text: 'An error occurred. Please try again.', icon: 'error' });
		} finally {
			setIsLoading(false);
		}
	};
	
	const showReceipt = (data) => {
		const receiptContent = `
			<div style="text-align: center; padding: 20px; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
				<h2 style="color: #4CAF50;">Transaction Receipt</h2>
				<p><strong>🔢 Token:</strong> ${data.token}</p>
				<p><strong>👤 Customer Name:</strong> ${data.customerName}</p>
				<p><strong>📍 Address:</strong> ${data.customerAddress}</p>
				<p><strong>💰 Amount:</strong> ₦${formatPrice(data.amount)}</p>
				<p><strong>⚡ Total Units:</strong> ${data.units} kWh</p>
				<hr/>
				<p style="font-size: 12px; color: gray;">Thank you for your purchase! 💡</p>
			</div>`;
	
		Swal.fire({
			title: 'Transaction Approved',
			html: receiptContent + `
				<br/>
				<button id="printReceipt" class="swal2-confirm swal2-styled" style="background-color: #4CAF50;">🖨️ Print</button>
				<button id="exportPDF" class="swal2-confirm swal2-styled" style="background-color: #008CBA;">📄 Export to PDF</button>
			`,
			icon: 'success',
			customClass: { container: 'borderless' },
			didOpen: () => {
				 // Print Receipt
				 document.getElementById('printReceipt').addEventListener('click', () => {
					const printWindow = window.open('', '', 'width=600,height=600');
					printWindow.document.write('<html><head><title>Receipt</title></head><body style="text-align:center;">');
					// printWindow.document.write(`<img src="${logo}" alt="paynxt" style="max-width: 120px; margin-bottom: 10px;">`);
					printWindow.document.write(receiptContent);
					printWindow.document.write('</body></html>');
					printWindow.document.close();
					printWindow.print();
				  });
			  
				// Export to PDF
				document.getElementById('exportPDF').addEventListener('click', async () => {
					const { jsPDF } = await import('jspdf');
					const doc = new jsPDF();
				
					// Add Logo (Centered & Square)
					if (logo) {
						doc.addImage(logo, 'PNG', 80, 10, 40, 40); // Centered logo
					}
				
					// Header
					doc.setFont("helvetica", "bold");
					doc.setFontSize(18);
					doc.setTextColor(44, 62, 80); // Dark Gray-Blue
					doc.text("Transaction Receipt", 65, 60);
					doc.setFontSize(12);
					doc.setFont("helvetica", "normal");
					doc.line(20, 65, 190, 65); // Horizontal line
				
					// Transaction Details Table
					const details = [
						{ label: "Token", value: data.data.token },
						{ label: "Name", value: data.data.customerName },
						{ label: "Address", value: data.data.customerAddress },
						{ label: "Amount", value: `NGN ${formatPrice(data.data.amount)}` },
						{ label: "Total Units", value: `${data.data.units} kWh` },
					];
				
					let y = 75; // Initial Y position
					details.forEach((item) => {
						doc.setFillColor(240, 240, 240); // Light gray background
						doc.rect(20, y - 5, 170, 10, 'F');
						
						doc.setFont("helvetica", "bold");
						doc.setTextColor(52, 73, 94); // Darker Gray
						doc.text(`${item.label}:`, 25, y);
						
						doc.setFont("helvetica", "normal");
						doc.setTextColor(41, 128, 185); // Soft Blue for values
						doc.text(item.value.toString(), 80, y);
						
						y += 15;
					});
				
					// Footer with Watermark Effect
					doc.line(20, y + 5, 190, y + 5);
					doc.setFontSize(10);
					doc.setTextColor(100);
					doc.text("Thank you for your purchase!", 70, y + 20);
					doc.setTextColor(200, 200, 200); // Light watermark effect
					doc.setFontSize(30);
					doc.text("PAYNXT", 60, y + 50, { opacity: 0.1 });
				
					// Save PDF
					doc.save("Transaction_Receipt.pdf");
				});
				
			},
		});
	};
	
	const handleTransactionFailure = (status) => {
		const messages = {
			processing: 'Your purchase is being processed. Please wait.',
			failed: 'Failed to process your purchase. Please try again later.',
		};
		Swal.fire({ title: 'Transaction Status', text: messages[status] || 'An error occurred.', icon: status === 'processing' ? 'info' : 'error' });
	};
	


	const buyElectric_b = async() => {
		const biller_code = codeRef.current.value;
		const variation_code = selectedElectricPlan;
		const service_id = selectedIcon;		
		let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters
		try {
			setIsLoading(true); // Set loading to true when the process starts

			// Get Wallet Balance
			// Fetch the latest wallet balance from the server
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0); 

			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}

			const response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
			// const response = await fetch("http://127.0.0.1:8000/api/vtservices_buy", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					service_id,
					phone: phoneNumber,
					amount,
					biller_code,
					variation_code,
				}),
			});
			const data = await response.json();
			console.log(data);
			if (data.status === 'success') {
				console.log(data.data.content.transactions.phone);
				// Update the database or perform any additional actions if needed
				const wallet = JSON.parse(localStorage.getItem('wallet'));
				let old_balance = wallet.available_balance;
				let new_balance = old_balance - bundleAmount;

				const updatedb = await fetch(`${getBaseUrl()}/add_transaction`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						category: 'Electricity',
						service: service_id,
						amount: data.data.content.transactions.amount,
						phone_num: data.data.content.transactions.phone,
						transaction_id: data.data.content.transactions.transactionId,
						prev_balance: old_balance,
						new_balance: new_balance,
						token: data.data.token,
						status: 'Successful',
						user_id: user.id,
					}),
				});
	
				
				if (updatedb) {
					// updateBalance(bundleAmount);
					// const wallet = JSON.parse(localStorage.getItem('wallet'));
					// let old_balance = wallet.available_balance;
					// let new_balance = old_balance - amount;
					// wallet.available_balance = new_balance.toString();
					// localStorage.setItem('wallet', JSON.stringify(wallet));

					// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
				

					// Modern receipt content with logo
					const receiptContent = `
					<div id="receiptContent" style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto; border-radius: 10px; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center;">
					<h2 style="color: #4CAF50;">Transaction Receipt</h2>
					<hr/>
					<p style="font-size: 14px;"><strong>🔢 Token:</strong> ${data.data.token}</p>
					<p style="font-size: 14px;"><strong>👤 Customer Name:</strong> ${data.data.customerName}</p>
					<p style="font-size: 14px;"><strong>📍 Address:</strong> ${data.data.customerAddress}</p>
					<p style="font-size: 14px;"><strong>💰 Amount:</strong> <span style="color: #008CBA;">₦${formatPrice(data.data.amount)}</span></p>
					<p style="font-size: 14px;"><strong>⚡ Total Units:</strong> ${data.data.units} kWh</p>
					<hr/>
					<p style="text-align: center; font-size: 12px; color: gray;">Thank you for your purchase! 💡</p>
					</div>
					`;
					Swal.fire({
						title: 'Transaction Approved',
						html: receiptContent + `
						  <br/>
						  <button id="printReceipt" class="swal2-confirm swal2-styled" style="background-color: #4CAF50;">🖨️ Print</button>
						  <button id="exportPDF" class="swal2-confirm swal2-styled" style="background-color: #008CBA;">📄 Export to PDF</button>
						`,
						icon: 'success',
						customClass: {
							container: 'borderless',
						},
						didOpen: () => {
						  // Print Receipt
						  document.getElementById('printReceipt').addEventListener('click', () => {
							const printWindow = window.open('', '', 'width=600,height=600');
							printWindow.document.write('<html><head><title>Receipt</title></head><body style="text-align:center;">');
							// printWindow.document.write(`<img src="${logo}" alt="paynxt" style="max-width: 120px; margin-bottom: 10px;">`);
							printWindow.document.write(receiptContent);
							printWindow.document.write('</body></html>');
							printWindow.document.close();
							printWindow.print();
						  });
					  
						// Export to PDF
						document.getElementById('exportPDF').addEventListener('click', async () => {
							const { jsPDF } = await import('jspdf'); // Import jsPDF dynamically
							const doc = new jsPDF();
						
							// Add Logo (Centered & Square)
							if (logo) {
								doc.addImage(logo, 'PNG', 75, 10, 40, 40); // Square logo
							}
						
							// Header
							doc.setFont("helvetica", "bold");
							doc.setFontSize(16);
							doc.text("Transaction Receipt", 65, 60); // Adjusted Y position
							doc.setFontSize(12);
							doc.setFont("helvetica", "normal");
							doc.line(20, 65, 190, 65); // Horizontal line for separation
						
							// Transaction Details
							const details = [
								{ label: "Token", value: data.data.token },
								{ label: "Name", value: data.data.customerName },
								{ label: "Address", value: data.data.customerAddress },
								{ label: "Amount", value: `NGN ${formatPrice(data.data.amount)}` },
								{ label: "Total Units", value: `${data.data.units} kWh` },
							];
						
							let y = 75; // Initial Y position (Adjusted for better spacing)
							details.forEach((item) => {
								doc.setFont("helvetica", "bold");
								doc.text(`${item.label}:`, 20, y);
								doc.setFont("helvetica", "normal");
								doc.text(item.value.toString(), 70, y);
								y += 12; // Increased line spacing
							});
						
							// Footer with Extra Bottom Margin
							doc.line(20, y + 5, 190, y + 5); // Footer separator
							doc.setFontSize(10);
							doc.setTextColor(100);
							doc.text("Thank you for your purchase!", 70, y + 20); // Added extra bottom margin
						
							// Save PDF
							doc.save("Transaction_Receipt.pdf");
						});
						

						},
					  });
			}
				
				else {
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
			}else if(data.status === 'processing'){
				Swal.fire({
                    title: 'Transaction Processing',
                    text: 'Your purchase is being processed. Please wait.',
                    icon: 'info',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}else{
				Swal.fire({
                    title: 'Transaction Failed',
                    text: 'Failed to process your purchase. Please try again later.',
                    icon: 'error',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}

		} catch (error) {
			alert('Error:', error);
		}finally{
			setIsLoading(false); // Set loading to false when the process ends
		}
				
	};

	const buyData = () => {
		const category = 'buyData';
		// alert(provider);
		// return;
		setIsDisabled(true);
		if(network===5){
			smile_box(category);
		}else{
			let amountInCents;
			const phone = phoneRef.current?.value;
			const amount = amountRef.current?.value;
			if(amount){
				amountInCents= amount.replace("₦", "");
			}
			const id = selectedPlanId;
			buy(id, phone, category,amountInCents, provider);
		}
				
	};

	const buySmile = async () => {
		// console.log('test');
		let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters
		var response;
		try {
			 setIsLoading(true); // Set loading to true when the process starts

			 // Get Wallet Balance
			// Fetch the latest wallet balance from the server
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0); 

			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}
		
				response = await fetch(`${getBaseUrl()}/purchaseBundle`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						account_id: phoneNumber,
						bundleTypeCode: smileSelected,
						category: 'Smile',
						amount:bundleAmount,
					}),
				});
			
	
			const data = await response.json();
			// console.log(data);
	
			if (data.Done === 'true') {
				// Update the database or perform any additional actions if needed
				const wallet = JSON.parse(localStorage.getItem('wallet'));
				let old_balance = wallet.available_balance;
				let new_balance = old_balance - bundleAmount;
				const updatedb = await fetch(`${getBaseUrl()}/add_transaction`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						service: 'Smile', // 'Data' is hardcoded, adjust as needed
						amount: bundleAmount,
						phone_num: phoneNumber,
						prev_balance: old_balance,
						new_balance: new_balance,
						transaction_id: data.TxId,
						status: 'Successful',
						user_id: user.id,
					}),
				});
	
				if (updatedb) {
					// updateBalance(bundleAmount);
					// const wallet = JSON.parse(localStorage.getItem('wallet'));
					// let old_balance = wallet.available_balance;
					// let new_balance = old_balance - amount;
					// wallet.available_balance = new_balance.toString();
					// localStorage.setItem('wallet', JSON.stringify(wallet));
					// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
				
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
			}else if(data.Status === 'processing'){
				Swal.fire({
                    title: 'Transaction Processing',
                    text: 'Your purchase is being processed. Please wait.',
                    icon: 'info',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}else{
				Swal.fire({
                    title: 'Transaction Failed',
                    text: 'Failed to process your purchase. Please try again later.',
                    icon: 'error',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}
		} catch (error) {
			// console.error("Error:", error);
		} finally {
			 setIsLoading(false); // Set loading to false when the process ends
		}
	};

	const buy = async (id, phone, category, amount) => {
		let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters
		var response;
		
		try {
			setIsLoading(true); // Set loading to true when the process starts
	
			// 1️⃣ Get Wallet Balance
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ wallet_id: user.id }),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0);
	
			// 2️⃣ Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				setIsModalOpen(false);
				return;
			}
	
			let new_balance = old_balance - bundleAmount;

			// console.log(bundleAmount);
	
			// 3️⃣ Deduct amount & add a "Pending" Transaction
			const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category,
					service: isAirtime ? 'Airtime' : 'Data',
					amount: bundleAmount,
					phone_num: phone,
					transaction_id: `TXN_${Date.now()}`,
					prev_balance: old_balance,
					new_balance: new_balance,
					status: 'Pending',
					user_id: user.id,
				}),
			});
	
			const transactionData = await transactionResponse.json();
			if (!transactionData.success) {
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Unable to initiate transaction. Please try again.',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				setIsModalOpen(false);
				return;
			}
	
			const transaction_id = transactionData.transaction_id;
	
			// 4️⃣ Process the Payment
			response = await fetch(`${getBaseUrl()}/${isData ? 'buyData' : 'vtservices_buy'}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount: bundleAmount,
					mobile_number: phone,
					network,
					plan: isData ? selectedPlan : '',
					category,
				}),
			});
	
			const data = await response.json();
	
			// 5️⃣ Update Transaction Status
			if (data.Status === 'successful' || data.status === 'success') {
				// updateBalance(bundleAmount);
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Successful' }),
				});
	
				// ✅ Update local wallet balance
				// let wallet = JSON.parse(localStorage.getItem('wallet'));
				// wallet.available_balance = new_balance;
				// localStorage.setItem('wallet', JSON.stringify(wallet));
				// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
	
				Swal.fire({
					title: 'Transaction Approved',
					text: 'Your purchase was completed successfully',
					icon: 'success',
					customClass: { container: 'borderless' },
				});
				setIsModalOpen(false);
			} else if (data.Status === 'processing') {
				Swal.fire({
					title: 'Transaction Processing',
					text: 'Your purchase is being processed. Please wait.',
					icon: 'info',
					customClass: { container: 'borderless' },
				});
				setIsModalOpen(false);
			} else {
				// ❗ Transaction failed, restore wallet balance
				await fetch(`${getBaseUrl()}/update_transaction`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ transaction_id, status: 'Reversed' }),
				});
	
				// ✅ Restore deducted amount
				let reversedBalance = old_balance; // Reset balance to original value
				localStorage.setItem('wallet', JSON.stringify({ available_balance: reversedBalance }));
	
				Swal.fire({
					title: 'Transaction Failed',
					text: 'Failed to process your purchase...',
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsModalOpen(false);
			}
	
		} catch (error) {
			console.error("Error:", error);
			Swal.fire({
				title: 'Error',
				text: 'An unexpected error occurred. Please try again.',
				icon: 'error',
				customClass: { container: 'borderless' },
			});
			setIsModalOpen(false);
		} finally {
			setIsLoading(false);
		}
	};
	

	const buy_b = async (id, phone, category, amount) => {
		// console.log('test');
		let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters
		
		var response;
		try {
			 setIsLoading(true); // Set loading to true when the process starts

			 // Get Wallet Balance
			// Fetch the latest wallet balance from the server
			const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				// headers: { 'Authorization': `Bearer ${user.token}` }, // Use auth if required
				body: JSON.stringify({
					wallet_id: user.id,
				}),
			});
			const walletData = await walletResponse.json();
			let old_balance = parseFloat(walletData?.available_balance || 0); 

			// Check if balance is sufficient
			if (old_balance < bundleAmount) {
				Swal.fire({
					title: 'Insufficient Balance',
					text: `You need at least NGN ${bundleAmount} to proceed.`,
					icon: 'error',
					customClass: { container: 'borderless' },
				});
				setIsDisabled(false);
				return;
			}

			if (isData) {
				response = await fetch(`${getBaseUrl()}/buy`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						mobile_number: phone,
						plan: id,
						network,
						category: category,
						amount: bundleAmount,
					}),
				});
			} else if (isAirtime) {
				// response = await fetch('http://127.0.0.1:8000/api/buy',{
				response = await fetch(`${getBaseUrl()}/vtservices_buy`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						amount: bundleAmount,
						mobile_number: phone,
						network,
						plan: '',
						category: category,
					}),
				});
			}
	
			const data = await response.json();
			// console.log(data);

			const service = isAirtime ? 'Airtime' : 'Data';
	
			if (data.Status === 'successful' || data.status === 'success') {
				// Update the database or perform any additional actions if needed
				const wallet = JSON.parse(localStorage.getItem('wallet'));
				let old_balance = wallet.available_balance;
				let new_balance = old_balance - bundleAmount;
				let transaction_id = '';
				if (data.ident === '' || !data.ident){
					transaction_id = data.data.content.transactions.transactionId
				}else{
					transaction_id = data.ident
				}
				let category='';
				if(service === 'Airtime'){
					category = 'Airtime'
				}else{
					category = 'Data'
				}
				// const updatedb =  await fetch('http://127.0.0.1:8000/api/add_transaction', {

				const updatedb = await fetch(`${getBaseUrl()}/add_transaction`,{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						category,
						service, // 'Data' is hardcoded, adjust as needed
						amount: bundleAmount,
						phone_num: phone,
						transaction_id,
						prev_balance: old_balance,
						new_balance: new_balance,
						status: 'Successful',
						user_id: user.id,
					}),
				});
	
				if (updatedb) {
					// updateBalance(bundleAmount);
					// const wallet = JSON.parse(localStorage.getItem('wallet'));
					// let old_balance = wallet.available_balance;
					// let new_balance = old_balance - amount;
					// wallet.available_balance = new_balance.toString();
					// localStorage.setItem('wallet', JSON.stringify(wallet));

					// ✅ Update React Context balance
					setLoggedUser(prev => ({
						...prev,
						wallet: {
						...prev.wallet,
						available_balance: new_balance
						}
					}));
				
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
			}else if(data.Status === 'processing'){
				Swal.fire({
                    title: 'Transaction Processing',
                    text: 'Your purchase is being processed. Please wait.',
                    icon: 'info',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}else{
				Swal.fire({
                    title: 'Transaction Failed',
                    text: 'Failed to process your purchase. Please try again later.',
                    icon: 'error',
                    customClass: {
                        container: 'borderless',
                    },
                });
                setIsModalOpen(false);
			}
		} catch (error) {
			// console.error("Error:", error);
		} finally {
			 setIsLoading(false); // Set loading to false when the process ends
		}
	};
	
	// Function to format the price as currency
    const formatPrice = price => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        }).format(price);
    };


	const handlePlanSelectChange1 = async (event) => {
		// const value = e.target.value;
		// setIsDisabled(true);

		alert(event.target.value);
		const selected = event.target.value;
		const price = selected.split('-')[1];
		const plan_id= selected.split('-')[0];
		console.log(selected);

		setSelectedPlanId(plan_id);

		if (typeof selected.split('-')[2] === "undefined"){
			// amountRef.current.value = `₦${formatPrice(parseInt(price)+(0.20*parseInt(price)))}`;
			amountRef.current.value = `₦${formatPrice(parseInt(price))}`;
			
		
		}else{
			amountRef.current.value = `₦${formatPrice(parseInt(price))}`;
		}

		if (phoneRef.current.value.length < 11) {
			phoneRef.current.focus();
		  }
			
	};

	// Handle plan selection
	const handlePlanSelectChange = (plan) => {
		//console.log(plan.variation_amount);
		// console.log(provider);
		setSelectedPlan(plan);
		if (plan.variation_amount || plan.price) {
			setAmount(plan.variation_amount || plan.price); // Update amount based on selected plan
		}
	};

	const [selectedIcon, setSelectedIcon] = useState(null);

	const validateCustomer = async (event) => {
		const customer = event.target.value;
		console.log(customer);
		try {
			const response = await fetch(`${getBaseUrl()}/validateAccount`, {
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

	//   const handleServiceIconChange = async (event) => {
	// 	const selectedValue = event.target.value;
	// 	setSelectedPlanId(null);
	// 	setIsDisabled(true);
    //     setSelectedIcon(selectedValue);
	// 	setIsVisible(true);
		
		
    // };

	
	const handleElectricChange = (event) => {
		const selectedValue = event.target.value;
		// console.log(selectedValue);
		
		setSelectedIcon(selectedValue);
		setIsElectricity(false);
		setIsElectric(true);
	
		// Mapping object for electric images
		const electricImages = {
			'Kaduna-Electric': kaduna,
			'Kano-Electric': kano,
			'Jos-Electric': jos,
			'Abuja-Electric': abuja,
			'Yola-Electric': yola,
			'Aba-Electric': aba,
			'Enugu-Electric': enugu,
			'Ikeja-Electric': ikeja,
			'Eko-Electric': eko,
			'PH-Electric': phed,
			'Ibadan-Electric': ibadan,
			'Benin-Electric': bedc,
		};
	
		// Set the image using the mapping
		setElectricImage(electricImages[selectedValue] || null); // Default to null if not found
	};
	

    const handleIconChange = async (event) => {
        const selectedValue = event.target.value;
		// console.log(selectedValue);
		// return ;
		// setDataPlans([]);
		// setIsValidateLoading(false);
		// setIsLoading(false);
		// setLoading(false);
		setSelectedPlanId('');
		setSelectedPlan(null);
		setIsDisabled(true);
        setSelectedIcon(selectedValue);
		setBillerCode('');
		setIsVisible(true);
		setAmount('');
		if(phoneRef.current){
			phoneRef.current.focus();
		}	

		const serviceMapping = {
			'DSTV': 1,
			'GoTV': 2,
			'Kaduna-Electric':3,
			'Jos-Electric':	4,
			'Abuja-Electric': 5,
			'JAMB' : 6,
			'WAEC': 7,
		  };
	
		const networkMapping = {
			'9Mobile': 3,
			'Airtel': 4,
			'Glo': 2,
			'MTN': 1,
		  };
		  
		  if(isCable){
			setServiceID(serviceMapping[selectedValue]);
		}
          setNetwork(networkMapping[selectedValue]);

		  
		if (isCable) {
			// console.log('cable');
			setServicePlans([]);
			if (selectedValue) {
				
					try {
						setIsLoading(true); // Set loading to true when the process starts
						const response = await fetch(`${getBaseUrl()}/get-multi-plans`, {
						// const response = await fetch('http://localhost:8000/api/get-multi-plans', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								service_id: selectedValue,
							}),
						});
						const data = await response.json();
						// console.log(data.data.content.variations);
						setServicePlans(data.data.content.variations);
					} catch (error) {
						alert('Error:', error);
					}finally{
						setIsLoading(false); // Set loading to false when the process ends
					}
			//	}
				
			} else {
				// setDataPlans([]);
			}
		}

		if (isData) {
			
			if (selectedValue) {
			
					try {
						if (amountRef.current) amountRef.current.value = ''; // Clear the amount field
						if (selectRef.current) selectRef.current.value = '';
						setIsLoading(true); // Set loading to true when the process starts
						// const response = await fetch(`${getBaseUrl()}/getplans`, {
						const response = await fetch(`${getBaseUrl()}/getallplans`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								network: selectedValue,
							}),
						});
						const data = await response.json();
						//console.log(data.content);
					setDataPlans(data.plans);
					} catch (error) {
						alert('Error:', error);
					}finally{
						setIsLoading(false); // Set loading to false when the process ends
					}
			//	}
				
			} else {
				// setDataPlans([]);
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
			// setDataPlans([]);

			if (selectedValue) {
				try {
					const response = await fetch(`${getBaseUrl()}/getplans`, {
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

		if(isCable){
			const plan = servicePlans.find((p) => p.variation_code === selectedValue);
			setSelectedPlan(plan);
		}

		
	};


	const adjustViewBox = () => {
		const svg = document.querySelector('.border');
		if (window.innerWidth < 768) {
			svg.setAttribute('viewBox', '0 0 186 130'); // Taller viewBox for mobile
		} else {
			svg.setAttribute('viewBox', '0 0 186 123'); // Default viewBox
		}
	};

	useEffect(() => {
		adjustViewBox();
		window.addEventListener('resize', adjustViewBox);
		return () => window.removeEventListener('resize', adjustViewBox);
	}, []);
// console.log(dailyTransactions);

	
/* Reusable Table Component */
const SummaryTable = ({ transactions, loading, role }) => (
	<div className="mx-3 lg:mx-[5px]">
	  <motion.div
		initial="hidden"
		whileInView="visible"
		transition={{ duration: 0.8 }}
		variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
		className="overflow-hidden rounded-lg"
	  >
		<table className="styled-table text-[13px] lg:text-[14px]">
		  <thead>
			<tr className="text-[12px] lg:text-[14px]">
			  {role === "admin" && <th width="15%" style={{ paddingLeft: "15px" }}>User</th>}
			  <th style={{ paddingLeft: "15px" }}>Category</th>
			  <th  style={{ paddingRight: "85px" }}>Amount [₦]</th>
			</tr>
		  </thead>
		  <tbody>
			{loading ? (
			  <tr>
				<td colSpan={role === "admin" ? 3 : 2} className="flex text-center">Loading...</td>
			  </tr>
			) : transactions.length > 0 ? (
			  transactions.map((transaction, index) => (
				<tr key={index}>
				  {role === "admin" && <td><span className="pl-4">{transaction.name.split(' ')[0]}</span></td>}
				  <td><span className="pl-4">{transaction.category}</span></td>
				  <td><span className="pr-4">{formatPrice(transaction.amount)}</span></td>
				</tr>
			  ))
			) : (
			  <tr className='flex items-center justify-center'>
				<td colSpan={role === "admin" ? 3 : 2} className="text-center">No Transactions</td>
			  </tr>
			)}
		  </tbody>
		  {!loading && transactions.length > 0 && (
			<tfoot>
			  <tr>
				<td className="font-bold"><span className="pl-4">Total</span></td>
				<td className="font-bold">₦{formatPrice(transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0))}</td>
			  </tr>
			</tfoot>
		  )}
		</table>
	  </motion.div>
	</div>
  );
  

	return (
		<div className="super__feature mt-5 lg:mx-[82px] mb-6 overflow-hidden">
			<div className="lg:mx-[20px] md:mx-[30px] mx-[30px]">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.5 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: -200 },
						}}
						className="super__actions-header mt-3 lg:mb-4"
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
					className="super__actions grid grid-flow-row-dense mx-[2%] md:ml-20 lg:ml-4 justify-right gap-4 grid-cols-3 md:grid-cols-3 mb-2 text-[13px] lg:flex flex-row items-center text-[15px] justify-between"


					// className="super__actions grid grid-flow-row-dense justify-between grid-cols-3 mb-2 ml-3 lg:ml-0 text-[13px] lg:flex flex-row items-center pl-5 justify-center  text-[15px]"
				>

					
						<button onClick={buy_airtime} className="cta__btn1 btn btnr">
							<svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="120" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="120" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center sm:text-white">
								<img src={call} width="25" alt="Smile" className="mb-2" />
								<h2>Airtime</h2>
							</div>
						</button>


						<button onClick={buy_data} className='cta__btn1 btn btnr'>
						<svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center sm:text-white ">
							<img src={internet} width="25" alt='Smile' className='mb-2'/>
							<h2>Data</h2>
							</div>
						</button>
						
						{/* <button onClick={buy_betting} className='cta__btn1 btn btnr'>
						<svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center text-white ">
							<img src={bet} width="25" alt='Smile' className='mb-2'/>
							<h2>Betting</h2>
							</div>
						</button> */}

						<button onClick={buy_cable} className='cta__btn1 btn btnr'>
						<svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center sm:text-white ">
							<img src={tv} width="25" alt='Smile' className='mb-2'/>
							<h2>Cable TV</h2>
							</div>
						</button>

						 <button onClick={buy_electricity} className='cta__btn1 btn btnr'>
						 <svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center sm:text-white ">
							<img src={bolt} width="25" alt='Smile' className='mb-2'/>
							<h2>Electricity</h2>
							</div>
						</button>
					
						<button onClick={buy_ed} className='cta__btn1 btn btnr'>
						<svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center sm:text-white ">
							<img src={book} width="25" alt='Smile' className='mb-2'/>
							<h2>Educational</h2>
							</div>
						</button>
					
					
					{role !== 'user'  &&(
						<button onClick={sales_report} className='cta__btn1 btn btnr'>
						<svg 
								className="border" 
								viewBox="0 0 186 100" 
								preserveAspectRatio="none" 
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="bg-line" 
								/>
								<rect 
									x="1" 
									y="1" 
									width="184" 
									height="98" 
									rx="10" 
									ry="10" 
									className="hl-line" 
								/>
							</svg>
							<div className="flex flex-col w-full p-3 text-center items-center sm:text-white ">
							<img src={report} width="25" alt='Smile' className='mb-2'/>
							<h2>Report</h2>
							</div>
						</button>
					
					)}
					
					

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
					// className="fixed z-10 inset-0 overflow-y-auto backdrop-blur"
								className="fixed z-10 inset-0 overflow-visible backdrop-blur"
					// className="fixed z-10 inset-0 overflow-visible backdrop-blur flex items-center justify-center"

					// className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center overflow-visible"
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
							<div className="flex bg-[#fafafa] px-4 py-3 sm:px-2 justify-between">
								<div className="flex items-center">
									{/* <img src={logo} alt="logo" className="w-12" /> */}
									<motion.div
										initial={{ x: 200, opacity: 0 }}
										animate={{
											x: 0,
											opacity: 1,
											transition: { duration: 0.2 },
										}}
										className=" w-full text-[#206666]"
									>
										<span className="font-bold drop-shadow">PayNxt</span>{' '}
									</motion.div>
								</div>
								<button
									onClick={() => setIsModalOpen(false)}
									className="text-[#042326] hover:text-[#160819] transition ease-in-out duration-150 "
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
							<div className="p-6 md:px-4 py-2">
							{isLoading && (
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
									<div className="flex flex-col items-center">
										<img src={wait} alt="Loading..." className="h-16 w-16 mb-2 rounded-lg" />
										{/* <span className="text-white text-lg font-medium">Processing your request...</span> */}
									</div>
								</div>
							)}
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
												<div className="icon-container my-3">
													
													<label className='mr-1 border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="9Mobile" checked={selectedIcon === "9Mobile"}
                    										onChange={handleIconChange}
														/>
														<div className="icon">
															<img src={etisalat} alt="9Mobile"/>
															
														</div>
													</label>
													<label className='mr-1 border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="Airtel" checked={selectedIcon === "Airtel"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={airtel} alt="Airtel"/>
															
														</div>
													</label>
													<label className='mr-1 border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="Glo" checked={selectedIcon === "Glo"}
                   											 onChange={handleIconChange}/>
														<div className="icon">
															<img src={glo} alt="Glo"/>
															
														</div>
													</label>
													<label className='border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="MTN" checked={selectedIcon === "MTN"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={mtn} alt="MTN"/>
															{/* <span>MTN</span> */}
														</div>
													</label>
												</div>
												{/* <input
													type="text"
													ref={phoneRef}
													// value={phoneNumber} // Bind value to state
													placeholder="Phone Number"
													onKeyDown={handleKeyDown} // Block non-numeric input
													onChange={handlePhoneChange} // Handle the input change
													// onBlur={checkNumber} // Trigger checkNumber when the input loses focus
													style={{
														display: isVisible ? "block" : "none",
														appearance: "textfield", // Removes spinner in some browsers
													}}
													inputMode="numeric" // Ensures only numeric input mode
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/> */}

													{/* <input
														ref={phoneRef}
														type="tel"
														placeholder="Phone Number"
														value={phoneNumber}
														onChange={(e) => {
														const value = e.target.value;
														// Allow only digits
														if (/^\d*$/.test(value)) {
															setPhoneNumber(value);
														}
														}}
														style={{ display: isVisible ? "block" : "none" }}
														className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/> */}
													<div  className="relative flex items-center mb-2">
														<input
															ref={phoneRef}
															type="tel"
															placeholder="Phone Number"
															value={phoneNumber}
															onChange={(e) => {
															const value = e.target.value;
															// Allow only digits
															if (/^\d*$/.test(value)) {
																setPhoneNumber(value);
															}
															}}
															style={{ display: isVisible ? "block" : "none" }}
															className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
														/>
														 <button type="button" onClick={() => {getAddressBook(); setCategory('isAirtime')}} style={{ display: isVisible ? "block" : "none" }} className="absolute top-2 right-2 text-gray-500">
															<FaAddressBook size={24}  color='#042326'/>
														 </button>
													</div>
												
		
													<input
														ref={amountRef}
														type="number"
														placeholder="Amount"
														value={amount}
														onChange={(e) => {
														const value = e.target.value;
														setCategory('isAirtime');
														// Allow only digits
														if (/^\d*$/.test(value)) {
															setAmount(value);
														}
														}}
														style={{ display: isVisible ? "block" : "none" }}
														className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-4 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
												
												{/* <h3 className="mb-2">Save Beneficiary</h3>
												
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														
													></span>
												</label> */}
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
												<div className="icon-container my-3">
													
													
													<label className='mr-1 border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="9Mobile" checked={selectedIcon === "9Mobile"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={etisalat} alt="9Mobile"/>
															
														</div>
													</label>
													<label className='mr-1 border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="Airtel" checked={selectedIcon === "Airtel"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={airtel} alt="Airtel"/>
															
														</div>
													</label>
													<label className='mr-1 border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="Glo" checked={selectedIcon === "Glo"}
                   											 onChange={handleIconChange}/>
														<div className="icon">
															<img src={glo} alt="Glo"/>
															
														</div>
													</label>
													<label className='border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="MTN" checked={selectedIcon === "MTN"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={mtn} alt="MTN"/>
														</div>
													</label>
												</div>
												{selectedIcon==='Smile' ? (
													<input
													type="tel"
													placeholder="Customer ID"
													onChange={validateCustomer}
													ref={phoneRef}
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												):(
													<div  className="relative flex items-center mb-2">
														<input
															ref={phoneRef}
															type="tel"
															placeholder="Phone Number"
															value={phoneNumber}
															onChange={(e) => {
															const value = e.target.value;
															// Allow only digits
															if (/^\d*$/.test(value)) {
																setPhoneNumber(value);
															}
															}}
															style={{ display: isVisible ? "block" : "none" }}
															className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
														/>
														 <button type="button" onClick={() => {getAddressBook(); setCategory('isData')}} style={{ display: isVisible ? "block" : "none" }} className="absolute top-2 right-2 text-gray-500">
															<FaAddressBook size={24}  color='#042326'/>
														 </button>
													</div>
													
												)}
												

 												{isVisible && (
													<Listbox value={selectedPlan} onChange={(plan)=>{
														setProvider(plan.source); handlePlanSelectChange(plan)}
													}>
														{/* Button to open dropdown */}
														<Listbox.Button
															ref={refs.setReference}
															className="block w-full py-2.5 px-3 mb-2 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
														>
															{selectedPlan?.name || (selectedPlan?.plan_type && selectedPlan?.plan) 
																? `${selectedPlan.plan_type || selectedPlan.name}  ${selectedPlan.plan ? selectedPlan.plan : ''}  ${selectedPlan.plan ? selectedPlan.month_validate : ''} - ₦${selectedPlan.price || selectedPlan.variation_amount}`
																: "Select a plan..."}
															<ChevronsUpDown className="h-5 w-5 text-gray-400" />
														</Listbox.Button>

														{/* Dropdown options */}
														<Listbox.Options
															ref={refs.setFloating}
															style={floatingStyles}
															className="w-[94%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[200px] overflow-auto text-[14px]"
														>
															{dataPlans.length > 0 ? (
																dataPlans.map((plan, index) => (
																	<Listbox.Option
																		key={index}
																		value={plan}
																		className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between items-center"
																	>
																		{plan.name || plan.plan_type} {plan?.plan} {plan?.month_validate} - ₦{plan.variation_amount || plan.price}
																		
																		{/* Show a check icon if this plan is selected */}
																		{/* {selectedPlan?.variation_code === plan.variation_code && (
																			<Check className="h-5 w-5 text-green-500" />
																		)} */}
																	</Listbox.Option>
																))
															) : (
																<div className="p-3 text-gray-500">No plans available</div>
															)}
														</Listbox.Options>
													</Listbox>

												)}

												<input
													type="text"
													placeholder="Amount"
													// value = {amount?amount:''}
													value = {amount ? `₦${formatPrice(amount)}` : ""}
													ref={amountRef}
													readOnly
													style={{
														display: isVisible ? "block" : "none",
														appearance: "textfield", // Removes spinner in some browsers
													}}
													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-4 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												{/* <h3 className="mb-2">Save Beneficiary</h3>

												<label className="toggle mb-4">
													<input type="checkbox" className="w-3" />
													<span className="slider"></span>
													<span
														className="labels"
														
													></span>
												</label> */}
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
      animate={{ x: 0, opacity: 1, transition: { duration: 0.2 } }}
      className="w-full text-[#ddd]"
    >
      <span className="font-bold text-[#042326] text-lg">Daily Summary</span>
    </motion.div>

    {/* Collapsible Sections for Each Day */}
    <div className="mt-4">
      {[...Array(5)].map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (4 - index)); // Reverse order: Latest first
        const formattedDate = index === 4 ? "Today" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        const tabKey = index === 4 ? "today" : `day-${4 - index}`;
        const isActive = dailyActiveTab === tabKey;

        return (
          <div key={tabKey} className="border-b border-gray-300">
            <button
              className="w-full flex justify-between items-center px-5 py-3 text-left font-semibold text-gray-700 bg-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-200"
              onClick={() => setDailyActiveTab(isActive ? "" : tabKey)}
            >
              {formattedDate}
              <motion.div
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden p-1 bg-gray-50 rounded-lg shadow-inner"
                >
                  <SummaryTable transactions={dailyTransactions[4 - index]} loading={loading} role={role} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>

    {/* Close Button */}
    <button
      onClick={() => setIsModalOpen(false)}
      type="button"
      className="w-full md:w-auto mt-4 text-white bg-[#206657] hover:bg-[#230d29] transition-all duration-300 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      Close
    </button>
  </div>
)}


								{isSettings && (
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
									<span className="font-bold text-[#042326]">Settings</span>
									</motion.div>
									<div className="pt-2">
									{/* Settings Tabs */}
									<div className="settings-tabs">
										<div className="tabs flex mb-4 border-b mr-2 border-[#ccc]">
										<button
											className={`tab-button ${activeTab === "account" ? "active" : ""}`}
											onClick={() => setActiveTab("account")}
										>
											Account
										</button>
										<button
											className={`tab-button ${activeTab === "security" ? "active" : ""}`}
											onClick={() => setActiveTab("security")}
										>
											Security
										</button>
										
										</div>
										
										{/* Tab Content */}
										<div className="tab-content">
										{/* Account Tab Content */}
										{activeTab === "account" && (
											<div>
											<h2 className="text-lg  mb-4">Account Settings</h2>
											<form>
												<div className="mb-4">
												<label htmlFor="name" className="block text-sm font-medium">
													Full Name
												</label>
												<input
													type="text"
													id="name"
													placeholder="Enter your full name"
													className="w-full border border-gray-300 rounded-lg p-2"
												/>
												</div>
												
												<div className="mb-4">
												<label htmlFor="profile-pic" className="block text-sm font-medium">
													Profile Picture
												</label>
												<input
													type="file"
													id="profile-pic"
													className="w-full border border-gray-300 rounded-lg p-2"
												/>
												</div>
												<button
												type="button"
												className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
												>
												Save Changes
												</button>
											</form>
											</div>
										)}

										{/* Security Tab Content */}
										{activeTab === "security" && (
											<div>
											<h2 className="text-lg mb-4">Security Settings</h2>

											<div className="mt-4">
												{/* <h3 className="font-medium mb-2">Two-Factor Authentication</h3> */}
												{isResetPassword ? (
													<div>
														<form>
															<div className="mb-4">
															<label htmlFor="current-password" className="block text-sm font-medium">
																Current Password
															</label>
															<input
																type="password"
																id="current-password"
																placeholder="Enter your current password"
																className="w-full border border-gray-300 rounded-lg p-2"
															/>
															</div>
															<div className="mb-4">
															<label htmlFor="new-password" className="block text-sm font-medium">
																New Password
															</label>
															<input
																type="password"
																id="new-password"
																placeholder="Enter a new password"
																className="w-full border border-gray-300 rounded-lg p-2"
															/>
															</div>
															<div className="mb-4">
															<label htmlFor="confirm-password" className="block text-sm font-medium">
																Confirm New Password
															</label>
															<input
																type="password"
																id="confirm-password"
																placeholder="Confirm your new password"
																className="w-full border border-gray-300 rounded-lg p-2"
															/>
															</div>
															<button
															type="button"
															className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
															>
															Update Password
															</button>
														</form>
													</div>
												) : (
													<div>
														<button
															onClick={() => {setIsResetPassword(true), setIsPinVisible(false)}} // Add logic for disabling 2FA
															className="bg-[#230d29] text-white px-4 py-2 rounded-md hover:bg-[#206657]"
															style={{
																display: isPassVisible ? "block" : "none",
																appearance: "textfield", // Removes spinner in some browsers
															}}
														>
															Reset Password
														</button>
													</div>
												)}

												

												{isResetTransactionPin ? (
													<div>
														{/* OTP Verification */}
														{!isOtpVerified ? (
															<form onSubmit={handleOtpVerification}>
															<div className="mb-4">
																<label htmlFor="otp" className="block text-sm font-medium">
																Enter 6-Digit OTP Sent to Your Email
																</label>
																<input
																type="text"
																id="otp"
																maxLength="6"
																placeholder="Enter OTP"
																value={otp}
																onChange={(e) => setOtp(e.target.value)}
																className="w-full border border-gray-300 rounded-lg p-2"
																required
																/>
															</div>
															<button
																type="submit"
																className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
															>
																Verify OTP
															</button>
															</form>
														) : (
															// Transaction PIN Modification Form
															<form onSubmit={handlePinModification}>
															<div className="mb-4">
																<label htmlFor="new-pin" className="block text-sm font-medium">
																New Transaction PIN
																</label>
																<input
																type="password"
																id="new-pin"
																maxLength="4"
																placeholder="Enter New 4-Digit PIN"
																value={newPin}
																onChange={(e) => setNewPin(e.target.value)}
																className="w-full border border-gray-300 rounded-lg p-2"
																required
																/>
															</div>
															<div className="mb-4">
																<label htmlFor="confirm-pin" className="block text-sm font-medium">
																Confirm New PIN
																</label>
																<input
																type="password"
																id="confirm-pin"
																maxLength="4"
																placeholder="Confirm Your New 4-Digit PIN"
																value={confirmPin}
																onChange={(e) => setConfirmPin(e.target.value)}
																className="w-full border border-gray-300 rounded-lg p-2"
																required
																/>
															</div>
															<button
																type="submit"
																className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
															>
																Update PIN
															</button>
															</form>
														)}
													</div>
												) : (
													<div>
														<button
															onClick={() => {setIsResetTransactionPin(true), setIsPassVisible(false)}} // Add logic for disabling 2FA
															className="bg-[#230d29] text-white px-4 py-2 rounded-md mt-2 hover:bg-[#206657]"
															style={{
																display: isPinVisible ? "block" : "none",
																appearance: "textfield", // Removes spinner in some browsers
															}}
														>
															Reset Transaction Pin
														</button>
													</div>
												)}

											</div>
											
											</div>
										)}

										</div>
									</div>

									{/* Close Button */}
									<button
										onClick={() => {setIsModalOpen(false);}}
										type="button"
										className="text-white bg-[#206657] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2 mt-4"
									>
										Close
									</button>
									</div>
								</div>
								)}

								{!isTransactionPin &&(
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
												Transaction PIN
											</span>{' '}
										</motion.div>
											
												<form onSubmit={handlePinModification}>
												<div className="mb-4">
													<label htmlFor="new-pin" className="block text-sm font-medium py-2">
													New Transaction PIN
													</label>
													<input
													type="password"
													id="new-pin"
													maxLength="4"
													placeholder="Enter New 4-Digit PIN"
													value={newPin}
													onChange={(e) => setNewPin(e.target.value)}
													className="w-full border border-gray-300 rounded-lg p-2"
													required
													/>
												</div>
												<div className="mb-4">
													<label htmlFor="confirm-pin" className="block text-sm font-medium">
													Confirm New PIN
													</label>
													<input
													type="password"
													id="confirm-pin"
													maxLength="4"
													placeholder="Confirm Your New 4-Digit PIN"
													value={confirmPin}
													onChange={(e) => setConfirmPin(e.target.value)}
													className="w-full border border-gray-300 rounded-lg p-2"
													required
													/>
												</div>
												<button
													type="submit"
													className="text-white bg-[#206657] hover:bg-[#230d29] rounded-lg px-4 py-2"
												>
													Set PIN
												</button>
												</form>
											
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
													<label className='cable-icon-start border border-gray-200 rounded-lg w-[120px] shadow-md'>
														<input type="radio" name="icon" value="DSTV" checked={selectedIcon === "DSTV"} 
														onChange={handleIconChange}
														/>
														<div className="icon">
															<img src={dstv} alt="DSTV"/>
														</div>
													</label>
													
													<label className='border border-gray-200 rounded-lg w-[120px] shadow-md'>
														<input type="radio" name="icon" value="GoTV" checked={selectedIcon === "GoTV"}
                    										onChange={handleIconChange}
															/>
														<div className="icon">
															<img src={gotv} alt="GoTV"/>
														</div>
													</label>
												</div>
												
												 {/* Modern Dropdown */}
												 {isVisible && (
													<Listbox value={selectedPlan} onChange={setSelectedPlan}>
														{/* Button */}
														<Listbox.Button
															ref={refs.setReference}
															className="block w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
														>
															{selectedPlan?.name || "Choose Package..."}
															<ChevronsUpDown className="h-5 w-5 text-gray-400" />
														</Listbox.Button>

														{/* Dropdown (Popper) */}
														<Listbox.Options
															ref={refs.setFloating}
															style={floatingStyles}
															className="w-[94%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[200px] overflow-auto text-[14px]"
														>
															{servicePlans.map((plan) => (
																<Listbox.Option
																	key={plan.variation_code}
																	value={plan}
																	className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
																>
																	
																	{plan.name} - ₦{plan.variation_amount}
																	{selectedPlan?.variation_code === plan.variation_code && <Check className="h-5 w-5 text-green-500" />}
																</Listbox.Option>
															))}
														</Listbox.Options>
													</Listbox>
												)}

												<div 
													className="flex flex-row"
													style={{ display: isVisible ? "flex" : "none" }}
												>
														
												<input
													ref={codeRef}
													type="text"
													placeholder="Smart Card/IUC Number"
													value={billerCode}
													onChange={(e) => {
													const value = e.target.value;
													// Allow only digits
													if (/^\d*$/.test(value)) {
														setBillerCode(value);
													}
													}}
													style={{ display: isVisible ? "block" : "none" }}
													className="block py-2.5 px-3 w-full text-sm text-gray-500 bg-transparent mb-2 mt-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<button 
													onClick={()=>{verifyService(); setServiceID(selectedIcon);}}
													disabled={isDisabled}
													style={validateButtonStyle}
													type='button'
												>
													 {isValidateLoading ? "Validating..." : "Validate"}
													 {/* Validate */}
													
												</button>
												</div>
												{isVisible && customerName  && (
													<div className='bg-[#230d29] p-2 px-3 rounded-md border border-[#fff] shadow-xl text-[#ccc] mb-2'>
                                                        <p className="flex flex-row "><img className='mr-2 h-6 mt-0.5 bg-white p-1 rounded-full border border-[#3886df]' src={user1} alt='' />{customerName}</p>
														<p className="flex flex-row mt-2"><img className='mr-2 h-6 mt-0.5 bg-white p-1 rounded-full border border-[#3886df]' src={pack} alt='' />{currentPackage}</p>
													</div>
												)}						

												 {/* Floating Tooltip (Customer Name) */}
												 {/* {isVisible && !isValidated &&(
													<div
														ref={refs.setFloating} // Set floating for tooltip as well
														style={{ ...floatingStyles, top: floatingStyles.top - 8 }} // Adjust top position
														className="absolute bg-gray-800 text-white text-sm p-2 rounded-md shadow-lg"
													>
													    {customerName}
														<div
															ref={arrowRef}
															className="w-3 h-3 bg-gray-800 rotate-45 absolute"
															style={{
																left: (middlewareData.arrow?.x ?? 0) - 30, // Offset arrow slightly from the right
																top: middlewareData.arrow?.y ?? '',
															}}
														/>
													</div>
												)} */}
												
												<h3 className="mb-2">Save Smartcard/IUC</h3>
												
												<label className="toggle mb-4">
													<input type="checkbox" />
													<span className="slider"></span>
													<span
														className="labels"
														
													></span>
												</label>
											</div>

											<button
												onClick={buyCable}
												type="button"
												disabled={isValidateDisabled}
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
												
												{/* <h2>Select Provider</h2> */}
												<div className="icon-container">
													
													
													<label className='border border-gray-200 rounded-lg w-[120px] shadow-md'>
														<input type="radio" name="icon" value="Bet9ja" checked={selectedIcon === "Bet9ja"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={bet9ja} alt="Bet9ja"/>
															
														</div>
													</label>
													<label className='border border-gray-200 rounded-lg w-[120px] shadow-md'>
														<input type="radio" name="icon" value="SportyBet" checked={selectedIcon === "SportyBet"}
                    										onChange={handleIconChange}/>
														<div className="icon flex items-center justify-center">
															<img src={sporty}  alt="Sporty"/>
															
														</div>
													</label>
													<label className='border border-gray-200 rounded-lg w-[120px] shadow-md'>
														<input type="radio" name="icon" value="1xBet" checked={selectedIcon === "1xBet"}
                   											 onChange={handleIconChange}/>
														<div className="icon">
															<img src={xbet} alt="1xBet"/>
															
														</div>
													</label>
													{/* <label className='border border-gray-200 rounded-lg w-[100px] shadow-md'>
														<input type="radio" name="icon" value="Betway" checked={selectedIcon === "Betway"}
                    										onChange={handleIconChange}/>
														<div className="icon">
															<img src={betway} alt="Betway"/>
														</div>
													</label> */}
												</div>
												
												<div 
													className="flex flex-row"
													style={{ display: isVisible ? "flex" : "none" }}
												>
														
												<input
													ref={codeRef}
													type="text"
													placeholder="Customer ID"
													value={customerCode}
													onChange={(e) => {
													const value = e.target.value;
													// Allow only digits
													if (/^\d*$/.test(value)) {
														setCustomerCode(value);
													}
													}}
													// style={{ display: isVisible ? "block" : "none" }}
													className="block py-2.5 px-3 w-full text-sm text-gray-500 bg-transparent mb-2 mt-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<button 
													onClick={()=>{verifyBet(); setBetID(selectedIcon);}}
													style={betButtonStyle}
													type='button'
												>
													 {isValidateLoading ? "Validating..." : "Validate"}
													 {/* Validate */}
													
												</button>
												</div>
												{isVisible && customerName  && (
													<div className='bg-[#230d29] p-2 px-3 rounded-md border border-[#fff] shadow-lg text-[#ccc] mb-2'>
                                                        <p className="flex flex-row "><img className='mr-2 h-6 mt-0.5 bg-white p-1 rounded-full border border-[#3886df]' src={user1} alt='' />{customerName}</p>
													</div>
												)}		
												
												
												<input
													type="text"
													placeholder="Amount"
													ref={amountRef}
													style={{
														display: isVisible ? "block" : "none",
														appearance: "textfield", // Removes spinner in some browsers
													}}
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
												onClick={buyBetting}
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

								{isEd && (
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
												Educational
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											{/* <div className="flex flex-row mb-4">

											<button
												onClick={() => setEdCategory('JAMB')}
												className="text-gray-200 w-[47.5%] mr-1 py-8 bg-gray-800 hover:bg-[#2c9e48] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-200 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
												>
												JAMB
											</button>
											<button
												onClick={() => setEdCategory('WAEC')}
												className="text-gray-200 w-[47.5%] mr-1 py-8 bg-gray-800 hover:bg-[#b5b833] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-200 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												WAEC
											</button>
											<button
												onClick={() => setEdCategory('NECO')}
												className="text-gray-200 w-[47.5%] mr-1 py-8 bg-gray-800 hover:bg-[#2c9e48] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-200 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												NECO
											</button>
											<button
												onClick={() => setEdCategory('NABTEB')}
												className="text-gray-200 w-[47.5%] py-8 bg-gray-800 hover:bg-[#185728] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-200 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												NABTEB
											</button>
												
											</div> */}
											<div className="icon-container mb-3">
									
													<label className='mr-1 border border-gray-200 rounded-lg w-[150px] shadow-md'>
														<input type="radio" name="icon"
                    										onClick={() => setEdCategory('JAMB')}
														/>
														<div className="icon">
															<img src={jamb} alt="jamb"/>
															JAMB
															
														</div>
													</label>

													<label className='border border-gray-200 rounded-lg w-[150px] shadow-md'>
														<input type="radio" name="icon" 
                    										onClick={() => setEdCategory('WAEC')}
														/>
														<div className="icon1">
															<img src={waec} className='w-[120px]' alt="waec"/>
															WAEC
														</div>
													</label>
										
													
												</div>
												<div className='icon-container mb-6'>
												<label className='mr-1 border border-gray-200 rounded-lg w-[150px] shadow-md'>
														<input type="radio" name="icon" 
                    										onClick={() => setEdCategory('NECO')}
														/>
														<div className="icon">
															<img src={neco} alt="neco"/>
															NECO
														</div>
													</label>

													<label className='border border-gray-200 rounded-lg w-[150px] shadow-md'>
														<input type="radio" name="icon"
                    										onClick={() => setEdCategory('NABTEB')}
														/>
														<div className="icon">
															<img src={nabteb} alt="nabteb"/>
															NABTEB
														</div>
													</label>
												</div>
											
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Close
											</button>
										</div>
									</div>
								)}


								{isJAMB && (
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
										<div className="border border-gray-500 rounded-lg p-2 mb-1 w-[100px] shadow-md flex justify-center items-center">
										<img
											src={jamb}
											alt=""
											className="h-[60px]"
										/>
										</div>

									</motion.div>
									<div className="pt-4">
									<div className="flex flex-col">
									
											<div 
													className="flex flex-row"
													// style={{ display: isVisible ? "flex" : "none" }}
												>
													
												<input
													ref={codeRef}
													type="text"
													placeholder="Profile ID"
													value={billerCode}
													onChange={(e) => {
													const value = e.target.value;
													// Allow only digits
													if (/^\d*$/.test(value)) {
														setBillerCode(value);
													}
													}}
													className="block py-2.5 px-3 w-full text-sm text-gray-500 bg-transparent mb-2 mt-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
												/>
												<button 
													onClick={()=>{setServiceID('jamb')}}
													disabled={isDisabled}
													style={validateButtonStyle}
													type='button'
												>
													 {isValidateLoading ? "Validating..." : "Validate"}
													 {/* Validate */}
													
												</button>
												</div>
												{ customerName  && (
													<div className='bg-[#230d29] p-2 px-3 rounded-md border border-[#fff] shadow-xl text-[#ccc] mb-2'>
                                                        <p className="flex flex-row "><img className='mr-2 h-6 mt-0.5 bg-white p-1 rounded-full border border-[#3886df]' src={user1} alt='' />{customerName}</p>
													</div>
												)}	

												{/* Modern Dropdown */}
												{customerName && (
													<div>
													<Listbox value={selectedPlan} onChange={setSelectedPlan}>
														{/* Button */}
														<Listbox.Button
															ref={refs.setReference}
															className="block w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
														>
															{selectedPlan?.name || "Choose Package..."}
															<ChevronsUpDown className="h-5 w-5 text-gray-400" />
														</Listbox.Button>

														{/* Dropdown (Popper) */}
														<Listbox.Options
															ref={refs.setFloating}
															style={floatingStyles}
															className="w-[94%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[200px] overflow-auto text-[14px]"
														>
															{servicePlans.map((plan) => (
																<Listbox.Option
																	key={plan.variation_code}
																	value={plan}
																	className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
																>
																	
																	{plan.name} - ₦{plan.variation_amount}
																	{selectedPlan?.variation_code === plan.variation_code && <Check className="h-5 w-5 text-green-500" />}
																</Listbox.Option>
															))}
														</Listbox.Options>
													</Listbox>

													<input
													ref={phoneRef}
													type="tel"
													placeholder="Phone Number"
													value={phoneNumber}
													required
													onChange={(e) => {
													const value = e.target.value;
													// Allow only digits
													if (/^\d*$/.test(value)) {
														setPhoneNumber(value);
													}
													}}

													className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 mt-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
													</div>
																									)}
												

										<input
											type="text"
											placeholder="Amount"
											// ref={amountRef}
											value={amount} // Bind amount state
											readOnly
											style={{
												display: isVisible ? "block" : "none",
												appearance: "textfield", // Removes spinner in some browsers
											}}
											className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
										/>
										
										
										<h3 className="mb-2 mt-2">Save Beneficiary</h3>

										<label className="toggle mb-4">
										<input type="checkbox" />
										<span className="slider"></span>
										<span className="labels"></span>
										</label>
									</div>

									<button
									    onClick={() => {buyEd()}}
										type="button"
										disabled={isDisabled}
										style={buttonStyle}
										className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
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


								{isSmile && (
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
												Smile
											</span>{' '}
										</motion.div>
										<div className="pt-4">
											<div className="flex flex-row mb-4">

											<button
												onClick={() => {
													setNetwork(5);
													buyAirtime();
												}}
												className="text-gray-200 w-[47.5%] mr-[5%] py-8 bg-gray-800 hover:bg-[#809e2c] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-200 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
												>
												Smile Voice
											</button>
											<button
												onClick={() => {{buyData(), setNetwork(5)}}}
												className="text-gray-200 w-[47.5%] py-8 bg-gray-800 hover:bg-[#809e2c] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-200 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Smile Data
											</button>
												
											</div>

											
											<button
												onClick={() => setIsModalOpen(false)}
												type="button"
												className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-white focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
											>
												Close
											</button>
										</div>
									</div>
								)}

								{isSmileData && (
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
										<div className="border border-gray-500 rounded-lg p-2 mb-1 w-[100px] shadow-md flex justify-center items-center">
										<img
											src={smile}
											alt=""
											className="h-[40px]"
										/>
										</div>

									</motion.div>
									<div className="pt-4">
									<div className="flex flex-col">
										<div className="custom-select-container">
										
										<input
											ref={phoneRef}
											type="tel"
											placeholder="Smile Number"
											value={phoneNumber}
											onChange={(e) => {
												const value = e.target.value;
												// Allow only digits
												if (/^\d*$/.test(value)) {
													setPhoneNumber(value);
												}
											}}
											// style={{ display: isVisible ? "block" : "none" }}
											className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
										/>
										

										{/* Modern Dropdown */}
										{isVisible && (
										<Listbox
											value={smileSelected}
											onChange={(selectedOption) => {
												handleSmileChange(selectedOption);
												setAmount(selectedOption ? `₦${formatPrice(selectedOption.BundlePrice / 100)}` : "");
											}}
										 >
											{/* Button */}
											<Listbox.Button
												ref={refs.setReference}
												className="block w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
											>
												{smileSelected?.BundleDescription || "Select plan..."}
												<ChevronsUpDown className="h-5 w-5 text-gray-400" />
											</Listbox.Button>

											{/* Dropdown */}
											<Listbox.Options
												ref={refs.setFloating}
												style={floatingStyles}
												className="w-[94%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[160px] overflow-auto text-[14px]"
											>
												{smilePlans.map((plan) => (
													<Listbox.Option
														key={plan.BundleTypeCode}
														value={plan}
														className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
													>
														{plan.BundleDescription}
														{smileSelected?.BundleTypeCode === plan.BundleTypeCode && (
															<Check className="h-5 w-5 text-green-500" />
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Listbox>
										)}
										</div>

										<input
											type="text"
											placeholder="Amount"
											// ref={amountRef}
											value={amount} // Bind amount state
											readOnly
											style={{
												display: isVisible ? "block" : "none",
												appearance: "textfield", // Removes spinner in some browsers
											}}
											className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
										/>
										
									
										<div 
											className='border border-gray-400 rounded-lg p-2 w-[80px] items-center shadow-md'
											style={{ display: isVisible ? "block" : "none" }}
										>
											<h3 className='font-medium p-1'>Validity</h3>
											{/* Display the selected plan */}
											{amount && smileSelected.ValidityDays === 1 && (
												<div className="mb-2 ml-2">
													
													<img src={one_day} width="45" alt="01 Day Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 7 && (
													<div className="mb-2 ml-2">
													
													<img src={seven_days} width="45" alt="07 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 30 && (
												<div className="mb-2 ml-2">
													<img src={thirty_days} width="45" alt="30 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 60 && (
												<div className="mb-2 ml-2">
													<img src={sixty_days} width="45" alt="30 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 90 && (
												<div className="mb-2 ml-2">
													<img src={ninety_days} width="45" alt="30 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 365 && (
													<div className="mb-2 ml-2">
													<img src={one_year} width="45" alt="1 Year Validity" />
												</div>
											)}
										</div>
										
										<h3 className="mb-2 mt-2">Save Beneficiary</h3>

										<label className="toggle mb-4">
										<input type="checkbox" />
										<span className="slider"></span>
										<span className="labels"></span>
										</label>
									</div>

									<button
									    onClick={() => buySmile()}
										type="button"
										disabled={isDisabled}
										style={buttonStyle}
										className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
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

								{isSmileVoice && (
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
									<div className="border border-gray-500 rounded-lg p-2 mb-1 w-[100px] shadow-md flex justify-center items-center">
										<img
											src={smile_voice}
											alt=""
											className="h-[40px]"
										/>
										</div>
									</motion.div>
									<div className="pt-4">
									<div className="flex flex-col">
										<div className="custom-select-container">
										
										<input
											ref={phoneRef}
											type="tel"
											placeholder="Smile Number"
											value={phoneNumber}
											onChange={(e) => {
												const value = e.target.value;
												// Allow only digits
												if (/^\d*$/.test(value)) {
													setPhoneNumber(value);
												}
											}}
											// style={{ display: isVisible ? "block" : "none" }}
											className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
										/>
										{/* Modern Dropdown */}
										{isVisible && (
										<Listbox
											value={smileSelected}
											onChange={(selectedOption) => {
												handleSmileChange(selectedOption);
												setAmount(selectedOption ? `₦${formatPrice(selectedOption.BundlePrice / 100)}` : "");
											}}
										>
											{/* Button */}
											<Listbox.Button
												ref={refs.setReference}
												className="block w-full py-2.5 px-3 text-gray-500 bg-white border border-gray-300 rounded-md flex justify-between items-center"
											>
												{smileSelected?.BundleDescription || "Select plan..."}
												<ChevronsUpDown className="h-5 w-5 text-gray-400" />
											</Listbox.Button>

											{/* Dropdown */}
											<Listbox.Options
												ref={refs.setFloating}
												style={floatingStyles}
												className="w-[94%] bg-white border border-gray-300 rounded-md shadow-md z-50 max-h-[160px] overflow-auto text-[14px]"
											>
												{smilePlans.map((plan) => (
													<Listbox.Option
														key={plan.BundleTypeCode}
														value={plan}
														className="cursor-pointer px-3 py-2 hover:bg-gray-100 flex justify-between"
													>
														{plan.BundleDescription}
														{smileSelected?.BundleTypeCode === plan.BundleTypeCode && (
															<Check className="h-5 w-5 text-green-500" />
														)}
													</Listbox.Option>
												))}
											</Listbox.Options>
										</Listbox>
										)}
										
										</div>
										
										<input
											type="text"
											placeholder="Amount"
											// ref={amountRef}
											value={amount} // Bind amount state
											readOnly
											style={{
												display: isVisible ? "block" : "none",
												appearance: "textfield", // Removes spinner in some browsers
											}}
											className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
										/>
										
										
										<div 
											className='border border-gray-400 rounded-lg p-2 w-[80px] items-center shadow-md'
											style={{ display: isVisible ? "block" : "none" }}
										>
											<h3 className='font-medium p-1'>Validity</h3>
											{/* Display the selected plan */}
											{amount && smileSelected.ValidityDays === 1 && (
												<div className="mb-2 ml-2">
													
													<img src={one_day} width="45" alt="01 Day Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 7 && (
													<div className="mb-2 ml-2">
													
													<img src={seven_days} width="45" alt="07 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 30 && (
												<div className="mb-2 ml-2">
													<img src={thirty_days} width="45" alt="30 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 60 && (
												<div className="mb-2 ml-2">
													<img src={sixty_days} width="45" alt="30 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 90 && (
												<div className="mb-2 ml-2">
													<img src={ninety_days} width="45" alt="30 Days Validity" />
												</div>
											)}
											{amount && smileSelected.ValidityDays === 365 && (
													<div className="mb-2 ml-2">
													<img src={one_year} width="45" alt="1 Year Validity" />
												</div>
											)}
										</div>
										<h3 className="mb-2 mt-2">Save Beneficiary</h3>

										<label className="toggle mb-4">
										<input type="checkbox" />
										<span className="slider"></span>
										<span className="labels"></span>
										</label>
									</div>

									<button
										onClick={() => buySmile()}
										type="button"
										disabled={isDisabled}
										style={buttonStyle}
										className="text-white bg-gray-700 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
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
												
												<h2>Select Biller</h2>
												<div className="icon-container mb-0">
													
													
													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Kaduna-Electric" checked={selectedIcon === "Kaduna-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={kaduna} alt="kaedco"/>
															
														</div>
													</label>

													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Jos-Electric" checked={selectedIcon === "Jos-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={jos} alt="jed"/>
															
														</div>
													</label>

											

													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Abuja-Electric" checked={selectedIcon === "Abuja-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={abuja} alt="abuja"/>
															
														</div>
													</label>

													<label className='border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Eko-Electric" checked={selectedIcon === "Eko-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={eko} alt="eko"/>
															
														</div>
													</label>
										
													
												</div>
												<div className="icon-container mb-0 mt-2">
													
													
													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Ikeja-Electric" checked={selectedIcon === "Ikeja-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={ikeja} alt="ikeja"/>
															
														</div>
													</label>

													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Benin-Electric" checked={selectedIcon === "Benin-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={bedc} alt="bedc"/>
															
														</div>
													</label>

											

													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Aba-Electric" checked={selectedIcon === "Aba-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={aba} alt="aba"/>
															
														</div>
													</label>
										
													<label className='border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="PH-Electric" checked={selectedIcon === "PH-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={phed} alt="phed"/>
															
														</div>
													</label>
													
												</div>
												<div className="icon-container mt-2">
													
													
													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Kano-Electric" checked={selectedIcon === "Kano-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon ">
															<img src={kano}  alt="kano"/>								
														</div>
													</label>

													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Ibadan-Electric" checked={selectedIcon === "Ibadan-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={ibadan} alt="ibadan"/>
															
														</div>
													</label>

											
													<label className='mr-1 border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Yola-Electric" checked={selectedIcon === "Yola-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={yola} alt="yola"/>
															
														</div>
													</label>

													<label className='border border-gray-200 rounded-lg w-[80px] shadow-md'>
														<input type="radio" name="icon" value="Enugu-Electric" checked={selectedIcon === "Enugu-Electric"}
                    										onChange={handleElectricChange}/>
														<div className="icon">
															<img src={enugu} alt="enugu"/>
															
														</div>
													</label>
										
													
												</div>
												

											</div>
											{/* <button
												onClick={buyCable}
												type="button"
												disabled={isValidateDisabled}
												style={buttonStyle}
												// className="text-white bg-[#582066] hover:bg-[#230d29] focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
											>
												Continue
											</button> */}

											{/* <button
												onClick={buyElectric}
												type="button"
												disabled={isValidateDisabled}
												style={buttonStyle}
											>
												Continue
											</button> */}
											<div className='border border-gray-100 w-full mb-3'/>
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

								{isElectric && (
									<div>
										<div className="flex flex-col ">
											<img className='mb-4 ml-6' src={electricImage} width="105px" alt=''/>
											{/* <p className='text-bold mb-4 ml-5'>{selectedIcon}</p> */}
												<div 
													className="mb-2 flex "
												>
													{/* Prepaid Button */}
													<button
														className={`text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-[14%]  py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 lg:mx-[4%] ${
														activeButton === "prepaid" ? "bg-gray-100 dark:bg-gray-600 border-gray-400" : ""
														}`}
														onClick={() => {setActiveButton("prepaid"); setSelectedElectricPlan('prepaid')}}
													>
														{activeButton === "prepaid" && <IoCheckbox className="inline mr-1 text-green-500" size={17} />}
														Prepaid
														
													</button>

													{/* Postpaid Button */}
													<button
														className={`text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-[14%] py-2.5 ml-2 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 ${
														activeButton === "postpaid" ? "bg-gray-100 dark:bg-gray-600 border-gray-400" : ""
														}`}
														onClick={() => {setActiveButton("postpaid"); setSelectedElectricPlan('postpaid')}}
													>
														Postpaid
														{activeButton === "postpaid" && <IoCheckbox className="inline ml-2 text-green-500" size={16} />}
													</button>
													</div>

													<div 
														className="flex flex-row"
													>
																
														<input
															ref={codeRef}
															type="text"
															placeholder="Meter Number"
															value={billerCode}
															onChange={(e) => {
															const value = e.target.value;
															// Allow only digits
															if (/^\d*$/.test(value)) {
																setBillerCode(value);
															}
															}}
															className="block py-2.5 px-3 w-full text-sm text-gray-500 bg-transparent mb-2 mt-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
														/>
														<button 
															onClick={()=>{verifyService(); setServiceID(selectedIcon); setPhoneError("");}}
															disabled={isDisabled}
															style={validateButtonStyle}
															type='button'
														>
															{isValidateLoading ? "Validating..." : "Validate"}
															{/* Validate */}
															
														</button>
													</div>

													{customerName  && (
														<div>
													<div className='bg-[#230d29] p-2 px-3 rounded-md border border-[#fff] shadow-l text-[#ccc] mb-2'>
                                                        <p className="flex flex-row "><img className='mr-2 h-6 mt-0.5 bg-white p-1 rounded-full border border-[#3886df]' src={user1} alt='' />{customerName}</p>
													 </div>
													 <input
														ref={phoneRef}
														type="tel"
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
														className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
													<div>
														{phoneError && (
														<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 rounded-md">
															<p>{phoneError}</p>
														</motion.div>
														)}
														{/* <button 
														onClick={()=>{setAmount(1000)}}
															type="button"
															className="mr-2 mb-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
														>
															1,000
														</button> */}
														<button 
															onClick={()=>{setAmount(2000)}}
															type="button"
															className="mr-2 mb-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
														>
															2,000
														</button>
														<button 
															onClick={()=>{setAmount(5000)}}
															type="button"
															className="mr-2 mb-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
														>
															5,000
														</button>
														<button 
															onClick={()=>{setAmount(10000)}}
															type="button"
															className="mr-2 mb-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
														>
															10,000
														</button>
														<button 
															onClick={()=>{setAmount(15000)}}
															type="button"
															className="mr-2 mb-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
														>
															15,000
														</button>
														<button 
															onClick={()=>{setAmount(20000)}}
															type="button"
															className="mr-2 mb-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
														>
															20,000
														</button>
													<input
														type="text"
														placeholder="Amount"
														ref={amountRef}
														value={amount ? formatPrice(amount) : ''}
														onChange={(e) => {
															const rawValue = e.target.value.replace(/[^0-9]/g, ''); // Ensure only numbers are entered
															setAmount(rawValue);
															setAmountError("");
														}}
														style={{
															// display: isVisible ? "block" : "none",
															appearance: "textfield", // Removes spinner in some browsers
														}}
														className="block py-2.5 px-2 w-full text-sm text-gray-500 bg-transparent mb-2 rounded-sm border  border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
													/>
													{amountError && (
														<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 rounded-md">
															<p>{amountError}</p>
														</motion.div>
														)}

												</div>
												</div>
												)}
												<h3 className="mb-2">Save Beneficiary</h3>

												<label className="toggle mb-4">
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
												onClick={handleContinue}
												type="button"
												disabled={isValidateDisabled} // Ensure phone number is filled
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
								)}
{isAddressBook && (
  <div className="pb-4">
    <h3 className="mb-3 ml-2 text-md font-regular text-gray-700 dark:text-gray-200">
      Select Beneficiary
    </h3>

    <div {...swipeHandlers}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-2 transition-transform duration-300 ease-in-out">
        {paginatedAddresses.map((address, index) => (
          <button
            key={index}
            value={address.phone_num}
            onClick={(e) => {
              setIsAddressBook(false);
              setPhoneNumber(address.phone_num);
              category === 'isData' ? buy_data() : buy_airtime();
            }}
            className="w-full bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <span className="block font-medium">{address.phone_num}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Page Dots */}
	<div className="flex justify-center mt-4 space-x-2">
  {[...Array(totalAddPages)].map((_, i) => (
    <button
      key={i}
      onClick={() => setCurrentAddPage(i + 1)}
      className={`h-2 w-2 rounded-full transition-colors duration-200 ${
        currentAddPage === i + 1
          ? 'bg-green-500 scale-110'
          : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
      }`}
      aria-label={`Go to page ${i + 1}`}
      style={{ cursor: 'pointer' }}
    />
  ))}
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

export default Actions;
