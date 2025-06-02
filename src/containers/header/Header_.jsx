import { BsArrowRightShort } from 'react-icons/bs';
import './header.css';
import { motion } from 'framer-motion';
import smile from '../../assets/paynxt-mobile.png';

const Header = () => {
	return (
		<div className="super__header">
			<div className="super__header-content">
				<div className="text-center lg:text-left">
					<motion.h1
						className="text-4xl lg:text-6xl mb-4 font-bold"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						The future of subscriptions
					</motion.h1>

					<motion.h3
						className="text-lg lg:text-2xl mb-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
					>
						Manage all your recurring subscriptions and more in one place!
					</motion.h3>

					<div className="flex mt-4 justify-center lg:justify-start">
						<motion.input
							type="email"
							placeholder="Your email address"
							className="w-[80%] lg:w-[60%] px-4 py-2 text-sm rounded-l-md text-gray-500 bg-transparent border border-gray-300 dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0EADBF] focus:border-transparent"
							aria-label="Email address"
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.5, duration: 0.4 }}
						/>

						<motion.button
							className="bg-[#0EADBF] hover:bg-[#08675C] text-white px-4 py-2 rounded-r-md text-xs md:text-base flex items-center transition-all duration-300"
							type="button"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Get Started
							<BsArrowRightShort className="ml-2 text-lg" />
						</motion.button>
					</div>
				</div>

				{/* Visual Section */}
				<div className="hidden lg:flex mt-6 h-[250px] relative overflow-hidden">
					{/* Circle line */}
					<motion.div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[760px] w-full border-2 border-gray-500 rounded-full z-0"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.6 }}
					></motion.div>

					<motion.div
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[745px] w-full border-2 border-gray-500 rounded-full z-0"
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 0.8 }}
						transition={{ delay: 0.2, duration: 0.6 }}
					></motion.div>

					{/* Info Cards */}
					<motion.div
						className="rounded-md bg-[#0EADBF] p-4 h-1/3 mt-28 relative z-5 shadow-lg"
						whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
					>
						<h2 className="text-md mb-2 text-white font-semibold">
							Bills Payment
						</h2>
					</motion.div>

					{/* App Image */}
					<motion.img
						src={smile}
						alt="PayNxt Mobile App"
						className="w-[800px] h-auto object-cover object-top mix-blend-multiply opacity-90"
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					/>

					<motion.div
						className="bg-[#08675C] p-4 h-1/3 rounded-md relative mt-20 z-5 shadow-lg"
						whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
					>
						<h2 className="text-md mb-2 text-white font-semibold">
							Enjoy Cashback
						</h2>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Header;
