import React, { useState } from "react";
import database from '../../services/firebase';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
	
	const onChange = (event) => {
		const {name, value} = event.currentTarget;

		if (name === 'userEmail') {
			setEmail(value);
		}
		else if (name === 'userPassword'){
			setPassword(value);
		}
	};

	const submitForm = (e) => {
		e.preventDefault();
		setErrorMsg('');
		database.app.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			console.log(userCredential.user);
		})
		.catch((error) => {
			if (error.code === 'auth/invalid-email') {
				setErrorMsg('Please enter a valid email address.');
			}
			else if (error.code === 'auth/wrong-password') {
				setErrorMsg('Please enter a valid password.');
			}
			else if (error.code === 'auth/user-not-found') {
				setErrorMsg('Sorry, an account with that user name and password cannot be found.');
			}
		});
	}

	return (
		<div className="sign-in">
			<h2>Sign In</h2>
			<form>
				<fieldset>
					<label htmlFor="userEmail">
						Email:
					</label>
					<input
						type="email"
						name="userEmail"
						value = {email}
						placeholder="email@gmail.com"
						id="userEmail"
						onChange = {(event) => onChange(event)}
					/>
				</fieldset>
				<fieldset>
					<label htmlFor="userPassword">
						Password:
					</label>
					<input
						type="password"
						name="userPassword"
						value = {password}
						placeholder="Your Password"
						id="userPassword"
						onChange = {(event) => onChange(event)}
					/>
				</fieldset>
				<p className="error">{errorMsg}</p>
				<button
					className="btn btn--submit"
					onClick={(event) => { submitForm(event, email, password) }}>
					Sign in
				</button>
			</form>
		</div>
	);
}

export default SignIn;