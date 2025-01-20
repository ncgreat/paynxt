import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth } from '../../services/firebase-config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import { DealContext } from '../../DealContext';
import jwt_decode from 'jwt-decode';
import './login.css';

const Login = () => {
  const navigate = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isNative, setIsNative] = useState(false);

  // Detect platform
  useEffect(() => {
    if (window.Capacitor && window.Capacitor.isNative) {
      setIsNative(true);
      GoogleAuth.init(); // Initialize GoogleAuth plugin for native apps
    }
  }, []);

  // Email/password login handler
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // setUser(userCredential.user);

      if (userCredential.user) {
        localStorage.setItem('token', userCredential.user);
        // localStorage.setItem('wallet', data.wallet.available_balance);
        var decoded = jwt_decode(userCredential.user);
        console.log(decoded);
        setLoggedUser({
          ...loggedUser,
          loggedUser: decoded,
        });
        localStorage.setItem('loggedUser', JSON.stringify(decoded));
        navigate.push('/dashboard', { replace: true });
      }

    } catch (error) {
      // setError(error.message);
      setError("Invalid email or password!");
    }
  };


  // Google login for web
  const handleGoogleLoginWeb = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      //setUser(result.user);

      if (result.user) {
        localStorage.setItem('token', result.user);
        // localStorage.setItem('wallet', data.wallet.available_balance);
        var decoded = jwt_decode(result.user);
        console.log(decoded);
        setLoggedUser({
          ...loggedUser,
          loggedUser: decoded,
        });
        localStorage.setItem('loggedUser', JSON.stringify(decoded));
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {!user ? (
      <div className="super__login">
      <Link to="/">
        <RiCloseFill
          size={41}
          className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#582066] "
        />
      </Link>
      <div className="super__login-header">
        <h1>Sign In</h1>
        <p>
          Not registered? <Link to="/sign-up"><span className='font-bold text-base'>Sign Up</span></Link>
        </p>
      </div>

      <div className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4 ">
        <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
          <RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
          />
        </div>
        <div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
          <RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button
          type="submit"
          className="pr-3 py-4 my-3 border bg-[#582066] text-[#ddd] border-gray-400 rounded-lg w-full"
          onClick={handleEmailLogin}
        >
          Login
        </button>

        {/* <button
          className="pr-3 py-4 my-3 border bg-[#582066] text-[#ddd] border-gray-400 rounded-lg w-full"
          onClick={handleSignup}
        >
          SignUp
        </button> */}

                {/* Show Google login only for web */}
                {!isNative && (
                  <div>
                    <div className=" flex w-full items-center my-4 solid before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                    <p className="text-center mx-4 mb-0">OR</p>
                  </div>
                    <button
                    type="button"
                    onClick={handleGoogleLoginWeb}
                    className="flex p-3 py-4 border border-gray-400 rounded-lg w-full justify-center"
                  >
                    <FcGoogle size={18} className="mt-1" />
                    <span className="ml-3">Sign in with Google</span>
                  </button>
                </div>
                )}
      </div>
      </div>


      ) : (
        <div>
          <h1>Welcome, {user.displayName || user.email}</h1>
          <button onClick={() => auth.signOut().then(() => setUser(null))}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
