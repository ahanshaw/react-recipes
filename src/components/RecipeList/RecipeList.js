import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';

import { database } from '../../services/firebase';

const RecipeList = () => {
	const [recipes, setRecipes] = useState([]);
	const {recipeCategory} = useParams();
	const {recipeTag} = useParams();
	const [pageTitle, setPageTitle] = useState('All Recipes');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		database.ref('recipes').once('value', function (snapshot) {
			let recipeArr = [];
			if (recipeCategory) {
				setPageTitle(recipeCategory + ' Recipes');
				snapshot.forEach(recipe => {
					if (recipe.val().category.toLowerCase().replace(/\s/g, '-') === recipeCategory) {
						recipeArr.push(recipe.val());
					}
				});
			}
			else if (recipeTag) {
				setPageTitle(recipeTag + ' Recipes');
				snapshot.forEach(recipe => {
					recipe.val().tags.forEach(tag => {
						if (tag.tag.toLowerCase().replace(/\s/g, '-') === recipeTag) {
							recipeArr.push(recipe.val());
						}
					});
				});
			}
			else {
				snapshot.forEach(recipe => {
					recipeArr.push(recipe.val());
				});
			}
			setRecipes(recipeArr);
			setLoading(false);
		});
	}, [recipeCategory, recipeTag]);

	if (loading) {
		return (
			<p>Just a moment while we finish cooking ...</p>
		)
	}

	return (
		<div className="recipe-list">
			<h1>{pageTitle}</h1>
			<ul>
				{recipes
					.sort((a, b) => a.added < b.added ? 1:-1)
					.map(recipe => {
					return (
						<li key={recipe.key}>
							<Link className="link" to={`/recipe/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link>
						</li>
					)
				})}	
			</ul>			
		</div>
	);
}

export default RecipeList;