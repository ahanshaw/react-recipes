import React, { useState } from 'react';
import {Link } from 'react-router-dom';
import { auth, logout } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user] = useAuthState(auth);

	const [error, setError] = useState(null);
	const [userExists, setUserExists] = useState(false);
	const [resetSent, setResetSent] = useState(false);

	const createUserWithEmailAndPassword = async (e, email, password) => {
		e.preventDefault();
		setResetSent(false);
		try {
			await auth.createUserWithEmailAndPassword(email, password);
		}
		catch (err) {
			console.log(err);
			if (err.code === 'auth/email-already-in-use') {
				setUserExists(true);
			}
			if (err.code === 'auth/invalid-email') {;
				setError('Please enter a valid email address.');
			}
			if (err.code === 'auth/weak-password') {
				setError('Your password must contain at least six characters.');
			}
		}
	};

	const sendPasswordResetEmail = async (e, email) => {
		e.preventDefault();
		try {
			await auth.sendPasswordResetEmail(email);
			setResetSent(true);
		}
		catch (err) {
			console.log(err);
		}
	};

	if (user) {
		return (
			<div>
				<button className="dashboard__btn" onClick={logout}>
					Logout
				</button>
				<Link to={`/add`}>Add a Recipe</Link>
			</div>
        );
    }

	return (
		<div className="account">
			<form onSubmit={(e) => createUserWithEmailAndPassword(e, email, password)}>
				<label htmlFor="email">Email Address</label>
				<input
					type="text"
					id="email"
					className="login__textBox"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="E-mail Address"
				/>
				<label htmlFor="password">Password (must have at least 6 characters)</label>
				<input
					type="password"
					id="password"
					className="login__textBox"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>
				<button className="login__btn">Create Account</button>
				{userExists && !resetSent &&
					<div>
						<p>An account with that email address already exists. <Link to={`/account/login`}>Log in</Link> or <button onClick={(e) => sendPasswordResetEmail(e, email)}>reset your password</button>.</p>
					</div>
				}
				{resetSent && 
					<p>Password reset sent! Check your email.</p>
				}
				{error && 
					<p className="error">{error}</p>
				}
			</form>
		</div>
	);
}