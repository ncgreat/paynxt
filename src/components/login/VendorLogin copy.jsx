import React, { useState, useEffect, useContext, createRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  RiUser3Fill, RiLockPasswordFill, RiCloseFill,
  RiMailFill, RiEyeFill, RiEyeOffFill
} from 'react-icons/ri';
import { DealContext } from '../../DealContext';
import jwt_decode from 'jwt-decode';
import { useStateContext } from "../../context/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import './login.css';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';
import wait from '../../assets/loading_.gif';
import process from '../../assets/process.gif';
import load from '../../assets/loading2.gif'

const VendorLogin = () => {
  const { setLoggedVendor } = useContext(DealContext);
  const { setVendor, setToken } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const emailRef = createRef();
  const passwordRef = createRef();
  const navigate = useHistory();

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  useEffect(() => {
    const encodedVendor = getCookie('lastVendor');
    if (encodedVendor) {
      try {
        const vendor1 = JSON.parse(atob(encodedVendor));
        setLoggedVendor(vendor1.vendorLogged);
        setVendor(vendor1.vendorLogged.user);
        if (!vendor1.vendorLogged.user.onboarding_complete) {
          navigate.push('/vendor-onboarding', { replace: true });
        } else {
          navigate.push('/food-vendor', { replace: true });
        }
      } catch (err) {
        console.log("Error decoding user cookie:", err);
      }
    }
    setCheckingAuth(false);
  }, []);

  const validateInputs = () => {
    const validationErrors = {};
    if (!email) {
      validationErrors.email = ["Email is required"];
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      validationErrors.email = ["Invalid email format"];
    }

    if (!password) {
      validationErrors.password = ["Password is required"];
    } else if (password.length < 6) {
      validationErrors.password = ["Password must be at least 6 characters long"];
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors({ message: "Please fix the errors below", errors: validationErrors });
      return false;
    }

    setErrors(null);
    return true;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setIsLogin(true);
    // setLoading(true);

    if (!validateInputs()) {
      setIsLogin(false);
      setLoading(false);
      return;
    }

    const payload = {
      email: email,
      password: passwordRef.current.value,
    };

    try {
      const { data } = await axiosClient.post('/vendor_login', payload, {
        withCredentials: true,
      });

      const encodedVendor = btoa(JSON.stringify({ vendorLogged: data }));
      setLoggedVendor(data);
      setVendor(data.user.business_name);
      setToken(null);

      document.cookie = `lastVendor=${encodedVendor}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastVendorName=${encodeURIComponent(data.user.business_name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastVendorEmail=${encodeURIComponent(data.user.email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.setItem("session_token", data.session_token);

      // 🧠 Add check here
      if (!data.user.onboarding_complete) {
        navigate.push('/vendor-onboarding', { replace: true });
      } else {
        navigate.push('/food-vendor', { replace: true });
      }

    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data);
      }
      setIsLogin(false);
      // setLoading(false);
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={wait} alt="Loading..." className="h-16" />
      </div>
    );
  }

  return (
    <div className="vendor-login-container">
      <div className="login-brand-section">
        <img src={logo} alt="Brand Logo" className="logo" />
        <h2 className='font-semibold'>Welcome Back!</h2>
        <p>Sign in to manage your menu, orders, and more.</p>
      </div>

      <div className="login-form-section">
        <Link to="/">
          <RiCloseFill
            size={41}
            className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#4f6b2a7c]"
          />
        </Link>

        <div className='flex flex-col items-center relative md:top-1/4'>
          <img className="w-10 mb-2 md:hidden" alt="Logo" src={logo} />
          <h3 className='text-2xl border-t border-t-gray-500 rounded-xl p-3 px-6'>Vendor Login</h3>
          {!userName && (
            <span className="text-center text-gray-600 -mt-6 mb-4">
              Not registered? <Link to="/vendor-signup"><span className="font-bold text-base">Sign Up</span></Link>
            </span>
          )}

{errors && (
  <motion.div 
    initial={{ opacity: 0, y: -10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }}
    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2  mt-4 w-full md:w-[60%] max-w-md rounded-md shadow-md relative"
  >
    <button
      onClick={() => setErrors(null)}
      aria-label="Close error message"
      style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.75rem',
        width: '1.5rem',
        height: '1.5rem',
        lineHeight: '1rem',
        padding: '0',
        margin: '0',
        background: 'transparent',
        color: '#b91c1c', // Tailwind's red-700
        border: 'none',
        fontWeight: 'bold',
        fontSize: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '9999px',
        cursor: 'pointer',
        zIndex: 10,
      }}
  className="hover:bg-red-700 hover:text-white transition-all duration-200"
>
  &times;
</button>

    
    <h3 className="font-semibold">Oops! Something went wrong</h3>
    
    {errors.message && (
      <p className="text-sm italic text-red-600">{errors.message}</p>
    )}
    
  </motion.div>
)}


          <form className="w-full login-form md:w-[60%]" onSubmit={onSubmit}>
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }}
              className="relative flex items-center mb-4"
            >
              <RiMailFill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
              <input
                type="email"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
                required
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 }}
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
            </motion.div>

            <button type="submit" disabled={isLogin} className="btn-submit flex text-center items-center justify-center">
              {isLogin ? <img src={load} width={20} alt="Processing" /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;
