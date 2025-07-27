import { DealContext } from '../../DealContext';
import { motion } from 'framer-motion';
// import { RiCheckboxCircleFill } from 'react-icons/ri';
import React,{ useEffect, useState, useContext, useRef } from 'react';
import { ChevronDown } from "lucide-react";
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

import './transactions.css';

const MTrans = ({ user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { updateBalance, viewMore, setViewMore } = useContext(DealContext);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasInitialized = useRef(false);
  // Safely accessing user
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
			const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=4`, {
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

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    if (user?.id) {
      getTransactions();
    }
  }, [currentPage, updateBalance, user?.id]);
  

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

  return (
    <div className="super__feature overflow-hidden">
      <div className="ml-5">
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
      </div>
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
          <table className="styled-table text-[13px] lg:text-[14px] -z-40">
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
                  <td width="5%">
                    {serviceIcons[transaction.service.toLowerCase()] || (
                      <RiCheckboxCircleFill size={16} className="transaction__icon-success" />
                    )}
                  </td>
                    <td width="35%">
                      <div className="table-col pl-5">
                        <span className="text-bold">{transaction.service}
                        {transaction.service.toLowerCase() !== "Reward Point Credited" && " Purchase"}</span>
                        <TimestampFormatter timestamp={transaction.created_at} />
                      </div>
                    </td>
                    <td>
                      <div className="rounded-full bg-[#0d2b36]  text-green-400 w-16 flex items-center justify-center py-1 ml-[35%]">
                      <span className="text-[12px]">₦</span>
                        <span className="text-bold ">{transaction.amount}</span>
                        {/* <span className="text-[12px]">NGN</span> */}
                      </div>
                    </td>
                    <td className="hidden sm:flex">{transaction.transaction_id}</td>
                    {/* <td>
                      <div className="table-col">
                        <span className="text-bold">Completed</span>
                        <TimestampFormatter timestamp={transaction.created_at} />
                      </div>
                    </td> */}
                    <td className="p-3">
                   
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
                           <p><strong>Recipient:</strong> {transaction.phone_num}</p>
                           <p><strong>Service:</strong> {transaction.service}</p>
                           <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
                           <p><strong>Amount:</strong> ₦{formatPrice(transaction.amount)}</p>
                           <p><strong>Date|Time:</strong> <TimestampFormatter timestamp={transaction.created_at} /></p>
                                                     
                         </div>
                       )}
                     </div>
                   </td>
                 </tr>
                 </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    <span className="w-full p-5">No Transactions</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div>
            <button
              onClick={()=>setViewMore(true)}
              className="w-full text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 px-8 py-4 my-2 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 hover:text-white focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
							type="button"
            >
              Load More
            </button>
          </div>
          {/* {totalPages > 1 && (
            <div className="pagination mb-3">
              {Array.from({ length: totalPages }).map((_, index) => (
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
};

export default MTrans;
