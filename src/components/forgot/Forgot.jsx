// import { useContext, useEffect, useState, createRef } from 'react';
import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill, RiArrowGoBackFill } from 'react-icons/ri';
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

const Forgot = () => {
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

//   useEffect(() => {
//     if (!user?.user) {
//       navigate.push('/login');
//     } else {
//       navigate.push('/dashboard');
//     }
//   }, [user, navigate]);

  const validateInputs = () => {
    let errors = {};

    if (!email) {
      errors.email = "Email is required";
      setIsLogin(false);
      setLoading(false);
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email format";
      setIsLogin(false);
      setLoading(false);
    }


    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

	const onSubmit = ev => {
		ev.preventDefault();
		if (!validateInputs()) return;
	
		const payload = {
		  email: emailRef.current.value,
		}

		
		axiosClient.post('/reset', payload)
		  .then(({ data }) => {
			console.log(data);
			setResetSuccess(true);
		  })
		  .catch((err) => {
			const response = err.response;
			if (response && response.status === 422) {
				setMessage(response.data.message);
				setIsLogin(false);
				setLoading(false);
			}
		  });
	
	
	  }

	     if (resetSuccess) {
					return (
					  <motion.div 
						initial={{ opacity: 0, scale: 0.9 }} 
						animate={{ opacity: 1, scale: 1 }} 
						exit={{ opacity: 0, scale: 0.9 }}
						className="flex flex-col items-center text-center justify-center h-screen -mt-10"
					  >
						<img className="w-16 mb-4" alt="Logo" src={logo} />
						{/* <h1 className="text-2xl font-semibold text-[#181325]">Welcome!</h1> */}
						<p className="text-gray-600 mt-2">Your account reset was successful. <br/>Please check your registered email for further instructions.</p>
						<span className="my-2">Or</span>
						<Link to="/login">
						  <button className="mt-5 px-6 py-2 bg-[#1e0c50c9] hover:bg-[#262775c9] text-[#ddd] rounded-lg shadow-md">
							 Login
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
					
						<h1>Reset Password</h1>
						<p className='text-[#071a22] flex'>
						<RiArrowGoBackFill size={12} className="h-5 w-5 ml-3"/><Link to="/login"><span className="font-bold text-base text-[#071a22]">Back to Login</span></Link>
						</p>
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
							type="email"
							placeholder="Email"
							value={email}
							ref={emailRef}
							onChange={(e) => setEmail(e.target.value)}
							className="pr-3 pl-10 py-2  rounded-lg w-full bg-[#071a22]"
						/>
					</div>
					{errors?.email && (
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 rounded-md">
						<p>{errors.email}</p>
					</motion.div>
					)}
					
					
					<button
						type="button"
						className="form-submit1 pr-3 py-2 my-3 bg-[#071a22] text-[#ddd] rounded-lg w-full"
						// onClick={()=>{onSubmit(), setIsLogin(true)}}
						onClick={(ev) => {
							setIsLogin(true);
							onSubmit(ev);
						  }}
						  
					>
						{isLogin ? 'Resetting...': 'Reset Password'}
					</button>
					
				</div>
				</div>
			</div>
		</div>
	);
};

export default Forgot;
