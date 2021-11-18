import React, { useState } from 'react';
import {Link } from 'react-router-dom';
import { auth } from '../../services/firebase';

export default function UserPasswordReset() {
	const [email, setEmail] = useState("");
	const [resetSent, setResetSent] = useState(false);

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

	if (resetSent) {
		return (
			<div>
				<p>Password reset sent! Check your email.</p>
				<Link to={`/account/login`}>Log in</Link> 
			</div>
        );
    }

	return (
		<div className="account">
			<form onSubmit={(e) => sendPasswordResetEmail(e, email)}>
				<label htmlFor="email">Email Address</label>
				<input
					type="email"
					id="email"
					className="login__textBox"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="E-mail Address"
				/>
				<button className="login__btn">Reset Password</button>
			</form>
		</div>
	);
}