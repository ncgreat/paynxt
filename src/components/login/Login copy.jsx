import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import { DealContext } from '../../DealContext';
import jwt_decode from 'jwt-decode';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import './login.css';

const Login = () => {
	const navigate = useNavigate();
	const { loggedUser, setLoggedUser } = useContext(DealContext);
	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState([]);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function loginUser(event) {
		event.preventDefault();

		const response = await fetch('http://localhost:3080/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});

		const data = await response.json();
		console.log(data);

		if (data.user) {
			localStorage.setItem('token', data.user);
			// localStorage.setItem('wallet', data.wallet.available_balance);
			var decoded = jwt_decode(data.user);
			console.log(decoded);
			// alert('Login successful');
			// setProfile(res.data);
			setLoggedUser({
				...loggedUser,
				loggedUser: decoded,
			});
			localStorage.setItem('loggedUser', JSON.stringify(decoded));
			navigate('/dashboard', { replace: true });
		} else {
			alert('Please check your username and password');
		}
	}

	useEffect(() => {
		if (user.access_token) {
			axios
				.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${user.access_token}`,
							Accept: 'application/json',
						},
					},
				)
				.then((res) => {
					// setProfile(res.data);
					// setLoggedUser({
					// 	...loggedUser,
					// 	loggedUser: res.data,
					// });
					// localStorage.setItem('loggedUser', JSON.stringify(res.data));
					const userData = res.data;
					registerGoogleAccount(userData);
					// navigate('/dashboard', { replace: true });
				})
				.catch((err) => console.log(err));
		}
	}, [user.access_token]);

	const registerGoogleAccount = async (userData) => {
		// console.log(userData);
		try {
			// console.log(userData);
			const response = await fetch('http://localhost:3080/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: userData.name,
					email: userData.email,
					signin_type: 'google',
				}),
			});
			const data = await response.json();
			// console.log(data);
			localStorage.setItem('token', data.user);
			// localStorage.setItem('wallet', data.wallet.available_balance);
			var decoded = jwt_decode(data.user);
			// console.log(decoded);
			// alert('Login successful');
			// setProfile(res.data);
			setLoggedUser({
				...loggedUser,
				loggedUser: decoded,
			});
			localStorage.setItem('loggedUser', JSON.stringify(decoded));
			navigate('/dashboard', { replace: true });
		} catch (error) {
			// alert('Error:', error);
		}
	};

	const login = useGoogleLogin({
		onSuccess: (codeResponse) => setUser(codeResponse),
	});

	return (
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
					Not registered? <Link to="/sign-up">Sign Up</Link>
				</p>
			</div>

			<div className="relative flex items-center mb-5 lg:w-1/5 md:w-1/3 sm:w-1/2 text-gray-500 focus-within:text-gray-700">
				<RiUser3Fill size={18} className="h-5 w-5 absolute ml-3" />
				<input
					type="email"
					placeholder="Email"
					onChange={(e) => setEmail(e.target.value)}
					className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
				/>
			</div>
			<div className="relative flex items-center lg:w-1/5 md:w-1/3 sm:w-1/2 text-gray-500 focus-within:text-gray-700">
				<RiLockPasswordFill size={18} className="h-5 w-5 absolute ml-3" />
				<input
					type="password"
					placeholder="Password"
					onChange={(e) => setPassword(e.target.value)}
					className="pr-3 pl-10 py-2 border border-gray-400 rounded-lg w-full"
				/>
			</div>
			<div className="super__login-form ">
				<button
					type="submit"
					// className="form-submit"
					className=" bg-[#582066] p-3 border-[#ddd] text-[#f4eff6] rounded-md lg:w-full md:w-1/2 sm:w-1/2"
					onClick={loginUser}
				>
					Login
				</button>
			</div>
			{/* <div className="solid" /> */}
			<div className=" flex items-center my-4 solid before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
				<p className="text-center mx-4 mb-0">OR</p>
			</div>
			<div className="super__google-form ">
				<button
					type="button"
					onClick={() => login()}
					className="single-sign-on"
				>
					<FcGoogle size={18} className="sign-on-btn" />
					<span className="sign-on-text">Sign in with Google</span>
				</button>

				{/* {isLoggedIn ? (
					<GoogleLogin
						onSuccess={responseGoogle}
						onError={() => {
							console.log('Login Failed');
						}}
					/>
				) : (
					<button
						type="button"
						onClick={() => logout()}
						className="single-sign-on"
					>
						<FcGoogle size={18} className="sign-on-btn" />
						<span className="sign-on-text">Logout</span>
					</button>
				)} */}
			</div>
		</div>
	);
};

export default Login;
