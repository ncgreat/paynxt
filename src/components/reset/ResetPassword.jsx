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

const ResetPassword = () => {
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
	const [resetSuccess, setResetSuccess] = useState(false);

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


  const validateInputs = () => {
    let errors = {};

    if (!password) {
      errors.password = "Password is required";
    //   setIsLogin(false);
    //   setLoading(false);
    } 


    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

	const onSubmit = ev => {
		ev.preventDefault();
		if (!validateInputs()) return;
	
		let user_id = token.split('-');
		let reset_token = user_id[2]
		user_id = user_id[0];

		const payload = {
			password: passwordRef.current.value,
			reset_token,
			user_id,
		  }
		
		axiosClient.post('/change_password', payload)
		  .then(({ data }) => {
			console.log(data);
			setResetSuccess(true);
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

	   if (resetSuccess) {
		return (
			<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 30 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="flex flex-col items-center justify-center h-screen bg-white text-center px-6"
			>
			<motion.img
				src={logo}
				alt="App Logo"
				className="w-16 mb-4"
				initial={{ scale: 0.95 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.6, ease: "easeInOut" }}
			/>

			<h1 className="text-2xl font-bold text-gray-800">Password Reset Successful</h1>

			<p className="mt-2 text-sm text-gray-500 max-w-xs">
				Your password has been updated. You can now log in with your new credentials.
			</p>

			<Link to="/login">
				<button
				className="mt-6 px-6 py-2.5 text-sm font-medium bg-[#1e0c50] hover:bg-[#3a2d7a] text-white rounded-lg shadow-lg transition-all duration-300"
				>
				Go to Login
				</button>
			</Link>
			</motion.div>
		);
	}

	return (
		<div className="super__login">
			<Link to="/">
				<RiCloseFill
					size={41}
					className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#ddd] "
				/>
			</Link>
			<div className='super__login-container rounded-xl'>
				 <div className="super__login-header">
					<div className='w-16 mt-16'>
						<img className="w-80" alt="Logo" src={logo} />
					</div>
					
						<h3>New Password</h3>
	
					  </div>
				<div className="login-form ">
				
				<div className="m-[10%]">
				{message && (
					<motion.div 
					initial={{ opacity: 0, y: -10 }} 
					animate={{ opacity: 1, y: 0 }} 
					exit={{ opacity: 0, y: -10 }}
					className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 w-full max-w-md rounded-md shadow-md relative"
					>
					<button 
						onClick={() => {setErrors(null); setMessage(null)}}
						className="absolute top-2 right-3 text-red-700 hover:text-red-900"
					>
						&times;
					</button>
					<h3 className="font-semibold">Oops! Something went wrong</h3>
					<ul className="mt-2 text-sm">
					{message}
					</ul>
					</motion.div>
				)}
					<div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-300">
						<RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
						<input
							type="password"
							placeholder="Password"
							value={password}
							ref={passwordRef}
							onChange={(e) => setPassword(e.target.value)}
							className="pr-3 pl-10 py-2  rounded-lg w-full bg-[#071a22]"
						/>
					</div>
					{errors?.password && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 rounded-md">
						<p>{errors.password}</p>
					</motion.div>
					)}
					
					
					<button
						type="button"
						className="form-submit1 pr-3 py-2 my-3 bg-[#071a22] text-[#ddd] rounded-lg w-full"
						// onClick={()=>{onSubmit(), setIsLogin(true)}}
						onClick={(ev) => {
							// setIsLogin(true);
							onSubmit(ev);
						  }}
						  
					>
						{isLogin ? 'Setting new password...': 'Set New Password'}
					</button>
					
				</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
