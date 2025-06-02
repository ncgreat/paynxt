import { useEffect, useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { FiLogIn, FiLogOut, FiSettings, FiShoppingBag   } from 'react-icons/fi';
import { googleLogout } from '@react-oauth/google';
import { DealContext } from '../../DealContext';
import './navbar.css';
import logo from '../../assets/logo.png';
const Navbar = ({ user }) => {
	const [toggleMenu, setToggleMenu] = useState(false);

	
	// console.log(user);
	// const navigate = useNavigate();
	const navigate = useHistory();
	const { resetUser, setIsSettings, setIsMenuOpen  } = useContext(DealContext);

	const logOut = () => {
		document.cookie = `lastUser=; path=/; max-age=0`;
		localStorage.clear();
		resetUser();
		googleLogout();
		navigate.push('/');
	};

	const settings = () => {
		console.log('settings');
		setIsMenuOpen(true);
		setIsSettings(true);
		setToggleMenu(false);
	};

	useEffect(() => {
		// console.log(toggleMenu);
	}, [toggleMenu]);

	return (
		<div id="top" className="super__navbar z-50">
			<div className="super__navbar-links">
				<div className="super__navbar-links_logo">
					<Link to="/">
						<div className='flex flex-col items-center'>
							<img src={logo} alt="paynxt"/>
							<span className="navbar_logo_text text-gray-400">PayNxt</span>
						</div>
					</Link>
				</div>
				<div className="super__navbar-links_container">
					<p>
						<a href="#pay_bills">Pay Bills</a>
					</p>
					<p>
						<a href="#order_food">Order Food</a>
					</p>
					<p>
						<a href="#order_grocery">Order Groceries</a>
					</p>
					<p>
						<a href="#affiliate">Start Earning</a>
					</p>
					<p>
						<a href="#support">Get Help</a>
					</p>
				</div>
			</div>

			<div className="super__navbar-sign mr-5">
				{user && (
					<button type="button" onClick={settings} className='btn2'>
						<FiSettings size={16} />
						Settings
					</button>
				)}
			</div>
			<div className="super__navbar-sign2 mr-10">
				{!user && (
					<Link to="/vendor-login">
						<button type="button" className='btn3'>
						<FiShoppingBag size={16} />
							Vendor
						</button>
					</Link>
					
				)}
			</div>			
			<div className="super__navbar-sign ">
				{user ? (
					<button type="button" onClick={logOut} className='btn2 btn-effect-1'>
						Log out
						<FiLogOut size={16} />
					</button>
				) : (
					<Link to="/login">
						<button type="button" >
							Login
							<FiLogIn
								size={16}
								color="#582066"
								onClick={() => setToggleMenu(false)}
							/>
						</button>
					</Link>
				)}
			</div>
			<div className="super__navbar-menu">
				{toggleMenu ? (
					<RiCloseLine
						color="#fff"
						size={27}
						onClick={() => setToggleMenu(false)}
						className='z-50'
					/>
				) : (
					<RiMenu3Line
						color="#fff"
						size={27}
						onClick={() => setToggleMenu(true)}
						className='z-50'
					/>
				)}
				{toggleMenu && (
					<div className="super__navbar-menu_container scale-up-center">
						<div className="super__navbar-menu_container-links">
							{/* <p>
								<a href="#buy-airtime">Buy Airtime</a>
							</p>
							<p>
								<a href="#buy-data">Buy Data</a>
							</p>
							<p>
								<a href="#pay-bills">Pay Bills</a>
							</p>
							<p>
								<a href="#affiliate">Settings</a>
							</p> */}
							<p>
								<a href="#support">Contact Support</a>
							</p>
							
						</div>

						<div className="super__navbar-menu_container-links-sign">
							{/* <Link to="/login">
								<button type="button">
									Login
									<FiLogIn
										size={16}
										color="#582066"
										onClick={() => setToggleMenu(false)}
									/>
								</button>
							</Link> */}
							{/* {user && (
							<button type="button" onClick={settings} className='btn2 mb-3'>
								<FiSettings size={16} />
									Settings
								</button>
							)} */}
							{user ? (
								<button type="button" onClick={logOut}>
									Log out
									<FiLogOut size={16} color="#582066" />
								</button>
							) : (
								<Link to="/login">
									<button type="button">
										Login
										<FiLogIn
											size={16}
											color="#582066"
											onClick={() => setToggleMenu(false)}
										/>
									</button>
								</Link>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Navbar;
