import { DealContext } from '../../DealContext';
import { useEffect, useState, useRef, useContext, useDebounce } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card"
import {  Wifi, Phone } from "lucide-react";
import glo from '../../assets/glo-logo.svg';
import etisalat from '../../assets/9mobile-logo.svg';
import mtn from '../../assets/mtn-logo.svg';
import airtel from '../../assets/airtel-logo.svg';
import wait from '../../assets/loading.gif';
import { FaAddressBook } from "react-icons/fa";
import { useSwipeable } from 'react-swipeable';
import Swal from 'sweetalert2';
import { Listbox, Transition  } from "@headlessui/react";
import { useFloating, autoUpdate, offset, flip, arrow, shift } from "@floating-ui/react-dom";
import { ChevronsUpDown, ChevronDown, Check } from "lucide-react";


export const QuickActions = ({ user, isModalOpen, setIsModalOpen }) => {
    const { loggedUser, setLoggedUser, updateBalance, settings, isSettings, isMenuOpen, setIsMenuOpen, setIsSettings } = useContext(DealContext);
    const [isTransactionPin, setIsTransactionPin] = useState(true);
    // const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false); // State to track loading
	const [phoneNumber, setPhoneNumber] = useState('');
	const [selectedPlanId, setSelectedPlanId] = useState('');
        const [isSmile, setIsSmile] = useState(false);
        const [dataPlans, setDataPlans] = useState([]);
	const [amount, setAmount] = useState('');
    const [isAddressBook, setIsAddressBook] = useState(false);
    const [addressBook, setAddressBook] = useState([]);
    const [isAirtime, setIsAirtime] = useState(false);
    const [isData, setIsData] = useState(false);
    const [networkSelected, setNetworkSelected] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [phoneError, setPhoneError] = useState("");
    const [amountError, setAmountError] = useState("");
    const phoneRef = useRef(null);
    const arrowRef = useRef(null);
    const selectRef = useRef(null); // Reference for the select input
    const amountRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false); // Input visibility
    const [servicePlans, setServicePlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(servicePlans[0] || { name: "Choose Package..." });
    const [network, setNetwork] = useState('');
    const [category, setCategory] = useState('');
    const [currentAddPage, setCurrentAddPage] = useState(1);
    const itemsPerPage = 10;
    const [provider, setProvider] = useState('');
    


    const { refs, floatingStyles, middlewareData } = useFloating({
            placement: "bottom", // Placement for dropdown (adjust dynamically for tooltip)
            middleware: [offset(9), flip(), shift(), arrow({ element: arrowRef })],
            whileElementsMounted: autoUpdate,
        });

    const actions = [
    {
      icon: Phone,
      label: "Airtime",
      subtitle: "Purchase airtime",
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      link: "airtime"
    },
    {
      icon: Wifi,
      label: "Data",
      subtitle: "Purchase data bundles",
      color: "bg-gradient-to-r from-orange-500 to-red-600",
      link: "data"
    }
  ];

  	const getBaseUrl = () => {
		return `${import.meta.env.VITE_API_BASE_URL}/api`;
	 };

  	const getAddressBook = () => {
        // setIsModalOpen(true);
		
		setIsAddressBook(true);
		setIsData(false);
		setIsAirtime(false);
    };

    const handleActionClick = (link) => {
      switch (link) {
    case "airtime":
      buy_airtime();
      break;
    case "data":
      buy_data();
      break;
    default:
      console.warn("No handler for category:", link);
      break;
  }
  };

  	const buttonStyle = {
		color: "white",
		backgroundColor: isDisabled 
				? "#CCCCCC" 
				: "#230d29",
		"&:hover": {
			backgroundColor:  isDisabled 
					? "#CCCCCC" 
					: "#230d29",
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


  	let trans_pin = loggedUser.transaction_pin;
  	if(user.user == ''){
		user = loggedUser.user
	}
	user=user? user.user : loggedUser.user;

    // console.log(loggedUser);

	  const resetModalStates = () => {
		setIsAirtime(false);
		setIsData(false);
		setIsSmile(false);
		setSelectedIcon(null);
		setSelectedPlanId(null); 
		setIsVisible(false);
		setIsDisabled(true);
		setIsSettings(false);
		setIsMenuOpen(false);


		setAmount('');
		setPhoneNumber('');
		setServicePlans('Choose Package...');
		setSelectedPlan(null);



		setIsAddressBook(false);
		setCurrentAddPage(1);
	  };
        
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
  
      
      }, [phoneNumber, selectedPlanId, amount]); // Dependency array: triggers when phoneNumber or selectedPlanId changes
  
  
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
                setAddressBook(data.addressBook);
                // console.log(addressBook);
            }catch(error){
                // console.log(error)
            }finally{
                setIsLoading(false);
                  // setIsAddressBook(false);
            }
        }
    }
    getAddressBook();
  }, [isAddressBook])

  	// Handle plan selection
	const handlePlanSelectChange = (plan) => {
		//console.log(plan.variation_amount);
		// console.log(provider);
		setSelectedPlan(plan);
		if (plan.variation_amount || plan.price) {
			setAmount(plan.variation_amount || plan.price); // Update amount based on selected plan
		}
	};


