import React from 'react';
import Slider from 'react-slick';
import { Link, useHistory } from 'react-router-dom';
import './landing.css';
import logo from '../../assets/logo.png';
import light from '../../assets/illustration_light.jpg';
import phone from '../../assets/illustration_phone.jpg';
import wallet from '../../assets/illustration_wallet.jpg';
import {
	Footer,
	Header,
	Navbar,
	Partners,
	Feature,
	CTA,
} from '../../containers';
import { useEffect } from 'react';
const MobileLanding = () => {
	const user =
		localStorage.getItem('loggedUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedUser'))
			: localStorage.clear();
	const navigate = useHistory();
	useEffect(() => {
		if (user) {
			navigate.push('/dashboard', { replace: true });
		}
	}, [user]);

	const settings = {
		dots: true, // This enables the pagination dots
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		// autoplay: true,
		// autoplaySpeed: 3000,
		arrows: true, // Hide next/prev arrows for mobile
		swipe: true, // Enable swipe gestures
		touchMove: true, // Allow touch movement
	  };

	return (
	<div className="main" style={{ width: '100%', overflow: 'hidden', margin: '0 auto' }}>
		<Slider {...settings}>
		  <div style={styles.slide}>

			<div className='w-full flex justify-center mt-[20%]'>
				<img src={phone} className='h-[220px] rounded-lg' alt="Slide 1" style={styles.image} />
			</div>
			<div className='w-full flex items-center justify-center pt-10'>
				<h2 style={styles.heading}>Bill payments made easy!</h2>
				</div>
				<div className='w-full flex items-center justify-center'>
				<p>Enjoy seamless payment experience...</p>
			</div>
			<div className='pt-[100px] pr-7 pl-7'>
			<Link to="/sign-up">
				<button
				type="button"
				className="w-full text-gray-500 pt-5 pb-5 bg-white hover:bg-gray-100 mb-4 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-white  dark:text-gray-500 dark:border-[#63396c] dark:hover:text-white dark:hover:bg-[#63396c] dark:focus:ring-[#63396c]"
				>
				Create an account
				</button>
				</Link>
				<Link to="/login">
					<button
					type="button"
					className="w-full text-gray-200 pt-5 pb-5 bg-[#3f1d47] hover:bg-[#63396c] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-300 focus:z-10 dark:bg-[#3f1d47] dark:text-gray-300 dark:border-[#63396c] dark:hover:text-white dark:hover:bg-[#63396c] dark:focus:ring-[#63396c]"
					>
					Login
					</button>
				</Link>
			</div>
			
		  </div>
  
		  <div style={styles.slide}>

			<div className='w-full flex justify-center mt-[70px]'>
				<img src={light} className='h-[220px] rounded-lg' alt="Slide 1" style={styles.image} />
			</div>
			<div className='w-full flex items-center justify-center pt-[60px]'>
				<h2 style={styles.heading}>Automate your payments!</h2>
			</div>
			<div className='w-full flex items-center justify-center'><p>Schedule your payments and relax...</p></div>
			<div className='pt-[100px] pr-7 pl-7'>
			<Link to="/sign-up">
				<button
				type="button"
				className="w-full text-gray-500 pt-5 pb-5 bg-white hover:bg-gray-100 mb-4 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-white  dark:text-gray-500 dark:border-[#63396c] dark:hover:text-white dark:hover:bg-[#63396c] dark:focus:ring-[#63396c]"
				>
				Create an account
				</button>
				</Link>
				<Link to="/login">
					<button
					type="button"
					className="w-full text-gray-200 pt-5 pb-5 bg-[#3f1d47] hover:bg-[#63396c] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-300 focus:z-10 dark:bg-[#3f1d47] dark:text-gray-300 dark:border-[#63396c] dark:hover:text-white dark:hover:bg-[#63396c] dark:focus:ring-[#63396c]"
					>
					Login
					</button>
				</Link>
			</div>
			
		  </div>
  
		  <div style={styles.slide}>

			<div className='w-full flex justify-center mt-[20%]'>
				<img src={wallet} className='h-[220px] rounded-lg' alt="Slide 1" style={styles.image} />
			</div>
			<div className='w-full flex flex-col items-center justify-center pt-10'>
				<h2 style={styles.heading}>Manage your wallet with ease!</h2>
				<p>Managing your wallet couldn't be easier...</p>
			</div>
			<div className='pt-[100px] pr-7 pl-7'>
			<Link to="/sign-up">
				<button
				type="button"
				className="w-full text-gray-500 pt-5 pb-5 bg-white hover:bg-gray-100 mb-4 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-white  dark:text-gray-500 dark:border-[#63396c] dark:hover:text-white dark:hover:bg-[#63396c] dark:focus:ring-[#63396c]"
				>
				Create an account
				</button>
				</Link>
				<Link to="/login">
					<button
					type="button"
					className="w-full text-gray-200 pt-5 pb-5 bg-[#3f1d47] hover:bg-[#63396c] focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-300 focus:z-10 dark:bg-[#3f1d47] dark:text-gray-300 dark:border-[#63396c] dark:hover:text-white dark:hover:bg-[#63396c] dark:focus:ring-[#63396c]"
					>
					Login
					</button>
				</Link>
			</div>
			
		  </div>
		</Slider>
		
	  </div>

	);
};

const styles = {
	slide: {
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	  justifyContent: 'center',
	  height: '100vh',
	  textAlign: 'center',
	  backgroundColor: '#f0f0f0',
	},
	heading: {
	  fontSize: '24px',
	  fontWeight: 'bold',
	  color: '#333',
	},
	paragraph: {
	  fontSize: '16px',
	  color: '#666',
	  margin: '15px 0',
	  padding: '0 20px',
	},
	image: {
	  maxWidth: '80%',
	//   height: 'auto',
	},
  };

export default MobileLanding;
