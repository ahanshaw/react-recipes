import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Recipe = () => {
	const [user] = useAuthState(auth);
	const {recipeKey} = useParams();
	const [recipe, setRecipe] = useState([]);
	const [recipeLoaded, setRecipeLoaded] = useState(false);

	useEffect(() => {
		database.ref('recipes').child(recipeKey).on('value', function (snapshot) {
			setRecipe(snapshot.val());
			setRecipeLoaded(true);
		});
	}, [recipeKey]);

	console.log('recipe ', recipe);

	if (!recipeLoaded) {
        return (
            <div>
				<p>Recipe loading...</p>
			</div>
        );
	}
	
	return (
		<div className="recipe">
			<div className="recipe-list">
				<h1>{recipe.title}</h1>
				{user && user.uid === recipe.user &&
					<Link to={`/edit/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>Edit Recipe</Link>
				}
				
				<p className="recipe__category">Category: <Link to={`/category/${recipe.category.toLowerCase().replace(/\s/g, '-')}`}>{recipe.category}</Link></p>
				<p className="recipe__tags">Tags: {recipe.tags.map((tag, index) => {
					return (
						<Link key={index} to={`/tag/${tag.tag.toLowerCase().replace(/\s/g, '-')}`}>{tag.tag}</Link>
					)
				})}</p>
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
		</div>
	);
}

export default Recipe;