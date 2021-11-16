import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Header() {
	const [user, loading] = useAuthState(auth);

	return (
		<header className="header">
			<p className="title">
				<a href="/">Recipe Fun with React!</a>
			</p>
			{user && loading === false &&
				<div className="admin">
					<p><a className="link" href="/account/dashboard">My Dashboard</a></p>
				</div>
			}
			{!user && loading === false &&
				<div className="admin">
					<p><a className="link" href="/account/login">Log In</a> <span className="divider">|</span> <a className="link" href="/account/register">Register</a></p>
				</div>
			}
		</header>
    );
}
