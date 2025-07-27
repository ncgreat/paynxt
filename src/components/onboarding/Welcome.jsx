// import { useContext, useEffect, useState, createRef } from 'react';
import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import logo from '../../assets/logo.png';
// import { DealContext } from '../../DealContext';
// import jwt_decode from 'jwt-decode';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { motion } from 'framer-motion'; // For smooth animation
// import './login.css';
import {useStateContext} from "../../context/ContextProvider.jsx"
import axiosClient from "../../axios-client.js";

const Welcome = () => {
	const { token } = useParams(); // Get the token from the URL
	const navigate = useHistory();
	// const { loggedUser, setLoggedUser } = useContext(DealContext);
	// const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState('');
	const [loading, setLoading] = useState(false);
	const [isLogin, setIsLogin] = useState(false);
	const [welcomeSuccess, setWelcomeSuccess] = useState(false);
	    const [dots, setDots] = useState('');

	const emailRef = createRef()
	const passwordRef = createRef()
	const { setUser, setToken } = useStateContext()
	const [message, setMessage] = useState(null)
	
	    // Retrieve user from localStorage
  const user = (() => {
    const loggedUser = localStorage.getItem('loggedUser');
    const walletData = localStorage.getItem('wallet');
	const accountData = localStorage.getItem('account');

    if (!loggedUser || loggedUser === 'undefined' || !walletData || walletData === 'undefined') {
      localStorage.clear();
      return null;
    }

    return {
      user: JSON.parse(loggedUser),
      wallet: JSON.parse(walletData),
	    account: JSON.parse(accountData),
    };
  })();

  useEffect(()=>{

  },[welcomeSuccess])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) =>
        prev.length < 3 ? prev + '.' : ''
      );
    }, 500);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
	// console.log(token);
	if(token){
		onSubmit()
	}

  }, [token])

	const onSubmit = ev => {
	
		let user_id = token.split('-');
		let _token = user_id[1]
		user_id = user_id[0];

		const payload = {
			_token,
			user_id,
		  }
		
		axiosClient.post('/activate_user', payload)
		  .then(({ data }) => {
			if(data.status === 'success'){
				console.log(data);
				setWelcomeSuccess(true);
			}

		  })
		  .catch((err) => {
			const response = err.response;
			if (response && response.status === 422) {
				setMessage(response.data.message);
				// setIsLogin(false);
				// setLoading(false);
			}
		  });
		
	  }

if (welcomeSuccess) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] text-center px-6"
    >
      <motion.img
        src={logo}
        alt="App Logo"
        className="w-16 mb-6 drop-shadow-md border border-gray-50 p-5 rounded-xl"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

	       {/* Divider */}
     {/* <div className="w-[85%] mx-auto h-[20px] overflow-hidden relative mb-3">
       <div className="w-full h-[25px] rounded-[125px/12px] shadow-md bg-white -mt-[25px]"></div>
     </div> */}

      <h1 className="text-2xl font-semibold text-[#1f2937]">Welcome to PayNxt</h1>

      <p className="mt-3 text-base text-gray-600 max-w-md">
        Your account is now active. We're excited to have you onboard — let's get started!
      </p>

      <Link to="/dashboard">
        <button
          className="mt-6 px-6 py-2.5 bg-[#1e0c50] hover:bg-[#3a2d7a] text-white text-sm font-medium rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Go to Dashboard
        </button>
      </Link>
    </motion.div>
  );
}

// {welcomeSuccess && (
//   <motion.div
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     exit={{ opacity: 0, y: 30 }}
//     transition={{ duration: 0.5, ease: "easeOut" }}
//     className="flex flex-col items-center justify-center h-screen bg-white text-center px-6"
//   >
//     {/* App Logo */}
//     <motion.img
//       src={logo}
//       alt="App Logo"
//       className="w-16 mb-4"
//       initial={{ scale: 0.95 }}
//       animate={{ scale: 1 }}
//       transition={{ duration: 0.6, ease: "easeInOut" }}
//     />

//     {/* Divider */}
//     <div className="w-[85%] mx-auto h-[20px] overflow-hidden relative mb-6">
//       <div className="w-full h-[25px] rounded-[125px/12px] shadow-md bg-white -mt-[25px]"></div>
//     </div>

//     {/* Welcome Message */}
//     <h1 className="text-3xl font-semibold text-[#1f2937]">Welcome to PayNxt</h1>

//     <p className="mt-3 text-base text-gray-500 max-w-sm">
//       Your password was successfully reset. You're now ready to explore PayNxt’s features.
//     </p>

//     <Link to="/login">
//       <button
//         className="mt-6 px-6 py-2.5 text-sm font-medium bg-[#1e0c50] hover:bg-[#3a2d7a] text-white rounded-lg shadow-lg transition-all duration-300"
//       >
//         Go to Login
//       </button>
//     </Link>
//   </motion.div>
// )}



	return (
		<motion.div
			className="h-screen w-screen flex flex-col items-center justify-center bg-[#0d2b36] text-white"
			initial={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 5.6 }}
			>
			<motion.img
				src={logo}
				alt="App Logo"
				className="w-15 h-20 mb-6 -mt-28"
				animate={{
				scale: [1, 1.05, 1],
				opacity: [1, 0.8, 1],
				}}
				transition={{
				duration: 1.5,
				repeat: Infinity,
				ease: 'easeInOut',
				}}
			/>

			<motion.p
				className="text-sm text-gray-400 font-medium"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4, duration: 0.6 }}
			>
				Activating account<span className="tracking-widest">{dots}</span>
			</motion.p>
		</motion.div>
	);
};

export default Welcome;
