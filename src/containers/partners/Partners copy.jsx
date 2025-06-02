import glo from '../../assets/glo-logo.svg';
import etisalat from '../../assets/9mobile-logo.svg';
import mtn from '../../assets/mtn-logo.svg';
import airtel from '../../assets/airtel-logo.svg';
import smile from '../../assets/smile-logo.svg';
import bet9ja from '../../assets/bet9ja-logo.svg';
import xbet from '../../assets/1xbet-logo.svg';
import betway from '../../assets/betway-logo.svg';
import sportybet from '../../assets/sportybet-logo.svg';
import dstv from '../../assets/dstv-logo.svg';
import gotv from '../../assets/gotv-logo.svg';
import ikeja from '../../assets/ikeja-logo.svg';
import eko from '../../assets/eko-logo.svg';
import paystack from '../../assets/paystack.png';
import multi from '../../assets/multichoice.png';
import bedc from '../../assets/bedc-logo.svg';
import abuja from '../../assets/abuja-logo.svg';
import kaduna from '../../assets/kaduna-logo.svg';
import Ticker from 'framer-motion-ticker';
import './partners.css';
const Partners = () => {
	const logos = [
		bedc,
		glo,
		gotv,
		airtel,
		smile,
		bet9ja,
		etisalat,
		dstv,
		xbet,
		ikeja,
		kaduna,
		mtn,
		betway,
		abuja,
		eko,
		sportybet,
	];
	return (
		<div className="hidden lg:flex super__partner">
			<div className="super__partner-content">
				<div className='justify-center'>
				<h4 className='text-gray-700 text-center mt-3 mb-1'>Our Trusted Partners</h4>
					<div className=" bg-[#424242] rounded-lg w-full mr-10 py-10 ">
						<div className='flex justify-between px-10'>
							<img src={paystack} alt='' className='w-14 rounded-md'/>
							<img src={mtn} alt='' className='w-14 rounded-lg'/>
							<img src={glo} alt='' className='w-14'/>
							{/* <img src={bet9ja} alt='' className='w-14 bg-gray-900 p-2 rounded-md'/> */}
							<img src={multi} alt='' className='w-14 bg-[#130d4b] p-2 rounded-md'/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Partners;
