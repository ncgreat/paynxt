import React,{ useEffect, useState, useContext, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ArrowLeft, Plus, Gift, Search } from "lucide-react";
import { useHistory } from "react-router-dom";
import wait from '../../assets/loading.gif';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Base styling
import { DealContext } from '../../DealContext';
import { useLocation } from 'react-router-dom';
import { Receipt, ShoppingCart, ShoppingBag, CreditCard,  Zap,   Smartphone, Tv, BookOpen, Phone } from "lucide-react";
import { motion } from 'framer-motion';
import { Badge } from "../../components/ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const GiftCards = () => {
  const { loggedUser, setLoggedUser, updateBalance, settings, isSettings, isMenuOpen, setIsMenuOpen, setIsSettings } = useContext(DealContext);
  const navigate = useHistory();
  const [giftCardBrands, setGiftCardBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const [selectedGiftCard, setSelectedGiftCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadlyID, setReloadlyID] = useState('');
  const [selectedAmount, setSelectedAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [userTransactions, setUserTransactions] = useState([]);
  const [viewHistory, setViewHistory] = useState(false);
  const hasInitialized = useRef(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);

  const [expandedOrder, setExpandedOrder] = useState(null);
  const [viewPages, setViewPages] = useState(1);
  const [currentViewPage, setCurrentViewPage] = useState(1);

  const toggleTransDetails = (transId) => {
    // setIsModalOpen(true);

    userTransactions.map((trans) => {
          console.log(trans);
      if (trans.id === transId) {
        setShowDetails(!showDetails);
        setExpandedOrder(expandedOrder === transId ? null : transId);
        // console.log(trans);
        setSelectedTransactions([...selectedTransactions, trans]);
      }
    })
  };


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
    
      if (encodedUser) {
  
        try {
        const user = JSON.parse(atob(encodedUser));
        setLoggedUser(user.logged);
        } catch (err) {
        console.log("Error decoding user cookie:", err);
        }
      }
  }, []);

  let user = loggedUser.user;
  // console.log(user);
 

  let old_balance = 0;
  let new_balance = 0;
  const isAdmin = loggedUser?.user?.role === '1'; // assumes `role` is on user object


  const allowedBrands = [
    "Google Play",
    "Amazon",
    "Airbnb",
    "Adidas",
    "Airalo",
    "Binance",
    "Best Buy",
    "Crypto Giftcard",
    "Applebee",
    "App Store & iTunes",
    "AutoZone",
    "BestCare",
    "Barnes & Noble",
    "American Express",
    "Abercrombie & Fitch",
    "Asda",
    "ASOS",
    "Athleta",
    "BucketlistGift",
    "Catch Gift Card",
    "Crate & Barrel",
    "Delta",
    "EA",
    "Ebay",
    "Etsy",
    "H&M",
    "Jawaker",
    "Lowes",
    "Mastercard",
    "Netflix",
    "Nike",
    "Nintendo",
    "Playstation",
    "Sephora",
    "Spotify",
    "Steam",
    "Tinder",
    "Uber",
    "Twitch",
    "Visa",
    "Walmart",
    "Xbox"
  ];

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const response = await fetch(`${getBaseUrl()}/gift-cards`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        // console.log(data);
        const filtered = data.content
          .filter(item => allowedBrands.includes(item.brand?.brandName))
          .map(item => ({
            name: item.productName,
            giftId: item.productId,
            brand: item.brand.brandName,
            country: item.country.name,
            flagUrl: item.country.flagUrl,
            image: item.logoUrls?.[0],
            color: "from-sky-500 to-indigo-600",
            reloadlyID: item.productId,
          }));
        setGiftCardBrands(filtered);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching gift cards:", error);
      }
    };

    fetchGiftCards();
  }, []);

  useEffect(()=>{
    if(!showModal){
      setIsProcessing(false);
      setRecipientEmail('');
      setSelectedAmount('');
    }

  },[showModal]);

  const buyGift = async(id) => {
    console.log(id);
    if(selectedAmount){
      const fx = await getFxRate(id);
        if(fx){
            // console.log(fx);
        }
    }
 

          try {
        const response = await fetch(`${getBaseUrl()}/giftcard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: id }),
        });
        const data = await response.json();
        console.log(data);
        setSelectedGiftCard(data);
        setLoading(false);
        setShowModal(true);
      } catch (error) {
        console.log("Error fetching gift cards:", error);
      }
  }

  const getFxRate = async(id, amount) =>{
    // console.log(amount);
     try {
        const response = await fetch(`${getBaseUrl()}/fx-rate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: id, amount }),
        });
        const data = await response.json();
        return data;
        //console.log(data);
        // setSelectedGiftCard(data);
        // setLoading(false);
        // setShowModal(true);
      } catch (error) {
        console.log("Error fetching gift cards:", error);
      }
  }


