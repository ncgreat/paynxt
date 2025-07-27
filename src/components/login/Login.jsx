import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  RiUser3Fill, RiLockPasswordFill, RiCloseFill,
  RiEyeFill, RiEyeOffFill
} from 'react-icons/ri';
import { DealContext } from '../../DealContext';
import { useStateContext } from "../../context/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import './login.css';
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';
import wait from '../../assets/loading_.gif';
import process from '../../assets/process.gif';
// import OtpInput from './OtpInput.jsx';

const Login = () => {
  const { setLoggedUser } = useContext(DealContext);
  const { setUser, setToken } = useStateContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [otp, setOtp] = useState('');
const [otpStep, setOtpStep] = useState(false);
const [otpError, setOtpError] = useState('');
const [resendCountdown, setResendCountdown] = useState(0);
const [isActive, setIsActive] =useState(true);


  const emailInputRef = useRef(null);
  const navigate = useHistory();
    const inputsRef = useRef([]);

    const handleChange = (e, idx) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const otpArr = otp.split('');
    otpArr[idx] = val;
    setOtp(otpArr.join(''));

    // Auto-focus next
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      const otpArr = otp.split('');
      otpArr[idx - 1] = '';
      setOtp(otpArr.join(''));
      inputsRef.current[idx - 1]?.focus();
      e.preventDefault();
    }
  };  

  useEffect(() => {
    emailInputRef.current?.focus();

    const savedName = getCookie('lastUserName');
    const savedEmail = getCookie('lastUserEmail');
    if (savedName && savedEmail) {
      setUserName(savedName);
      setEmail(savedEmail);
    }
  }, []);

  useEffect(() => {
    const encodedUser = getCookie('lastUser');
    if (encodedUser) {
      try {
        const user1 = JSON.parse(atob(encodedUser));
        setLoggedUser(user1.logged);
        setUser(user1.logged.user);
        navigate.push('/dashboard');
      } catch (err) {
        console.error("Error decoding user cookie:", err);
      }
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
  if (resendCountdown <= 0) return;

  const interval = setInterval(() => {
    setResendCountdown((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [resendCountdown]);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const validateInputs = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters long";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onVerifyOtp = async (e) => {
  e.preventDefault();
  setIsLogin(true);
  setMessage(null);

  try {
    const verify_token = localStorage.getItem('verify_token');
    const response = await axiosClient.post('/verify-otp', { otp, verify_token });
// console.log(response);
    const data = response.data;
    // if(data.message){
    //   setOtpError(data.message)
    //   return;
    // }

    const encodedUser = btoa(JSON.stringify({ logged: data }));
    setLoggedUser(data);
    setUser(data.user);
    setToken(data.token);

    document.cookie = `lastUser=${encodedUser}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `lastUserName=${encodeURIComponent(data.user.name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
    document.cookie = `lastUserEmail=${encodeURIComponent(data.user.email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
    localStorage.setItem("session_token", data.session_token);

    // Clean up temp storage
    localStorage.removeItem('verify_token');
    localStorage.removeItem('pending_email');

    navigate.push('/dashboard');
  } catch (err) {
    // console.log(err.response?.data?.message);
    setMessage(err.response?.data?.message || "Invalid or expired OTP");
    setIsLogin(false);
  }
};

const onResendOtp = async () => {
  const email = localStorage.getItem('pending_email');
  if (!email) return alert("No email found to resend OTP.");

  try {
    await axiosClient.post('/resend-otp', { email });
    alert("OTP resent to your email.");
    setResendCountdown(300); // Restart countdown on resend
  } catch (err) {
    alert("Could not resend OTP.");
  }
};


  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLogin(true);
    setMessage(null);

    if (!validateInputs()) {
      setIsLogin(false);
      return;
    }

    try {
      const { data } = await axiosClient.post('/login', { email, password });

      console.log(data);
      if(data.active === false){
          setIsActive(false);
          return;
      }

      if(data.otp_required){
      // Save the verify_token
        localStorage.setItem('verify_token', data.verify_token);
        localStorage.setItem('pending_email', email);
        setOtpStep(true); // Set this new state
        setIsLogin(false);
        setResendCountdown(300); // start 5-min timer
      }else{
          const encodedUser = btoa(JSON.stringify({ logged: data }));
          setLoggedUser(data);
          setUser(data.user);
          setToken(null);

          document.cookie = `lastUser=${encodedUser}; path=/; max-age=${60 * 60 * 24 * 7}`;
          document.cookie = `lastUserName=${encodeURIComponent(data.user.name)}; path=/; max-age=${60 * 60 * 24 * 7}`;
          document.cookie = `lastUserEmail=${encodeURIComponent(data.user.email)}; path=/; max-age=${60 * 60 * 24 * 7}`;
          localStorage.setItem("session_token", data.session_token);

          navigate.push('/dashboard');
      }

    
    } catch (err) {
      if (err.response?.status === 422) {
        setMessage(err.response.data.message || "Invalid credentials");
      }
      setIsLogin(false);
    }

  };

  const clearSavedUser = () => {
    document.cookie = `lastUserName=; path=/; max-age=0`;
    document.cookie = `lastUserEmail=; path=/; max-age=0`;
    setUserName('');
    setEmail('');
  };

  if (checkingAuth || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={wait} alt="Loading..." className="h-16" />
      </div>
    );
  }

if (!isActive) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-sm text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-12" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-2">
          <svg
            className="w-10 h-10 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Account Inactive</h2>
        <p className="text-gray-600 text-sm">
          Your account is not yet active. Please check your email inbox or spam folder to activate your account.
        </p>

        {/* Optional: Resend link */}
        {/* <button className="mt-4 text-sm text-blue-600 hover:underline">Resend activation email</button> */}
      </div>
    </div>
  );
}


  return (
    <div className="super__login">
      <Link to="/">
        <RiCloseFill
          size={41}
          className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#4f6b2a7c]"
        />
      </Link>

      <div className="super__login-header">
              <img className="w-10" alt="logo" src={logo} />
                    {!otpStep && (
                      <>
                      <h1>Sign In</h1>
                      {!userName && (
                        <p>
                          Not registered?{' '}
                          <Link to="/signup">
                            <span className="font-bold text-base">Sign Up</span>
                          </Link>
                        </p>
                      )}
                      </>
                    )}
            </div>

      

      {otpStep ? (
        <form onSubmit={onVerifyOtp} className="w-full px-6 md:w-1/3 lg:w-1/4">
          <h2 className="text-center text-lg font-semibold mb-4">Enter OTP sent to your email</h2>
          {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 m-3 rounded-md shadow-md relative"
          >
            <button
              onClick={() => setMessage(null)}
              type="button"
              className="absolute top-1 right-3 text-red-700 hover:text-red-900"
            >
              &times;
            </button>
            {/* <h3 className="font-semibold">Oops! Something went wrong</h3> */}
            <p className="text-sm">{message}</p>
          </motion.div>
        )}
          <div className="flex justify-between space-x-3 mb-6">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={otp[i] || ''}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => inputsRef.current[i] = el}
                  className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#582066]"
                />
              ))}
            </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg shadow-md flex items-center justify-center transition-all ${isLogin ? "bg-gray-400 cursor-not-allowed" : "bg-[#0d2b36] hover:bg-[#0d2b36cb] text-[#ddd]"}`}
            disabled={isLogin}
          >
            {isLogin ? (
              <>
                <img src={process} className='h-5 mr-2 rounded-full' alt="loading" />
                Verifying...
              </>
            ) : "Verify OTP"}
          </button>

          {/* <p className="text-sm mt-4 text-center text-gray-600">
            Didn’t receive code? <button onClick={onResendOtp} type="button" className="text-[#582066] underline">Resend</button>
          </p> */}
          <p className="text-sm mt-4 text-center text-gray-600">
            Didn’t receive code?{" "}
            <button
              onClick={onResendOtp}
              type="button"
              className={`text-[#582066] underline disabled:text-gray-400 disabled:cursor-not-allowed`}
              disabled={resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Resend in ${Math.floor(resendCountdown / 60)}:${String(resendCountdown % 60).padStart(2, '0')}`
                : 'Resend'}
            </button>
          </p>
        </form>
) : (
  /* ... your existing login form ... */
  <form onSubmit={onSubmit} className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 rounded-md shadow-md relative"
          >
            <button
              onClick={() => setMessage(null)}
              type="button"
              className="absolute top-2 right-3 text-red-700 hover:text-red-900"
            >
              &times;
            </button>
            <h3 className="font-semibold">Oops! Something went wrong</h3>
            <p className="text-sm">{message}</p>
          </motion.div>
        )}

        {userName ? (
          <div className="mb-4 text-gray-800 mt-2 border-t border-t-gray-500 rounded-xl p-3">
            <p>Welcome back, <strong>{userName}</strong></p>
            <p>Please confirm your password to access your account.</p>
            <button onClick={clearSavedUser} type="button" className="text-sm border p-2 rounded-lg text-red-800 mt-2">Not you?</button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center mb-4"
          >
            <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              ref={emailInputRef}
              onChange={(e) => setEmail(e.target.value)}
              className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
              required
            />
          </motion.div>
        )}

        {errors.email && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 text-red-700 p-2 -mt-2 rounded-md">
            <p>{errors.email}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500">
            {showPassword ? <RiEyeOffFill size={18} /> : <RiEyeFill size={18} />}
          </button>
        </motion.div>

        {errors.password && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 text-red-700 p-2 -mt-2 rounded-md">
            <p>{errors.password}</p>
          </motion.div>
        )}

        <button
          type="submit"
          className={`mt-6 w-full py-3 rounded-lg shadow-md flex items-center justify-center transition-all ${isLogin ? "bg-gray-400 cursor-not-allowed" : "bg-[#0d2b36] hover:bg-[#0d2b36cb] text-[#ddd]"}`}
          disabled={isLogin}
        >
          {isLogin ? (
            <>
              <img src={process} className='h-5 mr-2 rounded-full' alt="loading" />
              Logging in...
            </>
          ) : "Login"}
        </button>

        <p className="mt-4">
          Forgot password?{' '}
          <Link to="/forgot-password">
            <span className="text-[#071a22]">Click here</span>
          </Link>
        </p>
      </form>
)}
      
    </div>
  );
};

export default Login;
