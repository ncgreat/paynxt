import { Link, useHistory } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
  RiUser3Fill,
  RiLockPasswordFill,
  RiMailFill,
  RiCloseFill,
} from 'react-icons/ri';
import './signup.css';
import { useRef, useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../context/ContextProvider.jsx";
import logo from '../../assets/logo.png';
import { motion } from 'framer-motion'; // For smooth animation
import process from '../../assets/process.gif';

const Signup = () => {
  const navigate = useHistory();
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); // Loading state


    // Function to validate email
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsSignUp(true); // Start loading

      const email = emailRef.current.value;
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setIsSignUp(false); // Stop loading
      return;
    }
    setEmailError(null); // Clear error if email is valid

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    try {
      const { data } = await axiosClient.post('/signup', payload);
      setUser(data.user);
      setToken(data.token);
      navigate('/dashboard'); // Redirect after successful signup
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
        setIsSignUp(false); // Stop loading
      } else {
        console.error('Signup error:', err);
      }
    }
  };

  return (
    <div className="super__signup">
      <Link to="/">
        <RiCloseFill size={41} className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#582066]" />
      </Link>

      <div className="super__login-header">
        <img className="w-10" alt="Logo" src={logo} />
        <h1>Sign Up</h1>
        <p>
          Already registered? <Link to="/login"><span className="font-bold text-base">Sign In</span></Link>
        </p>
      </div>

     
      <form className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4" onSubmit={handleSignup}>
      {/* Animated Error Alert */}
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
            {Object.keys(errors).map((key) => (
              <li key={key}>• {errors[key][0]}</li>
            ))}
          </ul>
        </motion.div>
      )}

        <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
          <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="text"
            ref={nameRef}
            placeholder="Name"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
            required
          />
        </div>

        <div className="relative flex items-center mb-4 text-gray-500 focus-within:text-gray-700">
          <RiMailFill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
            required
          />
        </div>
        {/* {emailError && <p className="text-red-500 text-sm -mt-3">{emailError}</p>} */}
         {emailError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 -mt-2 mb-3 w-full max-w-md rounded-md shadow-md relative"
        >
          <button 
            onClick={() => setEmailError(null)}
            className="absolute top-2 right-3 text-red-700 hover:text-red-900"
          >
            &times;
          </button>
          <ul className="text-sm">
             <p>{emailError}</p>
          </ul>
        </motion.div>
      )} 

        <div className="relative flex items-center mb-4 text-gray-500 focus-within:text-gray-700">
          <RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
            required
          />
        </div>

        <div className="relative flex items-center text-gray-500 focus-within:text-gray-700">
          <RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="password"
            ref={passwordConfirmationRef}
            placeholder="Repeat Password"
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
            required
          />
        </div>

        <button
          type="submit"
          className={`mt-6 w-full py-3 rounded-lg shadow-md transition-all flex items-center justify-center ${
            isSignUp ? "bg-gray-400 cursor-not-allowed" : "bg-[#0c503fc9] hover:bg-[#267562c9] text-[#ddd]"
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

        {/* <button
          type="submit"
          className="pr-3 py-4 my-6 border bg-[#0c503fc9] text-[#ddd] border-gray-400 rounded-lg w-full"
        >
          Sign Up
        </button> */}
      </form>

      <div className="solid" />

      {/* Google Signup (Optional) */}
      {/* <div>
        <button type="button" className="single-sign-on">
          <FcGoogle size={18} className="sign-on-btn" />
          <span className="sign-on-text">Sign up with Google</span>
        </button>
      </div> */}
    </div>
  );
};

export default Signup;
