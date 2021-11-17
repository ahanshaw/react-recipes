import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom';
import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Recipe = () => {
	const [user] = useAuthState(auth);
	const {recipeKey} = useParams();
	const [recipe, setRecipe] = useState([]);
	const [recipeLoaded, setRecipeLoaded] = useState(false);
	const [verifyDeletion, setVerifyDeletion] = useState(false);
	let history = useHistory();

	useEffect(() => {
		database.ref('recipes').child(recipeKey).on('value', function (snapshot) {
			setRecipe(snapshot.val());
			setRecipeLoaded(true);
		});
	}, [recipeKey]);

	const togglePermanentDelete = (e) => {
		e.preventDefault();
		setVerifyDeletion(true);
	}

	const permanentDelete = () => {
		database.ref('recipes').child(recipeKey).remove();
		history.push("/account/dashboard");
	}

	const cancelDelete = () => {
		setVerifyDeletion(false);
	}

	if (!recipeLoaded) {
        return (
            <div>
				<p>Recipe loading...</p>
			</div>
        );
	}
	
	return (
		<div className="recipe">
			<div className="recipe__container">
				<div className="recipe__title">
					<h1>{recipe.title}</h1>
				</div>
				<div className="recipe__side">
					<div className="detail">
						<h2>Servings</h2>
						<p>{recipe.servings}</p>
					</div>
					
					<div className="detail">
						<h2>Category</h2>
						<p><Link className="link" to={`/category/${recipe.category.toLowerCase().replace(/\s/g, '-')}`}>{recipe.category}</Link></p>
					</div>

					{recipe.tags &&
						<div className="detail">
							<h2>Tags</h2>
							<ul>
								{recipe.tags.map((tag, index) => {
									return (
										<li key={index}>
											<Link className="link" key={index} to={`/tag/${tag.tag.toLowerCase().replace(/\s/g, '-')}`}>{tag.tag}</Link>
										</li>
									)
								})}
							</ul>
						</div>
					}

					{user && user.uid === recipe.user &&
						<>
						<p><Link className="btn btn--primary" to={`/edit/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>Edit Recipe</Link></p>
						{!verifyDeletion &&
							<button className="btn btn--secondary" onClick={togglePermanentDelete}>Delete Recipe</button>
						}
						</>
					}
					{verifyDeletion &&
						<>
							<p className="warning">Are you sure? This cannot be undone.</p>
							<button className="btn btn--secondary" onClick={permanentDelete}>Yes, Delete</button>
							<button className="link" onClick={cancelDelete}>Cancel</button>
						</>
					}
				</div>
				<div className="recipe__main">
					<h2>Ingredients</h2>			
					{recipe.ingredients.map((ingredient, index) => {
						return (
							<p key={index}>{ingredient.quantity} {ingredient.measurement} {ingredient.item}
							</p>
						)
					})}
					<h2>Instructions</h2>
					<ol>
						{recipe.instructions.map((step, index) => {
							return (
								<li key={index}> {step.step}</li>
							)
						})}
					</ol>
					{recipe.notes &&
						<>
							<h2>Notes</h2>
							<p>{recipe.notes}</p>
						</>
					}
				</div>
			</div>
		</div>
	);
}

export default Recipe;