import React, { useState } from "react";
import {Link} from 'react-router-dom';
import { useForm } from "react-hook-form";

import database from '../../services/firebase';

const UserRegister = () => {
	const [userAdded, setUserAdded] = useState(false);
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		let random = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
		database.ref('users')
			.child(Math.round(random))
			.set({
				key: Math.round(random),
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password
			})
			.then(
				setUserAdded(true),
		)
		.catch()
	}

	if (userAdded) {
        return (
            <div>
				<p>Your account was created!</p>
				<p><Link to={`/`}>View Recipes</Link></p>
            </div>
        );
	}

	return (
		<div className="account">
			<form className="account__form" onSubmit={handleSubmit(onSubmit)}>
				<fieldset>
					<label htmlFor="firstName">First Name</label>
					<input id="firstName" name="firstName" type="text" placeholder="First Name" {...register('firstName', { required: true })} />
					{errors.firstName && <p className="error">Your first name is required.</p>}
				</fieldset>
				<fieldset>
					<label htmlFor="lastName">Last Name</label>
					<input id="lastName" name="lastName" type="text" placeholder="Last Name" {...register('lastName', { required: true })} />
					{errors.lastName && <p className="error">Your last name is required.</p>}
				</fieldset>
				<fieldset>
					<label htmlFor="email">Email address</label>
					<input id="email" name="email" type="email" placeholder="user@email.com" {...register('email', { required: true })} />
					{errors.email && <p className="error">Your email address is required.</p>}
				</fieldset>
				<fieldset>
					<label htmlFor="password">Password (must be at least 7 characters)</label>
					<input id="password" name="password" type="password" placeholder="********" minlength="7" {...register('password', { required: true })} />
					{errors.password && <p className="error">A password is required.</p>}
				</fieldset>				
				<button className="btn btn--submit" type="submit">Create Account</button>
			</form>
		</div>
	);
}

export default UserRegister;