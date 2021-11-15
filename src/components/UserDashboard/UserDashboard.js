import {Link } from 'react-router-dom';

import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserDashboard() {
	const [user] = useAuthState(auth);

	if (user) {
		return (
		<div className="dashboard">
			<h1>Dashboard</h1>
		</div>
        );
    }

	return (
		<div className="dashboard">
			<h1>Dashboard</h1>
			<p><Link to={`/account/login`}>Log In</Link></p>
			<p><Link to={`/account/register`}>Register</Link></p>
		</div>
	);
}