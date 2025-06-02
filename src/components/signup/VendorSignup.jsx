import { Link, useHistory } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { RiUser3Fill, RiLockPasswordFill, RiMailFill, RiCloseFill, RiEyeFill, RiEyeOffFill, RiBuilding2Fill } from 'react-icons/ri';
import './signup.css';
import { useRef, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion';
import process from '../../assets/process.gif';

const VendorSignup = () => {
  const navigate = useHistory();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const businessRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [businessError, setBusinessError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [vendorName, setVendorName] = useState('');

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsSignUp(true);

    const email = emailRef.current.value;
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setIsSignUp(false);
      return;
    }
    setEmailError(null);
    setVendorName(nameRef.current.value);

    const payload = {
      name: nameRef.current.value,
      email,
      business: businessRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      const { data } = await axiosClient.post('/vendor_signup', payload);
      // setUser(data.user);
      // setToken(data.token);
      // navigate('/dashboard');
      setSignupSuccess(true);
    } catch (err) {
      setIsSignUp(false);
      if (err.response) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: ["Network error. Please check your connection."] });
      }
    }
  };

  if (signupSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center justify-center h-screen -mt-10"
      >
        <img className="w-16 mb-4" alt="Logo" src={logo} />
        <h1 className="text-2xl font-semibold text-[#582066]">Welcome {vendorName}!</h1>
        <p className="text-gray-600 mt-2">Your vendor account has been successfully created.</p>
        <Link to="/vendor-login">
          <button className="mt-5 px-6 py-2 bg-[#0c503fc9] hover:bg-[#267562c9] text-[#ddd] rounded-lg shadow-md">
            Go to Login
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="vendor-login-container"
      //  className="super__signup vendor-login-container"
    >
        <div className="login-brand-section ">
          <img src={logo} alt="Brand Logo" className="logo" />
          <h2 className='font-semibold'>Hi <span className="text-2xl inline-block rotate-12">✋</span></h2>
          <p>Setup your vendor account </p>
        </div>
     
      <div className="login-form-section ">
      <Link to="/">
        <RiCloseFill size={41} className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#582066]" />
      </Link>
    <div className='relative md:top-24'>
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="super__login-header flex"
      >
        <img className="w-10 mb-3 md:hidden" alt="Logo" src={logo} />
        {/* <h2 className="text-xl font-semibold mb-4 md:mt-4">Vendor Sign Up</h2> */}
        <h3 className='text-2xl border-t border-t-gray-500 rounded-xl p-3 px-6'>Vendor Sign Up</h3>
      
      </motion.div>
      <div className='flex flex-col items-center justify-center -mt-6'>
       <span className="text-center text-gray-600">
          Already registered? <Link to="/vendor-login"><span className="font-bold text-base">Sign In</span></Link>
        </span>
      <form className="w-full login-form md:w-[60%]" onSubmit={handleSignup}>
      {/* <form className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4" onSubmit={handleSignup}> */}
        {errors && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-4 w-full max-w-md rounded-md shadow-md relative"
          >
            <button onClick={() => setErrors(null)} className="absolute top-2 right-3 text-red-700 hover:text-red-900">
              &times;
            </button>
            <h3 className="font-semibold">Oops! Something went wrong</h3>
            <ul className="mt-2 text-sm">
              {Object.keys(errors).map((key) => (
                <li key={key}>• {errors[key][0]}</li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="relative flex items-center mt-5 mb-4"
        >
          <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
          <input
            type="text"
            ref={nameRef}
            placeholder="Name"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
            required
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="relative flex items-center mb-4"
        >
          <RiBuilding2Fill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
          <input
            type="text"
            ref={businessRef}
            placeholder="Business Name"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
            required
          />
        </motion.div>

        {businessError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 mb-3 w-full max-w-md rounded-md shadow-md relative"
          >
            <button onClick={() => setEmailError(null)} className="absolute top-2 right-3 text-red-700 hover:text-red-900">
              &times;
            </button>
            <p className="text-sm">{emailError}</p>
          </motion.div>
        )}

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
            placeholder="Email Address"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
            required
          />
        </motion.div>

        {emailError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 mb-3 w-full max-w-md rounded-md shadow-md relative"
          >
            <button onClick={() => setEmailError(null)} className="absolute top-2 right-3 text-red-700 hover:text-red-900">
              &times;
            </button>
            <p className="text-sm">{emailError}</p>
          </motion.div>
        )}

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
            placeholder="Password"
            className="pr-10 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
            required
          />
          {/* <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500">
            {showPassword ? <RiEyeOffFill size={18} /> : <RiEyeFill size={18} />}
          </button> */}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
          className="relative flex items-center mb-4"
        >
          <RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3 text-gray-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            ref={passwordConfirmationRef}
            placeholder="Confirm Password"
            className="pr-10 pl-10 py-2 border border-gray-400 rounded-lg w-full focus:border-[#582066]"
            required
          />
          {/* <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 text-gray-500">
            {showConfirmPassword ? <RiEyeOffFill size={18} /> : <RiEyeFill size={18} />}
          </button> */}
        </motion.div>


        <button
          type="submit"
          className={`mt-6 w-full py-3 rounded-lg shadow-md transition-all flex items-center justify-center ${
            // isSignUp ? "bg-gray-400 cursor-not-allowed" : "bg-[#0c503fc9] hover:bg-[#267562c9] text-[#ddd]"
            isSignUp ? "bg-gray-400 cursor-not-allowed" : "bg-[#0d2b36] hover:bg-[#0d2b36cb] text-[#ddd]"
          }`}
          disabled={isSignUp}
        >
          {isSignUp ? (
            <>
              <img src={process} className='h-5 mr-2 rounded-full' alt=''/>
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
      </div>
      </div>
      </div>
    </motion.div>
  );

};

export default VendorSignup;
