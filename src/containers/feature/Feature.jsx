import { motion } from 'framer-motion';

import { BsActivity } from 'react-icons/bs';
import { LuCreditCard } from 'react-icons/lu';
import { BiRefresh } from 'react-icons/bi';
import airtime from '../../assets/images/call.png';
import netflix from '../../assets/images/netflix.png';
import { FaUtensils, FaShoppingCart } from 'react-icons/fa'
import { MdReceiptLong } from 'react-icons/md';
import { RiBillLine } from 'react-icons/ri';
// import bulb from '../../assets/images/bulb.png';
import './feature.css';
import { Link } from 'react-router-dom';
// import { useEffect, useRef } from 'react';
const Feature = () => {
	return (
		<div className="super__feature">
			<div className="super__feature-content">
				<div>
				<div className='w-60 border border-gray-300 border-b-0 rounded-full mb-6 my-16 shadow-md'>
				<h4 className='text-gray-700 text-center shadow-sm p-4'><span className='partners'>What We Offer</span></h4>
				</div>
				{/* <div className='w-60 border border-gray-300 border-b-0 rounded-full my-12 shadow-md'>
						<h4 className="className='text-gray-700 text-center shadow-sm p-6'">What We Offer</h4>
					</div> */}
				</div>
			</div>
			<motion.div
				initial="hidden"
				whileInView="visible"
				transition={{ duration: 0.8 }}
				variants={{
					visible: { opacity: 1 },
					hidden: { opacity: 0 },
				}}
				className="super__featured justify-center items-center text-white "
			>
<div className="flex w-[72%]">

{/* Bill Payments */}
<div className="w-full h-[220px] bg-white border shadow group lg:w-1/3 p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-25">
  <RiBillLine className="text-3xl text-cyan-600 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_6px_rgba(6,182,212,0.2)] transition duration-300" />
  <h2 className="font-semibold mt-2 text-[#222]">Bill Payments</h2>
  <p className="text-sm text-gray-600 mt-1">
	Pay utilities and TV/internet bills securely in one place.
  </p>
</div>

{/* Food Ordering */}
<div className="w-full h-[220px] bg-white border shadow group lg:w-1/3 p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-25">
  <FaUtensils className="text-3xl text-emerald-600 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_6px_rgba(16,185,129,0.2)] transition duration-300" />
  <h2 className="font-semibold mt-2 text-[#222]">Food Ordering</h2>
  <p className="text-sm text-gray-600 mt-1">
	Order meals fast from your favorite restaurants.
  </p>
</div>

{/* Groceries Ordering */}
<div className="w-full h-[220px] bg-white border shadow group lg:w-1/3 p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-25">
  <FaShoppingCart className="text-3xl text-orange-500 group-hover:text-orange-300 group-hover:drop-shadow-[0_0_6px_rgba(249,115,22,0.2)] transition duration-300" />
  <h2 className="font-semibold mt-2 text-[#222]">Groceries Ordering</h2>
  <p className="text-sm text-gray-600 mt-1">
	Shop essentials and get quick home delivery.
  </p>
</div>

</div>

{/* <div className="featured_content w-full h-[220px] bg-transparent cursor-pointer group lg:w-1/3">
  <div className="relative w-full h-full duration-1000">
    <div className="absolute bg-[#D9D9D9] rounded-lg shadow-lg p-6 mb-10 pb-10 border-2 w-full h-full flex flex-col items-center justify-center">
	<div  className="featured__icon_different text-[#D9D9D9]">
		
      </div>

      <div className="text-[#222] text-center">
        <h2 className="font-semibold">Utility Payments</h2>
        <p className='text-justify h-[100px]'>
		Managing utility bills has never been easier. Our platform allows you to pay your Cable TV and Electricity bills quickly and securely from the comfort of your home or on the go. Stay on top of your bills.
        </p>
      </div>
    </div>
  </div>
</div> */}
			
			</motion.div>
			{/* <div className="super__featured"> */}
			{/* <motion.div
				initial="hidden"
				whileInView="visible"
				transition={{ duration: 0.8 }}
				variants={{
					visible: { opacity: 1 },
					hidden: { opacity: 0 },
				}}
				className="super__featured justify-between"
			>
				<div className="featured_content1 w-1/3 m-5 bg-[#f4eff6]  shadow-lg p-8 mb-10 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover: duration-500 ">
					<LuCreditCard
						size={32}
						className="featured__icon_different text-[#f4eff6] "
					/>
					<div className="text-[#222] ">
						<h2>Top Up Wallet</h2>
						<p>
							Easily top up your wallet with your card, bank transfer or USSD.
						</p>
					</div>
				</div> */}
			{/* featured_content */}
			{/* <div className="featured_content1  text-[#222] m-5  w-1/3  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover: duration-500 ">
					<div className="group [perspective:1000px]"> */}
			{/* <div className=" relative flex flex-col bg-[#f4eff6] p-8 shadow-lg items-center transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] [backface]"> */}
			{/* <div className="absolute flex flex-col bg-[#f4eff6] w-full rounded-lg shadow-lg items-center p-8 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] ">
							<BsActivity
								size={32}
								className="featured__icon_different text-[#f4eff6]"
							/>

							<div className="text-[#222]">
								<h2>Set Airtime Amount and/or Data Plan</h2>
								<p>
									Easily configure airtime amount or data plan based on your
									need.
								</p>
							</div>
						</div>
						<div className=" absolute bg-[#f4eff6] flex flex-col p-8 rounded-lg shadow-lg w-full h-[190px] [transform:rotateY(180deg)] [backface-visibility:hidden]">
							<span>
								<h3>Home</h3>
							</span>
						</div>
					</div>
				</div>
				<div className="featured_content1 bg-[#f4eff6] w-1/3 m-5 shadow-lg p-8 mb-10 rounded-lg transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:duration-500 ">
					<BiRefresh
						size={35}
						className="featured__icon_different text-[#f4eff6]"
					/>
					<div className="text-[#222]">
						<h2>Schedule Delivery Time</h2>
						<p>Sit back and enjoy seamless service rendered with no hassle.</p>
					</div>
				</div>
			</motion.div> */}
			{/* </div> */}
		</div>
	);
};

export default Feature;
