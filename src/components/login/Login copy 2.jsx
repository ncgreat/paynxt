import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IonButton, IonInput, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import { RiUser3Fill, RiLockPasswordFill, RiCloseFill } from 'react-icons/ri';
import { useGoogleLogin } from '@react-oauth/google';
import { Dialog } from '@capacitor/dialog';
import { DealContext } from '../../DealContext';
import jwt_decode from 'jwt-decode';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { loginUserAPI, registerGoogleAccountAPI } from '../services/apiService';
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
		// const response = await fetch('http://node.micigbea.com:3080/api/login', {

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
			// alert('Please check your username and password');
			Dialog.alert({
				title: 'Error',
				message: 'Please check your username and password...',
			  });
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

				<button
					type="submit"
					className="pr-3 py-4 my-3 border bg-[#582066] text-[#ddd] border-gray-400 rounded-lg w-full"
					onClick={loginUser}
				>
					Login
				</button>

				<div className=" flex w-full items-center my-4 solid before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
					<p className="text-center mx-4 mb-0">OR</p>
				</div>

				<button
					type="button"
					onClick={() => login()}
					className="flex p-3 py-4 border border-gray-400 rounded-lg w-full justify-center"
				>
					<FcGoogle size={18} className="mt-1" />
					<span className="ml-3">Sign in with Google</span>
				</button>
			</div>
		</div>
	);
};

export default Login;
