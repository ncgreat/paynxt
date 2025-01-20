import { Link } from 'react-router-dom';
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
					className="super__cta-featured"
				>
					<div className="featured_cta-content">
						<MdSmartphone size={32} className="cta__icon" />
						<h2>Airtime Purchase</h2>
					</div>
					<div className="featured_cta-content">
						<MdPhoneAndroid size={32} className="cta__icon" />
						<h2>Data Purchase</h2>
					</div>
					<div className="featured_cta-content">
						<IoTicketOutline size={32} className="cta__icon" />
						<h2>Betting</h2>
					</div>
					<div className="featured_cta-content">
						<MdScreenshotMonitor size={35} className="cta__icon" />
						<h2>TV Subscription</h2>
					</div>
					<div className="featured_cta-content">
						<MdElectricBolt size={32} className="cta__icon" />
						<h2>Electricity Bills</h2>
					</div>
					<div className="featured_cta-content">
						<MdOutlineCardGiftcard size={32} className="cta__icon" />
						<h2>Gift Cards</h2>
					</div>
				</motion.div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					transition={{ duration: 1.2 }}
					variants={{
						visible: { opacity: 1 },
						hidden: { opacity: 0 },
					}}
					className="super__cta_trynow"
				>
					<Link to="/login" className="try-now">
						<button type="button">
							Try now
							<LuCreditCard
								size={16}
								color="#f4eff6"
								className="animate-pulse"
							/>
						</button>
					</Link>
					<Link to="/login" className="support">
						<button type="button">
							Customer support
							<LuHeadphones size={16} color="#5A6475" />
						</button>
					</Link>
				</motion.div>
			</div>
		</div>
	);
};

export default CTA;
