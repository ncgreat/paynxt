// import { Link, useNavigate } from 'react-router-dom';
import { Link, useHistory } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
	RiUser3Fill,
	RiLockPasswordFill,
	RiPhoneFill,
	RiMailFill,
	RiCloseFill,
} from 'react-icons/ri';
import './signup.css';
import {createRef, useState} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../../context/ContextProvider.jsx";

const Signup = () => {
	// const navigate = useNavigate();
	const navigate = useHistory();

	// const [name, setName] = useState('');
	// const [email, setEmail] = useState('');
	// const [phone, setPhone] = useState('');
	// const [password, setPassword] = useState('');
	// const [repassword, setRePassword] = useState('');

 const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()
  const {setUser, setToken} = useStateContext()
  const [errors, setErrors] = useState(null)

	const onSubmit = ev => {
		ev.preventDefault()
	
		const payload = {
		  name: nameRef.current.value,
		  email: emailRef.current.value,
		  password: passwordRef.current.value,
		  password_confirmation: passwordConfirmationRef.current.value,
		}
		axiosClient.post('/signup', payload)
		  .then(({data}) => {
			setUser(data.user)
			setToken(data.token);
		  })
		  .catch(err => {
			const response = err.response;
			if (response && response.status === 422) {
			  setErrors(response.data.errors)
			}
		  })
	  }


	  // Email/password signup handler (optional for new users)
	  const handleSignup = async () => {
		try {
		  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		  setUser(userCredential.user);
		} catch (error) {
		  setError(error.message);
		}
	  };

	async function registerUser(event) {
		event.preventDefault();

		const response = await fetch('http://localhost:8000/api/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				phone,
				password,
				repassword,
			}),
		});

		const data = await response.json();

		if (data.status === 'ok') {
			navigate.push('/login');
		}
	}

	return (
		<div className="super__signup">
			<Link to="/">
				<RiCloseFill
					size={41}
					className="fixed top-3 right-14 text-gray-500 cursor-pointer hover:text-[#582066] "
				/>
			</Link>
			<div className="super__login-header">
				<h1>Sign Up</h1>
				<p>
					Already registered? <Link to="/login"><span className='font-bold text-base'>Sign In</span></Link>
				</p>
			</div>
			{errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }
			<div className="w-full pl-10 pr-10 md:w-1/3 lg:w-1/4">
				<div className="relative flex items-center mt-5 mb-4 text-gray-500 focus-within:text-gray-700">
					<RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
					<input
						type="text"
						ref={nameRef} 
						// value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Name"
						className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
					/>
				</div>
				{/* <div className="relative flex items-center mb-4 text-gray-500 focus-within:text-gray-700">
					<RiPhoneFill size={18} className="h-5 w-5 absolute ml-3" />
					<input
						type="number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="Phone"
						className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full custom-number-input"
						style={{
							appearance: 'textfield',
							MozAppearance: 'textfield',
							WebkitAppearance: 'none',
						  }}
					/>
				</div> */}
				<div className="relative flex items-center mb-4 text-gray-500 focus-within:text-gray-700">
					<RiMailFill size={18} className="h-5 w-5 absolute ml-3" />
					<input
						type="email"
						ref={emailRef}
						// value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
					/>
				</div>
				<div className="relative flex items-center mb-4 text-gray-500 focus-within:text-gray-700">
					<RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
					<input
						type="password"
						ref={passwordRef}
						// value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
					/>
				</div>
				<div className="relative flex items-center text-gray-500 focus-within:text-gray-700">
					<RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
					<input
						type="password"
						ref={passwordConfirmationRef}
						// value={repassword}
						onChange={(e) => setRePassword(e.target.value)}
						placeholder="Repeat Password"
						className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
					/>
				</div>
				{/* <div className="super__signup-form">
					<button type="submit" onClick={registerUser} className="form-submit">
						Sign Up
					</button>
				</div> */}
				{/* <div className="super__signup-form"> */}
				<button
					type="submit"
					onClick={onSubmit}
					className=" pr-3 py-4 my-6 border bg-[#0c503fc9] text-[#ddd] border-gray-400 rounded-lg w-full"
				>
					Sign Up
				</button>
				{/* </div> */}
				<div className="solid" />
			</div>

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
