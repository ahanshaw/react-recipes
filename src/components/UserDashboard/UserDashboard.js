import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';

import { database } from '../../services/firebase';
import { auth, logout } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserDashboard() {
	const [user, loading] = useAuthState(auth);
	const [recipes, setRecipes] = useState([]);
	const [favorites, setFavorites] = useState([]);

	useEffect(() => {
		if (user && loading === false) {
			database.ref('recipes').once('value', function (snapshot) {
				let recipeArr = [];
				snapshot.forEach(recipe => {
					if (recipe.val().user === user.uid) {
						let userRecipe = {
							'title': recipe.val().title,
							'key': recipe.val().key,
							'added': recipe.val().added,
						}
						recipeArr.push(userRecipe);
					}
				});
				setRecipes(recipeArr);
			});
		
			database.ref('users').child(user.uid).child('favorites').once('value', function (snapshot) {
				let recipeArr = [];
				snapshot.forEach(recipe => {
					let userRecipe = {
						'title': recipe.val().title,
						'key': recipe.val().key,
					}
					recipeArr.push(userRecipe);
				});
				setFavorites(recipeArr);
			});
		}
	}, [user, loading]);

	if (loading) {
		return (
			<div className="dashboard">
				<h1>My Dashboard</h1>
				<p>Dashboard loading...</p>
			</div>
        );
    }

	if (user) {
		return (
			<div className="dashboard">
				<div className="dashboard__title">
					<h1>My Dashboard</h1>
				</div>

				<div className="dashboard__admin">
					<p><Link className="btn btn--primary" to={`/add`}>Add a recipe</Link></p>
					<p><button className="link" onClick={logout}>
						Log Out
					</button></p>					
				</div>					

				<div className="dashboard__recipes">
					<h2>My Recipes</h2>
					{recipes.length > 0 &&
						recipes
						.sort((a, b) => a.added < b.added ? 1:-1)
						.map(recipe => {
							return (
								<p key={recipe.key}><Link className="link" to={`/recipe/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link></p>
							)
						})
					}
					{recipes.length < 1 &&
						<p>Looks like you haven&#8217;t added any recipes yet.</p>
					}
				</div>

				<div className="dashboard__favorites">
					<h2>My Favorites</h2>
					{favorites.length > 0 &&
						favorites
						.map(favorite => {
							return (
								<p key={favorite.key}><Link className="link" to={`/recipe/${favorite.key}/${favorite.title.toLowerCase().replace(/\s/g, '-')}`}>{favorite.title}</Link></p>
							)
						})
					}
					{favorites.length < 1 &&
						<p>Looks like you haven&#8217;t favorited any recipes yet.</p>
					}					
				</div>			
			</div>
        );
	}

	return (
		<Redirect to='/' />
	);
}