import React, { useState, useEffect } from "react";
import {useParams, Link} from 'react-router-dom';

import database from '../../services/firebase';
import { Loader } from "../Loader/Loader";

const RecipeList = () => {
	const [isLoading, setLoading] = useState(true);
	const [recipes, setRecipes] = useState([]);
	const { recipeCategory } = useParams();
	const [pageTitle, setPageTitle] = useState();

	useEffect(() => {
		setLoading(true);
		database.ref('recipes').on('value', function(snapshot){
			let data = snapshot.val();
			if (recipeCategory) {
				const results = data.filter((recipe) => {
					return recipe.category.toLowerCase().replace(/\s/g, '-') === recipeCategory;
				});
				setRecipes(results);
				setPageTitle(recipeCategory + ' Recipes');
				setLoading(false);
			}
			else {
				setRecipes(data);
				setPageTitle('All Recipes');
				setLoading(false);
			}
		});
	}, [recipeCategory]);

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