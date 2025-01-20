import { motion } from 'framer-motion';

import { BsActivity } from 'react-icons/bs';
import { LuCreditCard } from 'react-icons/lu';
import { BiRefresh } from 'react-icons/bi';
import './feature.css';
import { Link } from 'react-router-dom';
// import { useEffect, useRef } from 'react';
const Feature = () => {
	return (
		<div className="super__feature">
			<div className="super__feature-content">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.8 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: -200 },
						}}
					>
						<h2>No more hassle when you need Airtime and Data</h2>
					</motion.div>
					{/* <motion.p
						initial="hidden"
						transition={{ duration: 0.8 }}
						variants={{
							visible: { opacity: 1, translateY: 0 },
							hidden: { opacity: 0, translateY: 200 },
						}}
					>
						With our automated system, you can have airtime and data sent to you
						at your scheduled time.
					</motion.p> */}
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
				className="super__featured justify-between  justify-center items-center gap-x-10 text-white"
			>
				{/* <div className="super__featured justify-between "> */}

				<div className="featured_content w-full h-[210px] bg-transparent cursor-pointer group [perspective:1000px] lg:w-1/3">
					<div className="relative [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] w-full h-full duration-1000">
						<div className="absolute [backface-visibility:hidden] bg-[#f4eff6] rounded-lg shadow-lg p-6 mb-10 border-2 w-full h-full">
							<LuCreditCard
								size={32}
								className="featured__icon_different text-[#f4eff6]"
							/>
							<div className="text-[#222]">
								<h2 className=" font-semibold">Top Up Wallet</h2>
								<p>
									Easily top up your wallet with your card, bank transfer or
									USSD.
								</p>
							</div>
						</div>
						<div className="absolute [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg border-2 w-full h-full bg-[#6d346c] overflow-hidden">
							<div className="text-center flex flex-col items-center justify-center h-full text-[#f4eff6] p-6 pb-24">
								<h1 className="text-xl font-semibold mt-[65px]">Instant Top Up</h1>
								<p className="mb-3">
									Easily top up your wallet with your card, bank transfer or
									USSD with no hassle.
								</p>
								<Link to="/login">
									<button className="bg-[#ddd] border border-[#8f468f] px-6 py-2 text-[#222] rounded-full bottom-5 delay-500 duration-1000 group-hover:bottom-5 scale-0 group-hover:scale-100">
										Get Started
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="featured_content w-full h-[210px] bg-transparent cursor-pointer group [perspective:1000px] lg:w-1/3">
					<div className="relative [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] w-full h-full duration-1000">
						<div className="absolute [backface-visibility:hidden] bg-[#f4eff6] rounded-lg shadow-lg p-6 mb-10 border-2 w-full h-full">
							<BsActivity
								size={32}
								className="featured__icon_different text-[#f4eff6]"
							/>
							<div className="text-[#222]">
								<h2 className=" font-semibold">
									Set Airtime Amount or Data Plan
								</h2>
								<p>
									Easily configure airtime amount or data plan based on your
									need.
								</p>
							</div>
						</div>
						<div className="absolute [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg border-2 w-full h-full bg-[#6d346c] overflow-hidden">
							<div className="text-center flex flex-col items-center justify-center h-full text-[#f4eff6] p-5 pb-24">
								<h1 className="text-xl font-semibold mt-[70px]">
									Automate your top up
								</h1>
								<p className="mb-3">
									Never get stranded trying to buy airtime or data. Schedule top
									up from your megadeals wallet.
								</p>
								<Link to="/login">
									<button className="bg-[#ddd] border border-[#8f468f] px-6 py-2 text-[#222] rounded-full bottom-5 delay-500 duration-1000 group-hover:bottom-5 scale-0 group-hover:scale-100">
										Get Started
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="featured_content w-full h-[210px] bg-transparent cursor-pointer group [perspective:1000px] lg:w-1/3">
					<div className="relative [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] w-full h-full duration-1000">
						<div className="absolute [backface-visibility:hidden] bg-[#f4eff6] rounded-lg shadow-lg p-6 mb-10 border-2 w-full h-full">
							<BiRefresh
								size={35}
								className="featured__icon_different text-[#f4eff6]"
							/>
							<div className="text-[#222]">
								<h2 className=" font-semibold">Schedule Delivery Time</h2>
								<p>
									Sit back and enjoy seamless service rendered with no hassle.
								</p>
							</div>
						</div>
						<div className="absolute [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg border-2 w-full h-full bg-[#6d346c] overflow-hidden">
							<div className="text-center flex flex-col items-center justify-center h-full text-[#f4eff6] p-5 pb-24">
								<h1 className="text-xl font-semibold mt-[65px]">
									Set Delivery Timeline
								</h1>
								<p className="mb-3">
									Set the delivery frequency for your automatic top up plans.
								</p>
								<Link to="/login">
									<button className="bg-[#ddd] border border-[#8f468f] px-6 py-2 text-[#222] rounded-full bottom-5 delay-500 duration-1000 group-hover:bottom-5 scale-0 group-hover:scale-100">
										Get Started
									</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
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
