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
		<div className="super__partner">
			<div className="super__partner-content">
				<div className="super__partner-header">
					<h2>Our Partners</h2>
				</div>
				<div className="super__partner-logos">
					<Ticker duration={65}>
						{logos.map((item, index) => (
							<img
								key={index}
								src={item}
								className="ticker-logos rounded"
								style={{
									margin: '0 80px',
									width: '100px',
									padding: '10px',
								}}
							/>
						))}
					</Ticker>
				</div>
			</div>
		</div>
	);
};

export default Partners;
