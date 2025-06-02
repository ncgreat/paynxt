import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../../services/firebase-config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { DealContext } from '../../DealContext';
import jwt_decode from 'jwt-decode';
import {useStateContext} from "../../context/ContextProvider.jsx"
import axiosClient from "../../axios-client.js";
import './login.css';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion'; // For smooth animation

const Login = () => {
  // const navigate = useHistory(); // Updated for React Router v6
  const { setLoggedUser } = useContext(DealContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNative, setIsNative] = useState(false);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);


  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)
  const navigate = useHistory();

  const getBaseUrl = () => {
    // return 'http://127.0.0.1:8000/api';
    return `${import.meta.env.VITE_API_BASE_URL}/api`;
  };

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

  // useEffect(() => {
  //   if (!user || !user.user) {
  //     navigate.push('/'); // Redirect to login or home page
  //   } else {
  //     navigate.push('/dashboard'); 
  //   }
  // }, []);

  useEffect(() => {
    if (!user?.user) {
      navigate.push('/');
    } else {
      navigate.push('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);

        // Save data to localStorage
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('wallet', JSON.stringify(data.wallet));
        
        // Initialize or update the account object in localStorage
        const account = {
          transaction_pin: data.transaction_pin || null, // If transaction_pin exists in the response
          user_id: data.user?.id || null, // If user ID exists
        };
        localStorage.setItem('account', JSON.stringify(account));
        
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
        
        // Redirect to dashboard
        navigate.push('/dashboard', { replace: true });
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
          setIsLogin(false);
          setLoading(false);
          setErrors(response);
        }
      });


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
        headers: { 'Content-Type': 'application/json' },
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
        <p>
          Not registered?{' '}
          <Link to="/signup">
            <span className="font-bold text-base">Sign Up</span>
          </Link>
        </p>
       
      </div>

      <div className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4">
      {errors && (
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
           {errors.data.message}
          </ul>
        </motion.div>
      )}
        <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
          <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
            required
          />
        </div>
        <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
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
        </div>
        <button
          type="submit"
          // className="pr-3 py-4 my-3 border bg-[#0c503fc9] text-[#ddd] border-gray-400 rounded-lg w-full"
          className={`mt-6 w-full  py-3 rounded-lg shadow-md transition-all flex items-center justify-center ${
            isLogin ? "bg-gray-400 cursor-not-allowed" : "bg-[#0c503fc9] hover:bg-[#267562c9] text-[#ddd]"
          }`}
          onClick={(ev) => {
            setIsLogin(true);
            onSubmit(ev);
            }}
          disabled={loading}
        >
          {isLogin ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

       
      </div>
    </div>
  );
};

export default Login;
