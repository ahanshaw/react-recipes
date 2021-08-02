import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

import database from '../../services/firebase';

export function RecipeList() {
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		database.ref('recipes').on('value', function(snapshot){
			let data = snapshot.val();
			setRecipes(data);
		});
	}, []);

	return (
		<>
			{recipes.map((recipe, index) => {
				return (
					<div key={index} className="recipe-list">
						<h2><Link to={`/recipe/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link></h2>
					</div>
				)
			})}
		</>
	);
}
