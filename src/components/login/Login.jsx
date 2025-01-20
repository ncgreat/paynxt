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

const Login = () => {
  // const navigate = useHistory(); // Updated for React Router v6
  const { setLoggedUser } = useContext(DealContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNative, setIsNative] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)
  const navigate = useHistory();
  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
        // window.location.href = '/dashboard'
        // navigate.push('/dashboard')
        localStorage.setItem('token',  JSON.stringify(data.token));
        localStorage.setItem('wallet',  JSON.stringify(data.wallet));
			//  var decoded = jwt_decode(data.user);
			// console.log(decoded);
			// alert('Login successful');
			// setProfile(res.data);
      // setLoggedUser(decoded);
			
			localStorage.setItem('loggedUser', JSON.stringify(data.user));
			navigate.push('/dashboard', { replace: true });
      // fetchUserData(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }



  // Detect platform
  useEffect(() => {
    if (window.Capacitor && window.Capacitor.isNative) {
      setIsNative(true);
      GoogleAuth.init();
    }
  }, []);



  // const getBaseUrl = () => {
  //   if (window.Capacitor && window.Capacitor.isNative) {
  //     return 'http://10.0.2.2:3080'; // Android Emulator
  //   }
  //   return 'http://localhost:3080'; // Web
  // };

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
      setError(method === 'email' ? 'Invalid email or password!' : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (idToken) => {
    try {
      // const response = await fetch('http://192.168.0.6:3080/api/get-user-data', {
       const response = await fetch('localhost:8000/api/get-user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
  
      const data = await response.json();
      // if (data.status === 'ok') {
      //   localStorage.setItem('loggedUser', JSON.stringify(data.user));
      //   navigate.push('/dashboard');
      // } else {
      //   setError(data.error || 'Failed to fetch user data');
      // }

       localStorage.setItem('token', data.user);
			// localStorage.setItem('wallet', data.wallet.available_balance);
			 var decoded = jwt_decode(data.user);
			// console.log(decoded);
			// alert('Login successful');
			// setProfile(res.data);
      // setLoggedUser(decoded);
			
			localStorage.setItem('loggedUser', JSON.stringify(decoded));
			navigate.push('/dashboard', { replace: true });  
    } catch (err) {
      setError('Error fetching user data');
      console.error(err);
    }
  };

  // Fetch user data from MongoDB
  const fetchUserData1 = async (idToken) => {
    try {
      const response = await fetch('http://localhost:3080/api/get-user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      // console.log(data);
      if (data.status === 'ok') {
        setLoggedUser(data); // Update context
        localStorage.setItem('loggedUser', JSON.stringify(data.user));
        navigate.push('/dashboard');
      } else {
        setError(data.error || 'Failed to fetch user data');
      }
      //localStorage.setItem('token', data.user);
			// localStorage.setItem('wallet', data.wallet.available_balance);
			//var decoded = jwt_decode(data.user);
			//console.log(decoded);
			// alert('Login successful');
			// setProfile(res.data);
      // setLoggedUser(decoded);
			
			//localStorage.setItem('loggedUser', JSON.stringify(decoded));
			//navigate.push('/dashboard', { replace: true });  
    } catch {
      setError('Error fetching user data');
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
        <h1>Sign In</h1>
        {/* <p>
          Not registered?{' '}
          <Link to="/sign-up">
            <span className="font-bold text-base">Sign Up</span>
          </Link>
        </p> */}
         {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }
      </div>

      <div className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4">
        <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
          <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
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
          />
        </div>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
        <button
          type="submit"
          className="pr-3 py-4 my-3 border bg-[#0c503fc9] text-[#ddd] border-gray-400 rounded-lg w-full"
          // onClick={() => handleLogin('email')}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

       
      </div>
    </div>
  );
};

export default Login;
