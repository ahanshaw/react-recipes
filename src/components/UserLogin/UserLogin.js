import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import { useForm } from "react-hook-form";

import database from '../../services/firebase';

const UserLogin = () => {
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [userId, setUserId] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const [correctEmail, setCorrectEmail] = useState(true);
	const [correctPassword, setCorrectPassword] = useState(true);
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		setEmail(data.email);
		setPassword(data.password);
	}

	useEffect(() => {
		database.ref('users').on('value', function (snapshot) {
			snapshot.forEach(user => {
				if (user.val().email === email) {
					setCorrectEmail(true);
					if (user.val().password === password) {
						setUserId(user.val().key);
						setCorrectPassword(true);
						setUserLoggedIn(true);
						return;
					}
					else {
						setCorrectPassword(false);
					}
				}
				else {
					setCorrectEmail(false);
				}
			});
		});
	}, [email, password]);

	if (userLoggedIn) {
        return (
            <div>
				<p>You are logged in!</p>
				<p><Link to={`/`}>View Recipes</Link></p>
            </div>
        );
	}

	return (
		<div className="account">
			<form className="account__form" onSubmit={handleSubmit(onSubmit)}>
				<fieldset>
					<label htmlFor="email">Email address</label>
					<input id="email" name="email" type="email" placeholder="user@email.com" {...register('email', { required: true })} />
					{errors.email && <p className="error">Your email address is required.</p>}
				</fieldset>
				<fieldset>
					<label htmlFor="password">Password (must be at least 7 characters)</label>
					<input id="password" name="password" type="password" placeholder="********" minLength="7" {...register('password', { required: true })} />
					{errors.password && <p className="error">A password is required.</p>}
				</fieldset>				
				<button className="btn btn--submit" type="submit">Login</button>
				{!correctEmail && <p className="error">No user was found with that email address.</p>}
				{!correctPassword && <p className="error">The password entered is incorrect.</p>}
			</form>
		</div>
	);
}

export default UserLogin;