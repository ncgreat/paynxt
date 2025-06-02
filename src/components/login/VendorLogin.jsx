import React, { useState, useEffect, useContext, useRef } from 'react';
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
import load from '../../assets/loading2.gif';

const VendorLogin = () => {
  const { setLoggedVendor } = useContext(DealContext);
  const { setVendor, setToken } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const emailInputRef = useRef(null);
  const navigate = useHistory();

  useEffect(() => {
    emailInputRef.current?.focus(); // Auto-focus email input on load

    const encodedVendor = getCookie('lastVendor');
    if (encodedVendor) {
      try {
        const vendor1 = JSON.parse(atob(encodedVendor));
        setLoggedVendor(vendor1.vendorLogged);
        setVendor(vendor1.vendorLogged.user);
        navigate.push(vendor1.vendorLogged.user.onboarding_complete ? '/food-vendor' : '/vendor-onboarding');
      } catch (err) {
        console.error("Error decoding user cookie:", err);
      }
    }

    setCheckingAuth(false);
  }, []);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const validateInputs = () => {
    const validationErrors = {};
    if (!email) validationErrors.email = ["Email is required"];
    else if (!/^\S+@\S+\.\S+$/.test(email)) validationErrors.email = ["Invalid email format"];

    if (!password) validationErrors.password = ["Password is required"];
    else if (password.length < 6) validationErrors.password = ["Password must be at least 6 characters"];

    if (Object.keys(validationErrors).length > 0) {
      setErrors({ message: "Please fix the errors below", errors: validationErrors });
      return false;
    }

    setErrors(null);
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLogin(true);

    if (!validateInputs()) {
      setIsLogin(false);
      return;
    }

    try {
      const { data } = await axiosClient.post('/vendor_login', {
        email,
        password,
      }, { withCredentials: true });

      const encodedVendor = btoa(JSON.stringify({ vendorLogged: data }));
      setLoggedVendor(data);
      setVendor(data.user.business_name);
      setToken(null);

      document.cookie = `lastVendor=${encodedVendor}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastVendorName=${encodeURIComponent(data.user.business_name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      document.cookie = `lastVendorEmail=${encodeURIComponent(data.user.email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
      localStorage.setItem("session_token", data.session_token);

      navigate.push(data.user.onboarding_complete ? '/food-vendor' : '/vendor-onboarding');
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data);
      }
      setIsLogin(false);
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
          <span className="text-center text-gray-600 -mt-6 mb-4">
            Not registered? <Link to="/vendor-signup"><span className="font-bold text-base">Sign Up</span></Link>
          </span>

          {errors && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2 mt-4 w-full md:w-[60%] max-w-md rounded-md shadow-md relative"
            >
              <button
                onClick={() => setErrors(null)}
                className="absolute top-2 right-3 text-red-700 hover:bg-red-700 hover:text-white rounded-full w-6 h-6 text-lg flex items-center justify-center"
              >
                &times;
              </button>
              <h3 className="font-semibold">Oops! Something went wrong</h3>
              {errors.message && <p className="text-sm italic text-red-600">{errors.message}</p>}
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
                          ref={emailInputRef}
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
