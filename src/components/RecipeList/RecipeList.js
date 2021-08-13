import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';

import database from '../../services/firebase';
import { Loader } from "../Loader/Loader";

const RecipeList = () => {
	const [isLoading, setLoading] = useState(true);
	const [recipes, setRecipes] = useState([]);
	const {recipeCategory} = useParams();
	const {recipeTag} = useParams();
	const [pageTitle, setPageTitle] = useState();

	useEffect(() => {
		setLoading(true);
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
					if (recipe.val().tag.toLowerCase().replace(/\s/g, '-') === recipeTag) {
						recipeArr.push(recipe.val());
					}
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

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        );
	}

	return (
		<div className="recipe-list">
			<h1>{pageTitle}</h1>
			{recipes.map((recipe, index) => {
				return (
					<div key={index} className="recipe-list">
						<h2><Link to={`/recipe/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>{recipe.title}</Link></h2>
					</div>
				)
			})}				
		</div>
	);
}

export default RecipeList;