const totalAddPages = Math.ceil(addressBook.length / itemsPerPage);
const paginatedAddresses = addressBook.slice(
	(currentAddPage - 1) * itemsPerPage,
	currentAddPage * itemsPerPage
);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => setCurrentAddPage((prev) => Math.min(prev + 1, totalAddPages)),
        onSwipedRight: () => setCurrentAddPage((prev) => Math.max(prev - 1, 1)),
        preventScrollOnSwipe: true,
        trackMouse: true // enables mouse swipes on desktop too
      });

        const handleIconChange = async (event) => {
        const selectedValue = event.target.value;
		setSelectedPlanId('');
		setSelectedPlan(null);
		setIsDisabled(true);
        setSelectedIcon(selectedValue);
		setIsVisible(true);
		setAmount('');
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

      const buy = async (id, phone, category, amount) => {
        let bundleAmount = amount.replace(/[^\d.]/g, ""); // Removes all non-numeric characters
        var response;
        let old_balance = 0;
        let new_balance = 0;
        const isAdmin = loggedUser?.user?.role === '1'; // assumes `role` is on user object
        
        try {
            setIsLoading(true); // Set loading to true when the process starts
    
            // 1️⃣ Get Wallet Balance
            if (!isAdmin) {
                // 🔒 Normal users require balance checks
                const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ wallet_id: user.id }),
                });
                const walletData = await walletResponse.json();
                old_balance = parseFloat(walletData?.available_balance || 0);

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

                new_balance = old_balance - bundleAmount;
                console.log(new_balance);
            } else {
                // 🛡️ Admin bypass: simulate 0 deduction
                old_balance = 0;
                new_balance = 0;
                console.log(new_balance);
            }
  
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
    
    // Function to format the price as currency
      const formatPrice = price => {
          return new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0
          }).format(price);
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

    if (network !== 5) {
        // Process normal airtime purchase
        buy(id, phone, category, amount);
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
      </div>
      
      <Card className="p-4 border-0 shadow-lg bg-white/70 backdrop-blur-sm animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={action.label}
              onClick={() => handleActionClick(action.link)}
              variant="ghost"
              className={`${action.color} text-white hover:scale-105 transition-all duration-300 h-20 flex-col gap-1 shadow-lg hover:shadow-xl animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <action.icon className="h-6 w-5" />
              <span className="text-sm font-medium">{action.label}</span>
              <p className="text-xs -mt-2 group-hover:text-slate-700 transition-colors">{action.subtitle}</p>
            </Button>
          ))}
        </div>
      </Card>


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
