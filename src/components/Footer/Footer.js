import React, { useState } from 'react';
import { auth, logout } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Footer() {
	const [user] = useAuthState(auth);

	return (
		<footer className="footer">
			<p>Recipes &copy; 2021</p>
			{user &&
				<div>
					<p><a href="/add">Add a Recipe</a></p>
					<button className="dashboard__btn" onClick={logout}>
						Logout
					</button>
				</div>
			}
			{!user && 
				<p><a href="/account/login">Log In</a></p>
			}
        </footer>
    );
}