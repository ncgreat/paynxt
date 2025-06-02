import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuCreditCard, LuHeadphones } from 'react-icons/lu';
// import { BsPhoneFill } from 'react-icons/bs';
import {
	MdPhoneAndroid,
	MdElectricBolt,
	MdScreenshotMonitor,
	MdSmartphone,
	MdOutlineCardGiftcard,
} from 'react-icons/md';

import { IoTicketOutline } from 'react-icons/io5';
import './cta.css';
const CTA = () => {

	  const navigate = useHistory();

	return (
		<div className="super__cta-feature">
			<div className="super__cta-feature-content">
				<div>
					<motion.div
						initial="hidden"
						whileInView="visible"
						transition={{ duration: 1.5 }}
						variants={{
							visible: { opacity: 1, translateX: 0 },
							hidden: { opacity: 0, translateX: 200 },
						}}
					>
						{/* <h2>Your Trusted Plug</h2> */}
					</motion.div>
				</div>
			</div>
			<div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 0.8 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					className="super__cta-featured flex items-center justify-center"
				>
					<div className='bg-[#054872] p-5 rounded-lg w-[80%] py-6'>
						<p className='text-[#0EADBF] text-xs uppercase text-left'>Try it now</p>
						<div className='flex'>
							<h2 className='text-2xl text-white'>Ready to level up?</h2>
							<div className='mt-1'>
								<Link to="/login">
									<span className="p-3 bg-[#0EADBF] text-[#ddd] rounded-md px-3 mx-3">Get Started Now</span>
								</Link>
							</div>
							
							{/* <button
								onClick={navigate.push('/login')}
							 	className="p-2 bg-[#0EADBF] text-[#ddd] rounded-md px-3 mx-3"
							>
								Get Started Now
							</button> */}
							{/* <button className="p-2 border border-[#0EADBF] rounded-md text-[#ddd]">Learn More</button> */}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default CTA;
