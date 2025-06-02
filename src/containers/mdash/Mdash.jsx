import { useState } from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import car from '../../assets/car.png';
import flight from '../../assets/flight.png';
import wallet from '../../assets/wallet.png';
import dlivery from '../../assets/delivery.png';
import food from '../../assets/food.png';
import groceries from '../../assets/shopping.png';
// import groceries from '../../assets/groceries.png';

const Mdash = () => {
	const [isMore, setIsMore] = useState(false);

  return (
    <div className="items-center justify-center mb-4 lg:px-[6%]">
    <div className="px-4 bg-white rounded-lg lg:shadow-sm">
		<div className='sm:ml-14'>
			<h4 className="mx-2 mt-3 mb-3 text-xl  lg:block">
				What can we help you with?
			</h4>
		</div>
    <div className="">
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					// className="super__actions grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 md:mx-0 lg:grid-cols-8 gap-8 lg:mx-0"
					className="super__actions grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 justify-center"
				>
					<Link to="/bills">
						<button
							// className="flex justify-center w-[96px] p-5 bg-gradient-to-t from-blue-700 to-blue-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
							className="flex justify-center w-[96px] p-5 bg-gradient-to-t from-gray-700 to-green-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
						>
							<div className="flex flex-col items-center">
								{/* <div className="mt-5 rounded-full shadow-lg p-3 bg-[#a5a4a4]"> */}
									<img src={wallet} width="23px" alt="wallet" className=' w-[20px] h-4 mt-5' />
								{/* </div> */}
								<p className="font-semibold text-[#ddd] mt-2">NxtBills</p>
							</div>
						</button>
         			</Link>

					 <Link to="/foods">
						<button
							// className="flex justify-center w-[96px] p-5 bg-gradient-to-t from-blue-700 to-blue-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
							className="flex justify-center w-[96px] p-5 bg-gradient-to-t min-w-[90px] from-gray-700 to-pink-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
						>
							<div className="flex flex-col items-center">
						
									<img src={food} width="23px" alt="wallet" className=' w-[20px] h-4 mt-5' />
								
								<p className="font-semibold text-[#ddd] mt-2">NxtFood</p>
							</div>
						</button>
         			</Link>

					 <Link to="/groceries">
								<button
									// className="flex justify-center w-[96px] p-5 bg-gradient-to-t min-w-[90px] from-blue-700 to-blue-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
									className="flex justify-center w-[96px] p-5 bg-gradient-to-t min-w-[90px] from-gray-700 to-purple-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
								>
									<div className="flex flex-col items-center">
											<img src={groceries} width="" alt="flight" className='mt-5 mb-1 w-[25px] h-5' />
										<p className="font-semibold text-[#ddd]">Groceries</p>
									</div>
								</button>
							</Link> 
					

					{/* <Link to="/rides">
						<button
							// className="flex justify-center w-[96px] mb-2 p-5 bg-gradient-to-t from-[#E91E63] to-[#e61a5e] border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
							className="flex justify-center w-[96px] mb-2 p-5 bg-gradient-to-t from-pink-700 to-pink-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
						>
							<div className="flex flex-col items-center">
									<img src={car} width="25px" alt="Car" className='mt-5 w-[20px] h-4' />
								<p className="font-semibold text-[#ddd] mt-2">NxtRide</p>
							</div>
						</button>
					</Link> */}

					
					 {isMore && (
						<div className='flex'>
							{/* <Link to="#">
								<button
									className="flex justify-center w-[96px] p-5 bg-gradient-to-t min-w-[90px] from-blue-700 to-blue-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
									// className="flex justify-center w-[96px] p-5 bg-gradient-to-t min-w-[90px] from-purple-700 to-purple-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
								>
									<div className="flex flex-col items-center">
											<img src={flight} width="" alt="flight" className='mt-2 w-[35px]' />
										<p className="font-semibold text-[#ddd]">NxtFlight</p>
									</div>
								</button>
							</Link>  */}
							
						
								{/* <Link to="/food-vendor">
								<button
									// className="flex justify-center w-[96px] p-5 bg-gradient-to-t from-cyan-700 to-cyan-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
									className="flex justify-center w-[96px] p-5 bg-gradient-to-t from-orange-700 to-orange-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
								>
									<div className="flex flex-col items-center">
											<img src={dlivery} width="35px" alt="Car" className='mt-5 w-[22px] h-5' />
										<p className="font-semibold text-[#ddd] mt-1">NxtVendor</p>
									</div>
								</button>
							</Link> */}
						</div>
				
					)}
					 
					
				</motion.div>
       			 	 {/* <button
					    onClick={() => setIsMore(!isMore)}
						className="flex justify-center px-2 py-1 ml-2 mt-2 bg-white border border-gray-200 border border-gray-200 rounded-md hover:shadow-sm transition-all duration-300"
					>					
						<p className="font-semibold text-[#252525] ">{isMore ? "Less..." : "More..."}</p>
					</button>  */}
			</div>
     
     
    </div>
  </div>
  )
}

export default Mdash;