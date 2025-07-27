import { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { GoogleMap, LoadScript, LoadScriptNext, Autocomplete, Marker, Polyline } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


import car from '../../assets/car.png';
import flight from '../../assets/flight.png';
import wallet from '../../assets/wallet.png';
import dlivery from '../../assets/delivery.png';
import food from '../../assets/food.png';
import groceries from '../../assets/shopping.png';
// import groceries from '../../assets/groceries.png';

import { Receipt, ShoppingCart, ShoppingBag, CreditCard } from "lucide-react";
import { Card } from "../../components/ui/card";

const Mdash = () => {
	const [isMore, setIsMore] = useState(false);


const QuickActions = () => {
  const actions = [
    {
      icon: Receipt,
      label: "Pay Bills",
      description: "Utilities & services",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      icon: ShoppingCart,
      label: "Groceries",
      description: "Order fresh items",
      color: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-600"
    },
    {
      icon: ShoppingBag,
      label: "Food Delivery",
      description: "Order meals",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    },
    {
      icon: CreditCard,
      label: "Transfer",
      description: "Send money",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={`w-12 h-12 rounded-full ${action.color} ${action.hoverColor} flex items-center justify-center transition-colors duration-300 group-hover:scale-110 transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};



  return (
    <div className="items-center justify-center mb-4 lg:px-[6%]">
    <div className="px-4 bg-white rounded-lg lg:shadow-sm">
		<div className='sm:ml-14'>
			<h4 className="mx-2 mt-3 mb-3 text-xl  lg:block">
				What can we help you with?
			</h4>
		</div>
    <div className="">
		<QuickActions/>
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
							<Link to="/rides">
								<button
									// className="flex justify-center w-[96px] mb-2 p-5 bg-gradient-to-t from-[#E91E63] to-[#e61a5e] border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
									className="flex justify-center w-[96px] mb-2 p-5 bg-gradient-to-t from-pink-700 to-pink-500 border border-gray-200 rounded-xl shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300 mx-2 md:mx-4"
								>
									<div className="flex flex-col items-center">
											<img src={car} width="25px" alt="Car" className='mt-5 w-[20px] h-4' />
										<p className="font-semibold text-[#ddd] mt-2">NxtRide</p>
									</div>
								</button>
							</Link>
							
						
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