import { DealContext } from '../../DealContext';
import { motion } from 'framer-motion';
import { RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri';
import { useEffect, useState, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import './transactions.css';
const Transactions = ({ user }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [userTransactions, setUserTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const { balance, resetBalance, updateBalance  } = useContext(DealContext);
	// console.log(userTransactions);
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

	const handlePageChange = (page) => {
        setCurrentPage(page);
    };

	useEffect(() => {

			getTransactions();
			// setIsLoaded(false);
			setLoading(false);

	}, [currentPage, updateBalance]);

	// useEffect(() => {
	// 	getTransactions();
	// 	// setIsLoaded(true);
	// }, [user, currentPage, balance]);

	const TimestampFormatter = ({ timestamp }) => {
		const formatTimestamp = (timestamp) => {
		  const date = new Date(timestamp);
	  
		  // Extract date and time components
		  const day = String(date.getDate()).padStart(2, "0");
		  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		  const year = date.getFullYear();
	  
		  const hours = String(date.getHours()).padStart(2, "0");
		  const minutes = String(date.getMinutes()).padStart(2, "0");
		  const seconds = String(date.getSeconds()).padStart(2, "0");
		  const milliseconds = String(date.getMilliseconds()).padStart(2, "0").slice(0, 2); // Format milliseconds as 2 digits
	  
		  // Format as dd/MM/yyyy HH:mm:ss.SS
		  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
		};
	  
		return <div>{formatTimestamp(timestamp)}</div>;
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
						className="ml-[30px] mt-5 lg:ml-[75px]"
					>
						<h3 className="text-bold">Recent Transactions</h3>
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
					<table className="styled-table text-[13px] lg:text-[14px]">
						<thead>
							<tr className="text-[12px] lg:text-[14px]">
								<th className="pr-4 sm:pr-0 " width="5%"> </th>
								<th width="20%">
									<span className="m-5">Service</span>
								</th>
								<th width="15%">Amount</th>
								<th width="45%" className="hidden sm:flex">Transaction ID</th>
								<th width="15%">Status</th>
							</tr>
						</thead>
						{JSON.stringify(userTransactions) !== "[]" ? (
							<tbody>
								 {loading ? (
									Array.from({ length: 5 }).map((_, index) => (
										<tr key={index}>
											<td>
													<Skeleton />
											</td>
											<td>
												<div className="table-col pl-5">
													<Skeleton />
													<Skeleton />
												</div>
											</td>

											<td>
												<div className="table-col">
													<Skeleton />
													<Skeleton />
												</div>
											</td>
											<td className="hidden sm:flex"><Skeleton /></td>
											<td>
												<div className="table-col">
													<Skeleton />
													<Skeleton />
												</div>
											</td>
										</tr>
									))
									) : (
								 userTransactions.map(transaction => (
									<tr key={transaction.id}>
									<td>
										<RiCheckboxCircleFill
											size={16}
											className="transaction__icon-success"
										/>
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
											<span className='text-[12px]'>NGN</span>
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
							)}
							</tbody>
						) : (
							<tbody>
								<tr>
									<td colSpan="5" className="text-center">
										<span className="w-full p-5">No Transactions</span>
									</td>
								</tr>
							</tbody>
						)}
					</table>
					<div>
					{JSON.stringify(userTransactions) !== "[]" ? (
						Array.from({ length: totalPages }, (_, index) => (
							<button
								key={index}
								onClick={() => handlePageChange(index + 1)}
								disabled={currentPage === index + 1}
								// className='p-2 mr-3 mt-2 bg-[#ddd] '
								className='page'
							>
								{index + 1}
							</button>
						))
					):(
						<div></div>
					)}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Transactions;
