import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

import { database } from '../../services/firebase';

const Home = () => {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		database.ref('recipes').once('value', function (snapshot) {
			let recipeArr = [];
			snapshot.forEach(recipe => {
				recipeArr.push(recipe.val());
			});
			setRecipes(recipeArr);
		});
	}, []);

	return (
		<div className="home">
			<div className="home__title">
				<h1>Welcome!</h1>
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