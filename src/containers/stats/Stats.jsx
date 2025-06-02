import { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DealContext } from '../../DealContext';
// import { MdTrendingUp, MdAttachMoney, MdPeople, MdPendingActions } from 'react-icons/md';
import { MdTrendingUp, MdAttachMoney, MdPeople, MdPendingActions, MdArrowUpward, MdArrowDownward } from 'react-icons/md';

import wait from '../../assets/loading.gif';

const Stats = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateBalance } = useContext(DealContext);
  const hasInitialized = useRef(false);

  const getBaseUrl = () => {
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  };
  

  useEffect(() => {
    const fetchStats = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
      try {
        const response = await axios.get(`${getBaseUrl()}/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'User-Id': user.user.id,
            'Content-Type': 'application/json',
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(null); // Set to null on error to show fallback zero values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [updateBalance]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        {/* <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-400"></div> */}
        <img src={wait} alt='' className='w-[70px]'/>
      </div>
    );
  }

  const statItems1 = [
    {
      label: "Today's Transactions",
      value: stats?.stats.todays_transactions || 0,
      icon: <MdPendingActions size={30} className="text-red-500" />,
      bg: 'bg-gradient-to-r from-red-50 to-red-0',
      border: 'border-red-300',
    },
    {
      label: 'Active Users',
      value: stats?.stats.active_users || 0,
      icon: <MdPeople size={30} className="text-yellow-500" />,
      bg: 'bg-gradient-to-r from-yellow-50 to-yellow-0',
      border: 'border-yellow-300',
    },
    {
      label: 'Total Transactions',
      value: stats?.stats.total_transactions || 0,
      icon: <MdTrendingUp size={30} className="text-blue-500" />,
      bg: 'bg-gradient-to-r from-blue-50 to-blue-0',
      border: 'border-blue-300',
    },
    // {
    //   label: 'Total Revenue',
    //   value: `$${stats?.stats.total_revenue?.toLocaleString() || 0}`,
    //   icon: <MdAttachMoney size={30} className="text-green-500" />,
    //   bg: 'bg-gradient-to-r from-green-100 to-green-50',
    //   border: 'border-green-300',
    // },
  ];

     const statItems = [
       {
         label: "Today Transactions",
         value: stats?.stats.todays_transactions || 0,
         percentage: stats?.stats.todays_transactions_percentage || 0,
         icon: <MdPendingActions size={30} className="text-red-500" />,
         bg: 'bg-gradient-to-r from-red-50 to-red-0',
         border: 'border-red-300',
       },
       {
         label: 'New Users',
         value: stats?.stats.active_users || 0,
         percentage: stats?.stats.active_users_percentage || 0,
         icon: <MdPeople size={30} className="text-yellow-500" />,
         bg: 'bg-gradient-to-r from-yellow-50 to-yellow-0',
         border: 'border-yellow-300',
       },
       {
         label: 'Total Transactions',
         value: stats?.stats.total_transactions || 0,
         percentage: stats?.stats.total_transactions_percentage || 0,
         icon: <MdTrendingUp size={30} className="text-blue-500" />,
         bg: 'bg-gradient-to-r from-blue-50 to-blue-0',
         border: 'border-blue-300',
       },
       {
         label: 'Total Users',
         value: `${stats?.stats.total_users?.toLocaleString() || 0}`,
        //  percentage: stats?.stats.total_revenue_percentage || 0,
         percentage: null,
         icon: <MdPeople size={30} className="text-green-500" />,
         bg: 'bg-gradient-to-r from-green-50 to-green-0',
         border: 'border-green-300',
       },
     ];
   
     const getPercentageIndicator = (percentage) => {
       if (percentage > 0) {
         return (
           <span className="flex items-center text-green-500">
             <MdArrowUpward size={16} className="mr-1" />
             {percentage.toFixed(2)}%
           </span>
         );
       } else if (percentage < 0) {
         return (
           <span className="flex items-center text-red-500">
             <MdArrowDownward size={16} className="mr-1" />
             {Math.abs(percentage).toFixed(2)}%
           </span>
         );
       }else if (percentage === null) {
        return <span className="text-gray-500"></span>;
       } 
       else {
         return <span className="text-gray-500">0%</span>;
       }
     };
   

  return (
    <div className="items-center justify-center mt-2 mb-2 lg:px-[6%] p-1">
      <div className="px-2 py-2 bg-white rounded-lg lg:shadow-sm">
        {/* <h3 className="font-semibold text-center mb-6 text-gray-800 lg:text-left">
          PayNxt Bills Statistics
        </h3> */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {statItems.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col p-2 ${item.bg} ${item.border} border-l-4 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-transform duration-300 lg:p-4`}
            >
              <div className="flex items-center justify-between">
                {/* <div>
                  <h3 className="text-lg font-medium text-gray-700">{item.label}</h3>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div> */}
                 <div>
                <h3 className="text-sm lg:text-md text-gray-700">{item.label}</h3>
                <p className="text-md lg:text-lg font-medium">{item.value}</p>
              </div>
                <div className="p-2 bg-white rounded-full shadow">{item.icon}</div>
              </div>
              <div className="mt-4 text-xs">
                {/* <span className="text-gray-500">Change: </span> */}
                {getPercentageIndicator(item.percentage)}
              </div>
            </div>
          ))}
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 ${item.bg} ${item.border} border-l-4 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-transform duration-300`}
            >
              <div>
                <h3 className="text-md text-gray-700">{item.label}</h3>
                <p className="text-lg font-medium">{item.value}</p>
              </div>
              <div className="p-2 bg-white rounded-full shadow">
                {item.icon}
              </div>
              <div className="mt-4 text-sm">
                <span className="text-gray-500">Change: </span>
                {getPercentageIndicator(item.percentage)}
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Stats;

