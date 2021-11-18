import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserLogin() {
	const [user] = useAuthState(auth);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const signInWithEmailAndPassword = async (e, email, password) => {
		e.preventDefault();
		try {
			await auth.signInWithEmailAndPassword(email, password);
		} catch (err) {
			console.error(err);
			if (err.code === 'auth/user-not-found') {;
				setError('An account with this email address does not exist.');
			}
			if (err.code === 'auth/invalid-email') {;
				setError('Please enter a valid email address.');
			}
			if (err.code === 'auth/wrong-password') {;
				setError('The password you entered is incorrect.');
			}
		}
	};	

	if (user) {
		return <Redirect to='/account/dashboard' />
    }

	return (
		<div className="account">
			<div className="account__title">
				<h1>Log In</h1>
			</div>
			<div className="account__side">

			</div>
			<div className="account__content">
				<form onSubmit={(e) => signInWithEmailAndPassword(e, email, password)}>
					<fieldset>
						<label for="">Email</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="E-mail Address"
						/>
					</fieldset>
					<fieldset>
						<label for="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
						/>
					</fieldset>
					<button className="btn btn--primary">Log In</button>
					{error && 
						<p className="error">{error}</p>
					}
					<p><Link className="link" to={`/account/reset`}>Forgot your password?</Link></p>
					<p><Link className="link" to={`/account/register`}>Need to create an account?</Link></p>
				</form>
			</div>
		</div>
	);
}