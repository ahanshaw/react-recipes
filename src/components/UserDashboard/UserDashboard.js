import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';

import { database } from '../../services/firebase';
import { auth, logout } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserDashboard() {
	const [user, loading] = useAuthState(auth);
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		database.ref('recipes').once('value', function (snapshot) {
			if (user && loading === false) {
				let recipeArr = [];
				snapshot.forEach(recipe => {
					if (recipe.val().user === user.uid) {
						let userRecipe = {
							'title': recipe.val().title,
							'key': recipe.val().key
						}
						recipeArr.push(userRecipe);
					}
				});
				setRecipes(recipeArr);
			}
		});
	}, [user, loading]);

	if (loading) {
		return (
			<div className="dashboard">
				<h1>My Dashboard</h1>
				<p>Dashboard loading...</p>
			</div>
        );
    }

	if (user && recipes.length > 0) {
		return (
			<div className="dashboard">
				<div className="dashboard__title">
					<h1>My Dashboard</h1>
				</div>
				<div className="dashboard__side">
					<p><Link className="btn btn--primary" to={`/add`}>Add a recipe</Link></p>
					<p><button className="link" onClick={logout}>
						Log Out
					</button></p>
				</div>
				<div className="dashboard__content">
					<h2>My Recipes</h2>
					{recipes.map(recipe => {
						return (
							<p key={recipe.key}><Link className="link" to={`/recipe/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link></p>
						)
					})}
				</div>
			</div>
        );
	}
	
	if (user && recipes.length < 1) {
		return (
			<div className="dashboard">
				<div className="dashboard__title">
					<h1>My Dashboard</h1>
				</div>
				<div className="dashboard__side">
					<p><Link className="btn btn--primary" to={`/add`}>Add a recipe</Link></p>
					<p><button className="link" onClick={logout}>
						Log Out
					</button></p>
				</div>
				<div className="dashboard__content">
					<h2>My Recipes</h2>
					<p>Looks like you haven&#8217;t added any recipes yet.</p>
				</div>
			</div>
        );
	}

	return (
		<Redirect to='/' />
	);
}