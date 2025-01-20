import { useEffect, useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { googleLogout } from '@react-oauth/google';
import { DealContext } from '../../DealContext';
import './navbar.css';
const Navbar = ({ user }) => {
	const [toggleMenu, setToggleMenu] = useState(false);
	// console.log(user);
	// const navigate = useNavigate();
	const navigate = useHistory();
	const { resetUser  } = useContext(DealContext);

	const logOut = () => {
		localStorage.clear();
		resetUser();
		googleLogout();
		navigate.push('/');
	};

	useEffect(() => {
		// console.log(toggleMenu);
	}, [toggleMenu]);

	return (
		<div id="top" className="super__navbar">
			<div className="super__navbar-links">
				<div className="super__navbar-links_logo">
					<Link to="/">
						<div>
							<span className="navbar_logo_text">PayNxt</span>
						</div>
					</Link>
				</div>
				<div className="super__navbar-links_container">
					<p>
						<a href="#buy-airtime">Buy Airtime</a>
					</p>
					<p>
						<a href="#buy-data">Buy Data</a>
					</p>
					<p>
						<a href="#pay-bills">Pay Bills</a>
					</p>
					{/* <p>
						<a href="#affiliate">Start Earning</a>
					</p>
					<p>
						<a href="#support">Get Help</a>
					</p> */}
				</div>
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
					/>
				) : (
					<RiMenu3Line
						color="#fff"
						size={27}
						onClick={() => setToggleMenu(true)}
					/>
				)}
				{toggleMenu && (
					<div className="super__navbar-menu_container scale-up-center">
						<div className="super__navbar-menu_container-links">
							<p>
								<a href="#buy-airtime">Buy Airtime</a>
							</p>
							<p>
								<a href="#buy-data">Buy Data</a>
							</p>
							<p>
								<a href="#pay-bills">Pay Bills</a>
							</p>
							<p>
								<a href="#affiliate">Start Earning</a>
							</p>
							<p>
								<a href="#support">Customer Support</a>
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
