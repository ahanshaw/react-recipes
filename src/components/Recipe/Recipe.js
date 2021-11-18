import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from 'react-router-dom';
import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Recipe = () => {
	const [user, loading] = useAuthState(auth);
	const {recipeKey} = useParams();
	const [recipe, setRecipe] = useState([]);
	const [recipeLoaded, setRecipeLoaded] = useState(false);
	const [verifyDeletion, setVerifyDeletion] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);
	const [numFavorites, setNumFavorites] = useState('');
	let history = useHistory();

	useEffect(() => {
		database.ref('recipes').child(recipeKey).on('value', function (snapshot) {
			setRecipe(snapshot.val());
			if (snapshot.val()) {
				setNumFavorites(snapshot.val().favorited);
			}
			setRecipeLoaded(true);
		});
		if (user && loading === false) {
			database.ref('users').child(user.uid).child('favorites').once('value', function (snapshot) {
				let favorites = [];
				snapshot.forEach(recipe => {
					favorites.push(recipe.val().key);
				});
				if (favorites.toString().includes(recipeKey.toString())) {
					setIsFavorite(true);
				}
			});
		}
	}, [user, loading, recipeKey]);

	const toggleFavorite = (e) => {
		e.preventDefault();

		if (isFavorite === false) {
			database.ref('users')
			.child(user.uid)
			.child('favorites')
			.child(recipe.key)
			.set({
				key: recipe.key,
				title: recipe.title,
			})
			.then(
				setIsFavorite(true)
			)
			.catch()

			database.ref('recipes')
			.child(recipeKey)
			.update({
				favorited: numFavorites + 1,
			})
			.then()
			.catch()	
		}
		else {
			database.ref('users')
			.child(user.uid)
			.child('favorites')
			.child(recipe.key)
			.remove()
			.then(
				setIsFavorite(false)
			)
			.catch()

			if (numFavorites > 0) {
				database.ref('recipes')
				.child(recipeKey)
				.update({
					favorited: numFavorites - 1,
				})
				.then()
				.catch()
			}
		}
	}

	const confirmDelete = (e) => {
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
					{user &&
						<button className={isFavorite ? 'btn btn--favorite favorited' : 'btn btn--favorite' } onClick={toggleFavorite}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 -2 28 28"><path d="M12 4.419c-2.826-5.695-11.999-4.064-11.999 3.27 0 7.27 9.903 10.938 11.999 15.311 2.096-4.373 12-8.041 12-15.311 0-7.327-9.17-8.972-12-3.27z" /></svg>
						</button>
					}
					<h1>{recipe.title}</h1>
				</div>
				<div className="recipe__admin">
					{user && user.uid === recipe.user &&
						<>
						<p><Link className="btn btn--primary" to={`/edit/${recipe.key}/${recipe.title.toLowerCase().replace(/\s/g, '-')}`}>Edit Recipe</Link></p>
						{!verifyDeletion &&
							<button className="btn btn--secondary" onClick={confirmDelete}>Delete Recipe</button>
						}
						</>
					}
					{verifyDeletion &&
						<>
							<p className="warning">Are you sure? This cannot be undone.</p>
							<button className="btn btn--secondary" onClick={permanentDelete}>Yes, Delete</button>
							<button className="cancel-delete link" onClick={cancelDelete}>Cancel</button>
						</>
					}
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