const buyGiftCard = async () => {
  if (!selectedAmount || !recipientEmail) {
    alert("Please fill in amount and email.");
    return;
  }
  // console.log(selectedAmount);
  console.log(selectedAmount);
  let amount = 0;
  if(selectedAmount){
    amount = await getFxRate(reloadlyID, selectedAmount);
  }
 
  // console.log(amount.totalPayable);
  const confirm = await Swal.fire({
    title: 'Confirm Purchase',
    html: `You are about to pay <strong>NGN ${amount.totalPayable}</strong> for this gift card.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, proceed',
    cancelButtonText: 'No, cancel',
    customClass: { container: 'borderless' },
  });

  if (!confirm.isConfirmed) {
    return; // Stop if user cancels
  }
  setIsProcessing(true);
      try {
        if (!isAdmin) {
          // 🔒 Normal users require balance checks
          const walletResponse = await fetch(`${getBaseUrl()}/get_balance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet_id: user.id }),
          });
          const walletData = await walletResponse.json();
          old_balance = parseFloat(walletData?.available_balance || 0);

          if (old_balance < amount.totalPayable) {
            Swal.fire({
              title: 'Insufficient Balance',
              text: `You need at least NGN ${amount.totalPayable} to proceed.`,
              icon: 'error',
              customClass: { container: 'borderless' },
            });
            setIsDisabled(false);
            // setIsModalOpen(false);
            return;
          }

          new_balance = old_balance - amount.totalPayable;
          console.log(new_balance);
        } else {
          // 🛡️ Admin bypass: simulate 0 deduction
          old_balance = 0;
          new_balance = 0;
          console.log(new_balance);
        }

          // Deduct balance & Log transaction as "Pending"

          const transactionResponse = await fetch(`${getBaseUrl()}/add_transaction`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  category: 'GiftCards',
                  service: selectedGiftCard.brand.brandName + " Gift Card",
                  amount: amount.totalPayable,
                  // phone_num: phoneNumber,
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

          // Proceed with the actual purchase request
      const response = await fetch(`${getBaseUrl()}/purchase-giftcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: reloadlyID,
          amount: selectedAmount,
          recipientEmail: recipientEmail
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
          title: 'Gift card',
          text: `You gift card purchase was successful.`,
          icon: 'success',
          customClass: { container: 'borderless' },
        });
        // setSelectedGiftCard(data);
        setShowModal(false);

          } else {
              // If the transaction failed, reverse the wallet deduction
              await fetch(`${getBaseUrl()}/add_transaction`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                      category: 'GiftCards',
                      service: selectedGiftCard.brand.brandName + " Gift Card",
                      amount: amount.totalPayable,
                      // phone_num: phoneNumber,
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
      console.log("Error buying gift card:", error);
    }
}

  const totalPages = Math.ceil(giftCardBrands.length / itemsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));

  const iconMap = {
    buyData: Smartphone,      // Mobile Data
    buyAirtime: Phone,  // Airtime
    Electricity: Zap,         // Electricity
    CableTV: Tv,              // TV
    Educational: BookOpen,    // Education
    Food: ShoppingCart,
  };

  const getTransactions = async () => {
    setLoading(true);
    try {
       const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentViewPage}&limit=7`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: user?.id,
        }),
      });

      const data = await response.json();
      console.log(data.transactions);
      // const res = await response.json();
      // const backendTxns = data.transactions || [];
     const backendTxns = (data.transactions || []).filter(
		  txn => txn.category?.toLowerCase() === "giftcards"
		);

        const mapped = backendTxns.map((txn) => ({
          id: txn.id,
          merchant: txn.phone_num,
          amount: `₦${Number(txn.amount).toLocaleString()}`,
          transAmount: txn.amount,
          transaction_id: txn.transaction_id,
          type: txn.service,
          time: dayjs(txn.created_at).fromNow(),
          status: txn.status.toLowerCase(), // "Successful" → "successful"
          icon:  Receipt,
          color: "text-gray-500",
          dateTime: txn.created_at
        }));



      setUserTransactions(mapped);

      // setTransactions(data.transactions || []);
      setViewPages(data.totalPages || 0);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


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
  

    	// Function to format the price as currency
    const formatPrice = price => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0
        }).format(price);
    };
  

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

  if (isLoading) {
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-[#0d2b36] bg-opacity-90 z-50">
          <div className="flex flex-col items-center">
            <img src={wait} alt="Loading..." className="h-16 w-16 mb-2 rounded-lg" />
            {/* <span className="text-white text-lg font-medium">Processing your request...</span> */}
          </div>
        </div>
      )
    }

  if(viewHistory){
    return (
      <div className="super__feature overflow-hidden mb-12">
                {/* Header */}
        <div className="flex items-center gap-4 my-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewHistory(false)}
            className="hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gift Cards</h1>
            <p className="text-sm text-slate-600">Recent Purchase History</p>
          </div>
        </div>
        {/* <div className="ml-5">
          <div className="mb-3">
            <motion.div
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1.5 }}
              variants={{
                visible: { opacity: 1, translateX: 0 },
                hidden: { opacity: 0, translateX: 200 },
              }}
              className="ml-[10px] mt-5 lg:ml-[75px]"
            >
              <h3 className="text-bold">Recent Activities</h3>
            </motion.div>
          </div>
        </div> */}
        <div className="mx-3 mb-10 lg:mx-[95px]">
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
                <tr className="text-[12px] lg:text-[14px]">
                  {/* <th className="pr-4 sm:pr-0" width="5%"> </th>
                  <th width="25%"><span className="m-5">Service</span></th>
                  <th width="20%">Amount</th>
                  <th width="35%">Status</th>
                  <th ></th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      <td><Skeleton /></td>
                      <td><Skeleton /></td>
                      <td><Skeleton /></td>
                      <td className="hidden sm:flex"><Skeleton /></td>
                      <td><Skeleton /></td>
                    </tr>
                  ))
                ) : userTransactions.length > 0 ? (
                  userTransactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                    <tr key={transaction.id}  onClick={() => toggleTransDetails(transaction.id)} className='cursor-pointer'>
                      {/* <td width="5%">
                        <RiCheckboxCircleFill size={16} className="transaction__icon-success" />
                      </td> */}
                    <td width="5%" className='ml-4'>
                      {/* <div className={`w-10 h-10 rounded-full ml-4 bg-gray-100 flex items-center justify-center`}>
                        {serviceIcons[transaction.service.toLowerCase()] || (
                            <RiCheckboxCircleFill size={16} className="transaction__icon-success" />
                          )}
                      </div> */}
                      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${transaction.color}`}>
                        <transaction.icon className="w-5 h-5" />
                      </div>
                    </td>
                      <td width="42%">
                        <div className="table-col pl-5">
                          {/* <span className="text-bold">{transaction.service}
                          {transaction.service.toLowerCase() !== "Reward Point Credited" && " Purchase"}</span> */}
                          <span className="text-bold">{transaction.merchant}</span>
                          {/* <TimestampFormatter timestamp={transaction.created_at} /> */}
                          <div className=''>
                            {transaction.type} • {transaction.time}
                          </div>
                          
                        </div>
                      </td>
                      <td>
                        {/* <div className="rounded-full bg-[#0d2b36]  text-green-400 w-16 flex items-center justify-center py-1 ml-[35%]">
                        <span className="text-[12px]">₦</span>
                          <span className="text-bold ">{transaction.amount}</span>
                          
                        </div> */}
                        <div className="pl-6">
                            <p className="font-semibold text-foreground">-{transaction.amount}</p>
                              <Badge
                                variant={transaction.status === "successful" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {transaction.status}
                            </Badge>
                        </div>
                      </td>
                      <td className="hidden sm:flex">{transaction.transaction_id}</td>
                      {/* <td>
                        <div className="table-col">
                          <span className="text-bold">Completed</span>
                          <TimestampFormatter timestamp={transaction.created_at} />
                        </div>
                      </td> */}
                      <td className="p-1">
                     
                    </td>
                    </tr>
                     <tr>
                     <td colSpan="5" className="p-0">
                       <div className={`transition-all duration-[1s,15s] ease-in-out overflow-hidden 
                         ${expandedOrder === transaction.id ? "max-h-[200px] opacity-100 px-4 bg-gray-50 text-gray-600" : "max-h-0 opacity-0 p-0"}`}>
                         {expandedOrder === transaction.id && (
                           <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-bold text-[#101c50]">Transaction Details</h3>
                                </div>
                             <p><strong>Recipient:</strong> {transaction.merchant}</p>
                             <p><strong>Service:</strong> {transaction.type}</p>
                             <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
                             <p><strong>Amount:</strong> ₦{formatPrice(transaction.transAmount)}</p>
                             <p><strong>Date|Time:</strong> <TimestampFormatter timestamp={transaction.dateTime} /></p>
                                                       
                           </div>
                         )}
                       </div>
                     </td>
                   </tr>
                   </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="">
                      <span className="w-full p-5 pl-10">No Transactions</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* {viewPages > 1 && (
              <div className="pagination mb-3">
                {Array.from({ length: viewPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={currentPage === index + 1}
                    className="page"
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
  
            )} */}
          </motion.div>
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate.push("/")}
            className="hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Gift Cards</h1>
            <p className="text-sm text-slate-600">Buy digital gift cards instantly</p>
          </div>
        </div>

        {/* Search */}
        <Card className="p-4 mb-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search gift cards..." 
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-500"
            />
          </div>
        </Card>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 gap-4">
          {giftCardBrands
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((brand, index) => (
              <Card 
                onClick={()=>{setLoading(true); buyGift(brand.reloadlyID); setReloadlyID(brand.reloadlyID)}}
                key={brand.reloadlyID}
                className="group relative p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer backdrop-blur-sm overflow-hidden animate-fade-in"
                style={{ 
                  backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,255,255,0.9)), url(${brand.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="relative flex flex-col items-center text-center bg-white/80 p-4 rounded-xl shadow-md backdrop-blur-sm">
                  <h3 className="font-bold text-slate-800 mb-1">{brand.name}</h3>
                  <p className="text-xs text-slate-600">{brand.country}
                    <img src={brand.flagUrl} alt="" className="inline-block h-3 ml-1" />
                  </p>
                </div>
              </Card>
            ))}
        </div>
         {loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="flex flex-col items-center">
                 <img src={wait} alt="Loading..." className="h-16 w-16 mb-2 rounded-lg" />
                        {/* <span className="text-white text-lg font-medium">Processing your request...</span> */}
               </div>
            </div>
          )}

        {showModal && selectedGiftCard && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setShowModal(false)} // backdrop click
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up"
              onClick={(e) => e.stopPropagation()} // prevent modal close on click inside
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">{selectedGiftCard.productName}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-500 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <img
                  src={selectedGiftCard.logoUrls?.[0]}
                  alt={selectedGiftCard.productName}
                  className="w-full rounded-2xl object-cover max-h-40 mb-4 border border-gray-200 shadow-md"
                />
                <p className="text-sm text-slate-600">
                  <strong>Brand:</strong> {selectedGiftCard.brand.brandName}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Country:</strong> {selectedGiftCard.country.name}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Currency:</strong> {selectedGiftCard.recipientCurrencyCode}
                </p>
              </div>

              {/* Form */}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // alert("Proceed to payment...");
                }}
              >
              {/* FIXED denomination dropdown */}
              {selectedGiftCard.denominationType === "FIXED" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Select Amount</label>
                  <select
                    required
                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                    value={selectedAmount}
                    onChange={(e) => setSelectedAmount(e.target.value)}
                  >
                    <option value="" disabled>Select amount</option>
                    {selectedGiftCard.fixedRecipientDenominations.map((amt) => (
                      <option key={amt} value={amt}>
                        {amt} {selectedGiftCard.recipientCurrencyCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* RANGE denomination input */}
              {selectedGiftCard.denominationType === "RANGE" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enter Amount</label>
                  <input
                    type="number"
                    required
                    value={selectedAmount}
                    onChange={(e) => {setSelectedAmount(e.target.value); console.log(e.target.value)}}
                    min={selectedGiftCard.minRecipientDenomination}
                    max={selectedGiftCard.maxRecipientDenomination}
                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                    placeholder={`${selectedGiftCard.minRecipientDenomination} - ${selectedGiftCard.maxRecipientDenomination} ${selectedGiftCard.recipientCurrencyCode}`}
                  />
                </div>
              )}
              {/* Email input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-md text-sm"
                  placeholder="user@example.com"
                />
              </div>

                <Button
                  type="submit"
                  onClick={()=>{buyGiftCard()}}
                  className={`w-full ${isProcessing? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600"} text-white`}
                  disabled={isProcessing}
                >
                  {isProcessing? "Processing..." 
                  : "Continue to Payment" }
                  
                </Button>
              </form>
            </div>
          </div>
        )}


        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <Button 
            disabled={currentPage === 0} 
            onClick={handlePrev}
            variant="outline"
            className="disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button 
            disabled={currentPage >= totalPages - 1} 
            onClick={handleNext}
            variant="outline"
            className="disabled:opacity-50"
          >
            Next
          </Button>
        </div>

        {/* Quick Actions */}
        <Card className="p-5 mt-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {/* <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4 mr-2" />
              Buy Custom Amount
            </Button> */}
            <Button variant="outline" className="w-full hover:bg-slate-50 transition-colors" onClick={()=>{setViewHistory(true)}}>
              <Gift className="h-4 w-4 mr-2" />
              View Purchase History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GiftCards;
