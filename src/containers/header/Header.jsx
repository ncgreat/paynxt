import { BsArrowRightShort } from 'react-icons/bs';
import './header.css';
import { Link } from 'react-router-dom';
const Header = () => {
	return (
		<div className="super__header">
			<div className="super__header-content">
				<div>
					<h3>Seamless airtime, data and bill payment experience</h3>
					<h1>Unlock Mega Savings with MegaDeals</h1>
					<Link to="/login">
						<button className="">
							Get Access
							<BsArrowRightShort
								size={18}
								className="getaccess__icon animate-pulse "
							/>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Header;
