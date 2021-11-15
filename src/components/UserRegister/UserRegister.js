import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../services/firebase';
import { auth, logout } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserRegister() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [user] = useAuthState(auth);

	const [error, setError] = useState(null);
	const [userExists, setUserExists] = useState(false);
	const [resetSent, setResetSent] = useState(false);
	const [registered, setRegistered] = useState(false);

	const createUserWithEmailAndPassword = async (e, email, password) => {
		e.preventDefault();
			setResetSent(false);
			setRegistered(false);
		try {
			await auth.createUserWithEmailAndPassword(email, password);
			setRegistered(true);
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

	const addUser = (reg) => {
		database.ref('users')
			.child(reg.uid)
			.set(reg)
			.then()
			.catch()
	};

	if (user && registered) {
		let reg = {
			uid: user.uid,
			firstName: firstName,
			lastName: lastName,
			email: user.email,
			verified: false
		}
		addUser(reg);
	}

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
				<fieldset>
					<label htmlFor="firstName">First Name</label>
					<input
						type="text"
						id="firstName"
						className="login__textBox"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						placeholder="First Name"
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="lastName">Last Name</label>
					<input
						type="text"
						id="lastName"
						className="login__textBox"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						placeholder="Last Name"
					/>	
				</fieldset>
				<fieldset>
					<label htmlFor="email">Email Address</label>
					<input
						type="email"
						id="email"
						className="login__textBox"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="E-mail Address"
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="password">Password (must have at least 6 characters)</label>
					<input
						type="password"
						id="password"
						className="login__textBox"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
					/>
				</fieldset>
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