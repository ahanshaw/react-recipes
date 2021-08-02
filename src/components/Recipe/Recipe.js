import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';
import database from '../../services/firebase';

const Recipe = () => {
	const [recipe, setRecipe] = useState([]);
	const {recipeTitle} = useParams();

	useEffect(() => {
		database.ref('recipes').on('value', function(snapshot) {
			let data = snapshot.val();
			const results = data.filter((recipe) => {
				return recipe.title.toLowerCase().replace(/\s/g, '-') === recipeTitle;
			});
			setRecipe(results);
		});
	}, [recipeTitle]);

	return (
		<div className="recipe">
			{recipe.map(recipe => {
				return (
					<div key={recipe.id} className="recipe-list">
						<h1>{recipe.title}</h1>
						<p className="recipe__category">Category: <Link to={`/category/${recipe.category.toLowerCase().replace(/\s/g, '-')}`}>{recipe.category}</Link></p>
						<p>Servings: {recipe.servings}</p>
						<h2>Ingredients</h2>
						<table className="recipe__ingredients">
							<tbody>
								{recipe.ingredients.map((ingredient, index) => {
									return (
										<tr key={index}>
											<td>{ingredient.ingredientQuantity}</td>
											<td>{ingredient.ingredientMeasurement}</td>
											<td>{ingredient.ingredientItem}</td>
										</tr>
									)
								})}
							</tbody>
						</table>
						<h2>Instructions</h2>
						<ol className="recipe__instructions">
							{recipe.instructions.map((step, index) => {
								return (
									<li key={index}> {step.step}</li>
								)
							})}
						</ol>
						<h2>Notes</h2>
						<p className="recipe__notes">{recipe.notes}</p>
					</div>
				)
			})}
		</div>
	);
}

export default Recipe;