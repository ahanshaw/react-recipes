import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';

import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
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
				<h1>Dashboard</h1>
				<p>Dashboard loading...</p>
			</div>
        );
    }

	if (user && recipes.length > 0) {
		return (
			<div className="dashboard">
				<h1>Dashboard</h1>
				<h2>My Recipes</h2>
				{recipes.map(recipe => {
					return (
						<p key={recipe.key}><Link to={`/recipe/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link></p>
					)
				})}
			</div>
        );
	}
	
	if (user && recipes.length < 1) {
		return (
			<div className="dashboard">
				<h1>Dashboard</h1>
				<p><Link to={`/add`}>Add a recipe</Link></p>
			</div>
        );
	}

	return (
		<Redirect to='/' />
	);
}