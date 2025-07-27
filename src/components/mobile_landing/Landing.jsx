import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { Link, useHistory } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import logo from '../../assets/logo.png';
import light from '../../assets/illustration_light.jpg';
import phone from '../../assets/illustration_phone.jpg';
import wallet from '../../assets/illustration_wallet.jpg';

const MobileLanding = () => {
	const user =
		localStorage.getItem('loggedUser') !== 'undefined'
			? JSON.parse(localStorage.getItem('loggedUser'))
			: localStorage.clear();

	const navigate = useHistory();

	useEffect(() => {
		if (user) {
			navigate('/dashboard', { replace: true });
		}
	}, [user]);

	const settings = {
		dots: true,
		infinite: true,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 4000,
		swipe: true,
		touchMove: true,
	};

	const slides = [
		{ src: phone, title: 'Pay Bills Instantly', desc: 'Fast and secure payments from anywhere.' },
		{ src: light, title: 'Automate & Relax', desc: 'Set it once, let us handle the rest.' },
		{ src: wallet, title: 'Smart Wallet Control', desc: 'Top up, track, and manage with ease.' },
	];

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1f1f2e] via-[#2f2f46] to-[#3f3f5a] text-white font-sans">
			{/* <header className="py-6 px-6 flex justify-center">
				<img src={logo} alt="Logo" className="h-10" />
			</header> */}

			{/* <div className="justify-center items-center"> */}
			<Slider {...settings}>
				{slides.map((slide, index) => (
					<div
					key={index}
					// className="flex items-center justify-center px-6 min-h-[calc(100vh-200px)]"
				  >
					{/* Image */}
					<div className='flex items-center justify-center mt-24'>
					<LazyLoadImage
					  src={slide.src}
					  effect="blur"
					  alt={slide.title}
					  className="h-60 mb-6 rounded-xl object-contain shadow-lg"
					/>
					</div>
					
					{/* Title */}
					<h2 className="text-xl font-bold mb-2 text-center ">{slide.title}</h2>
					{/* Description */}
					<div className='flex items-center justify-center'>
					<p className="text-sm text-center text-gray-300 max-w-xs ">{slide.desc}</p>
					</div>
				
				  </div>
				))}
			</Slider>
{/* </div> */}
			<div className="mt-auto px-6 pb-8 space-y-4">
				<Link to="/sign-up">
					<button className="w-full bg-[#3f77eb] hover:bg-[#3268d6] text-white py-4 rounded-xl font-medium text-sm transition">
						Create Account
					</button>
				</Link>
				<Link to="/login">
					<button className="w-full border border-white text-white py-4 rounded-xl font-medium text-sm hover:bg-white hover:text-[#1f1f2e] transition">
						Login
					</button>
				</Link>
				<p className="text-center text-xs text-gray-400 pt-2">Secured by 256-bit encryption 🔒</p>
			</div>
		</div>
	);
};

const styles = {
	slide: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '90vh',
		textAlign: 'center',
		backgroundColor: '#f0f0f0',
	},
	heading: {
		fontSize: '24px',
		fontWeight: 'bold',
		color: '#333',
	},
	image: {
		maxWidth: '80%',
		objectFit: 'contain',
	},
};

export default MobileLanding;
