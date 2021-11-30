import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Home = () => {
	const [user] = useAuthState(auth);
	const [userName, setUserName] = useState('');
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user && loading === false) {
			database.ref('users').child(user.uid).once('value', function (snapshot) {
				const data = snapshot.val();
				setUserName(data.firstName);
			});
		}
	}, [user, loading]);	
	
	useEffect(() => {
		database.ref('recipes').once('value', function (snapshot) {
			let recipeArr = [];
			snapshot.forEach(recipe => {
				recipeArr.push(recipe.val());
			});
			setRecipes(recipeArr);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<p>Just a moment while we finish cooking ...</p>
		)
	}

	return (
		<div className="home">
			<div className="home__title">
				<h1>Welcome{userName && <span>, {userName}</span>}!</h1>
			</div>

			<div className="home__latest">
				<h2>Latest Recipes</h2>
				<ul>
					{recipes
						.sort((a, b) => a.added < b.added ? 1 : -1)
						.slice(0, 5)
						.map(recipe => {
						return (
							<li key={recipe.key}>
								<Link className="link" to={`/recipe/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link>
							</li>
						)
					})}	
				</ul>
				<Link className="btn btn--primary" to={`/recipes`}>View All Recipes</Link>
			</div>
				
			<div className="home__favorites">
				<h2>Most Popular Recipes</h2>
				<ul>
					{recipes
						.sort((a, b) => a.favorited < b.favorited ? 1 : -1)
						.slice(0, 5)
						.map(recipe => {
						return (
							<li key={recipe.key}>
								<Link className="link" to={`/recipe/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link>
							</li>
						)
					})}	
				</ul>				
			</div>
		</div>
	);
}

export default Home;