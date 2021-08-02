import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';
import database from '../../services/firebase';

export function Recipe() {
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
		<>
			{recipe.map(recipe => {
				return (
					<div key={recipe.id} className="recipe-list">
						<h2>{recipe.title}</h2>
						<p><Link to={`/category/${recipe.category.toLowerCase().replace(/\s/g, '-')}`}>{recipe.category}</Link></p>
						<p>Servings: {recipe.servings}</p>
						<h3>Ingredients</h3>
						{recipe.ingredients.map((ingredient, index) => {
							return (
								<p key={index}>{ingredient.ingredientQuantity} {ingredient.ingredientMeasurement} {ingredient.ingredientItem}</p>
							)
						})}
						<h3>Instructions</h3>
						{recipe.instructions.map((step, index) => {
							return (
								<p key={index}>{index + 1}. {step.step}</p>
							)
						})}
						<h3>Notes</h3>
						<p>{recipe.notes}</p>
					</div>
				)
			})}
		</>
	);
}
