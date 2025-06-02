import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
// import { auth } from '../../services/firebase-config';
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill, RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { DealContext } from '../../DealContext';
import jwt_decode from 'jwt-decode';
import {useStateContext} from "../../context/ContextProvider.jsx"
import axiosClient from "../../axios-client.js";
import './login.css';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion'; // For smooth animation
import wait from '../../assets/loading_.gif';
import process from '../../assets/process.gif';

const Login = () => {
  // const navigate = useHistory(); // Updated for React Router v6
  const { setLoggedUser } = useContext(DealContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNative, setIsNative] = useState(false);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');


  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)
  const navigate = useHistory();

  const getBaseUrl = () => {
    // return 'http://127.0.0.1:8000/api';
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  };

  const getCookie = (name) => {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	  };

  let loggeduser = '';
	
    useEffect(() => {
      const savedName = getCookie('lastUserName');
      const savedEmail = getCookie('lastUserEmail');

      if (savedName && savedEmail) {
        setUserName(savedName);
        setEmail(savedEmail);
      }

      }, []);


  useEffect(() => {
      const lastUser = getCookie('lastUser');
      if(lastUser){
        navigate.push('/dashboard', { replace: true });
      }
  }, []);

  useEffect(() => {
     
      const encodedUser = getCookie('lastUser');
      if (encodedUser) {
        console.log(encodedUser);
        try {
          const user1 = JSON.parse(atob(encodedUser));
          setLoggedUser(user1.logged);
          loggeduser = user1.logged.user;
        } catch (err) {
          console.log("Error decoding user cookie:", err);
        }
      }
  
      if (loggeduser) {
        navigate.push('/dashboard', { replace: true });
      } else {
          const delay = setTimeout(() => setLoading(false), 10500); // Simulate loading
          return () => clearTimeout(delay);
      }
    }, []);


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

    if (!password) {
      errors.password = "Password is required";
      setIsLogin(false);
      setLoading(false);
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
      setIsLogin(false);
      setLoading(false);
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validateInputs()) return;

    const payload = {
      email: email,
      password: passwordRef.current.value,
    }

    try {
      const { data } = await axiosClient.post('/login', payload, {
        withCredentials: true, // Required to receive HttpOnly cookie
      });
  
      // Save user in React context
      // Encode user data and store in cookie
      const encodedUser = btoa(JSON.stringify({
        logged: data
      }));
      // console.log(data);
      setLoggedUser(data);
      setUser(data.user);
      setToken(null); // Since token is now stored in HttpOnly cookie
  
      // Store cookies
      document.cookie = `lastUser=${encodedUser}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastUserName=${encodeURIComponent(data.user.name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastUserEmail=${encodeURIComponent(data.user.email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.setItem("session_token", data.session_token);
      // console.log(data);

  
      navigate.push('/dashboard', { replace: true });
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setMessage(response.data.message);
        setIsLogin(false);
        setLoading(false);
      }
    }

  }


  // Detect platform
  useEffect(() => {
    if (window.Capacitor && window.Capacitor.isNative) {
      setIsNative(true);
      GoogleAuth.init();
    }
  }, []);


  // Unified Login Handler
  const handleLogin = async (method) => {
    setLoading(true);
    setError('');

    try {
      let idToken;

      if (method === 'email') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        idToken = await userCredential.user.getIdToken();
      } else if (method === 'google') {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        idToken = await result.user.getIdToken();
      }
     
      await fetchUserData(idToken);
    } catch (err) {
      setErrors(method === 'email' ? 'Invalid email or password!' : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (idToken) => {
    try {
      // const response = await fetch('http://192.168.0.6:3080/api/get-user-data', {
       const response = await fetch(`${getBaseUrl()}/api/get-user-data`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`, // Ensure session_token is used
        },
        body: JSON.stringify({ idToken }),
      });
  
      const data = await response.json();
   
       localStorage.setItem('token', data.user);
			
			 var decoded = jwt_decode(data.user);
			
			localStorage.setItem('loggedUser', JSON.stringify(decoded));
			navigate.push('/dashboard', { replace: true });  
    } catch (err) {
      setErrors('Error fetching user data');
      // console.error(err);
    }
  };

  const clearSavedUser = () => {
		document.cookie = `lastUserName=; path=/; max-age=0`;
		document.cookie = `lastUserEmail=; path=/; max-age=0`;
		setUserName('');
		setEmail('');
	};

  if (loading) return null;

  return (
    <div className="super__login">
      <Link to="/">
        <RiCloseFill
          size={41}
          className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#4f6b2a7c]"
        />
      </Link>
      <div className="super__login-header">
        <img className="w-10" alt="" src={logo} />
        <h1>Sign In</h1>
        {!userName && (
           <p>
          Not registered?{' '}
          <Link to="/signup">
            <span className="font-bold text-base">Sign Up</span>
          </Link>
        </p>
        )}
       
       
      </div>

      <div className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4">
      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 w-full max-w-md rounded-md shadow-md relative"
        >
          <button 
            onClick={() => setErrors(null)}
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
        	{userName ? (
					<div className="mb-4 text-gray-800 items-start mt-2 border-t border-t-gray-500 rounded-xl p-3">
            {/* <div className='border border-b-gray-300 mb-2 rounded-2xl'/> */}
					{/* <p>Welcome back, <strong>{userName}</strong></p> */}
          <p>Welcome back, <strong>{userName}</strong></p>
          <p>Please confirm your password to access your account.</p>
					<button onClick={clearSavedUser} className="text-sm border p-2 border-b-gray-500 rounded-lg text-red-800 ">Not you?</button>
					</div>
				) : (
          <div>
      <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="relative flex items-center mt-5 mb-4"
        >
          {/* <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700"> */}
            <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
              required
            />
          {/* </div> */}
        </motion.div>
        {errors?.email && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 rounded-md">
            <p>{errors.email}</p>
          </motion.div>
        )}
        </div>
      )}
        {/* <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="relative flex items-center mb-4"
        >
          {/* <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700"> *
            <RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              ref={passwordRef}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
              required
            />
          {/* </div> 
        </motion.div> */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="relative flex items-center mb-4"
        >
          <RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            ref={passwordRef}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="pr-10 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500">
            {showPassword ? <RiEyeOffFill size={18} /> : <RiEyeFill size={18} />}
          </button>
        </motion.div>
        {errors?.password && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 rounded-md">
            <p>{errors.password}</p>
          </motion.div>
        )}
        <button
          type="submit"
          // className="pr-3 py-4 my-3 border bg-[#0c503fc9] text-[#ddd] border-gray-400 rounded-lg w-full"
          className={`mt-6 w-full  py-3 rounded-lg shadow-md transition-all flex items-center justify-center ${
            isLogin ? "bg-gray-400 cursor-not-allowed" : "bg-[#0d2b36] hover:bg-[#0d2b36cb] text-[#ddd]"
          }`}
          onClick={(ev) => {
            setIsLogin(true);
            onSubmit(ev);
            }}
          disabled={loading}
        >
          {isLogin ? (
            <>
              {/* <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-15" cx="12" cy="12" r="12" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"></path>
              </svg> */}
              <img src={process} className='h-5 mr-2 rounded-full' alt=''/>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

       <p className='mt-4'>
						Forgot password?<span className='text-[#4d4d4d]'></span><Link to="/forgot-password"><span className='text-[#071a22]'>Click here</span></Link>
					</p>
      </div>
    </div>
  );
};

export default Login;
