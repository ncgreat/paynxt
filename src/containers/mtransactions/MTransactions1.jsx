import { DealContext } from '../../DealContext';
import { motion } from 'framer-motion';
import { RiCheckboxCircleFill } from 'react-icons/ri';
import { useEffect, useState, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import smiley from '../../assets/smiley.png';

// import './transactions.css';

const MTransactions = ({ user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { updateBalance } = useContext(DealContext);

  // Safely accessing user
  user = user?.user;

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  };
  // console.log(localStorage.getItem("token"));
  let token = localStorage.getItem("token");
  const getTransactions = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=7`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                _id: user?.id,
            }),
        });

        const data = await response.json();

        setUserTransactions(data.transactions || []);
        setTotalPages(data.totalPages || 0);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        setLoading(false);
    }
};


  const getTransactions2 = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=5`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("session_token")}`, // Ensure token is included
            },
            body: JSON.stringify({
                _id: user?.id,
            }),
        });

        const data = await response.json();

        setUserTransactions(data.transactions || []);
        setTotalPages(data.totalPages || 0);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    } finally {
        setLoading(false);
    }
};


  const getTransactions1 = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getBaseUrl()}/get_transactions?page=${currentPage}&limit=5`, {
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
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (user?.id) {
      getTransactions();
    }
  }, [currentPage, updateBalance, user?.id]);

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

    return <div>{formatTimestamp(timestamp)}</div>;
  };

  return (
    <div className="super__feature overflow-hidden  bg-gray-200">

      <div className="ml-0">
        <div className="mb-3 mt-2">
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1.5 }}
            variants={{
              visible: { opacity: 1, translateX: 0 },
              hidden: { opacity: 0, translateX: 200 },
            }}
            className="ml-4"
          >
            <h3 className="text-bold">Recent Transactions</h3>
          </motion.div>
        </div>
      </div>
  
      {/* {userTransactions.length > 0 ? ( */}
      <div className="mx-3 pb-6 lg:mx-[95px]">
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
                  <th className="pr-4 sm:pr-0 hidden sm:flex" width="2%"> </th>
                  <th width="20%"><span className="m-5">Service</span></th>
                  <th width="13%">Amount</th>
                  <th width="45%" className="hidden sm:flex">Transaction ID</th>
                  <th width="35%">Status</th>
                </tr>
              </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="hidden sm:flex"><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td><Skeleton /></td>
                    <td className="hidden sm:flex"><Skeleton /></td>
                    <td><Skeleton /></td>
                  </tr>
                ))
              ) : userTransactions.length > 0 ? (
                userTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="hidden sm:flex">
                      <RiCheckboxCircleFill size={16} className="transaction__icon-success" />
                    </td>
                    <td>
                      <div className="table-col pl-5">
                        <span className="text-bold">{transaction.service}</span>
                        <span>{transaction.phone_num}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-col">
                        <span className="text-bold">{transaction.amount}</span>
                        <span className="text-[12px]">NGN</span>
                      </div>
                    </td>
                    <td className="hidden sm:flex">{transaction.transaction_id}</td>
                    <td>
                      <div className="table-col">
                        <span className="text-bold">Completed</span>
                        <TimestampFormatter timestamp={transaction.created_at} />
                      </div>
                    </td>
                  </tr>
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
          {totalPages > 1 && (
            <div className="pagination mb-2">
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
          )}
        </motion.div>
      </div>
{/*      ) : (
       
//         <div className="mx-3 mb-10 mt-10 lg:mx-[95px]">
//           <motion.div
//             initial="hidden"
//             whileInView="visible"
//             transition={{ duration: 0.8 }}
//             variants={{
//               visible: { opacity: 1 },
//               hidden: { opacity: 0 },
//             }}
//             className="overflow-hidden rounded-lg"
//           ></motion.div>
//           <div className="flex flex-col items-center justify-center">
//            <img src={smiley} alt="" className='' width="105"/>
//             <div className="flex flex-col w-full p-5 text-center">
//               <span className='font-bold'>No transactions yet!!!</span>
//             </div>
//           </div>
//       </div> 
//   )
// }*/}
</div>
);
}

export default MTransactions
