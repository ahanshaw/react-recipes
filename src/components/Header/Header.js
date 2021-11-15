import { auth, logout } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Header() {
	const [user] = useAuthState(auth);

	return (
		<header className="header">
			<p className="title">
				<a href="/">Recipe Fun with React!</a>
			</p>
			{user &&
				<div className="admin">
					<p><a href="/add">Add a Recipe</a></p>
					<p><button onClick={logout}>
						Logout
					</button></p>
				</div>
			}
			{!user &&
				<div className="admin">
					<p><a href="/account/login">Log In</a></p>
					<p><a href="/account/register">Register</a></p>
				</div>
			}
		</header>
    );
}
