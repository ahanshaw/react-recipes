import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';
import database from '../../services/firebase';

import { Loader } from "../Loader/Loader";

const Recipe = () => {
	const [recipe, setRecipe] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const {recipeTitle} = useParams();

	useEffect(() => {
		setLoading(true);
		database.ref('recipes').once('value', function (snapshot) {
			let recipeArr = [];
			snapshot.forEach(recipe => {
				if (recipe.val().title.toLowerCase().replace(/\s/g, '-') === recipeTitle) {
					recipeArr.push(recipe.val());
				}
			});
			setRecipe(recipeArr);
			setLoading(false);
		});
	}, [recipeTitle]);

	if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
	}
	
	return (
		<div className="recipe">
			{recipe.map((recipe, index) => {
				return (
					<div key={index} className="recipe-list">
						<h1>{recipe.title}</h1>
						<p className="recipe__category">Category: <Link to={`/category/${recipe.category.toLowerCase().replace(/\s/g, '-')}`}>{recipe.category}</Link></p>
						<p>Servings: {recipe.servings}</p>
						<h2>Ingredients</h2>
						<table className="recipe__ingredients">
							<tbody>
								{recipe.ingredients.map((ingredient, index) => {
									return (
										<tr key={index}>
											<td>{ingredient.quantity}</td>
											<td>{ingredient.measurement}</td>
											<td>{ingredient.item}</td>
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