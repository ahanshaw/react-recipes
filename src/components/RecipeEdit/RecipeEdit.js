import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";

import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const RecipeEdit = () => {
	const {recipeKey} = useParams();
	const [recipe, setRecipe] = useState([]);

	useEffect(() => {
		database.ref('recipes').child(recipeKey).on('value', function (snapshot) {
			setRecipe(snapshot.val());
		});
	}, [recipeKey]);

	console.log('recipe ', recipe);

	const [user] = useAuthState(auth);
	const [recipeUpdated, setRecipeUpdated] = useState(false);

	const { control, reset, register, formState: { errors }, handleSubmit } = useForm();

	useEffect(() => {
		reset({
			title: recipe.title,
			servings: recipe.servings,
			category: recipe.category,
			tags: recipe.tags,
			ingredients: recipe.ingredients,
			instructions: recipe.instructions,
			notes: recipe.notes
		});
	}, [reset, recipe.title, recipe.servings, recipe.category, recipe.tags, recipe.ingredients, recipe.instructions, recipe.notes ]);

	const {
		fields: tagsFields,
		append: tagsAppend,
		remove: tagsRemove
	} = useFieldArray({ control, name: 'tags' });

	const {
		fields: ingredientsFields,
		append: ingredientsAppend,
		remove: ingredientsRemove
	} = useFieldArray({ control, name: 'ingredients' });
	
	const {
		fields: instructionsFields,
		append: instructionsAppend,
		remove: instructionsRemove
	} = useFieldArray({ control, name: 'instructions' });

	const onSubmit = (data) => {
		database.ref('recipes')
			.child(recipe.key)
			.update({
				title: data.title,
				tags: data.tags,
				servings: data.servings,
				notes: data.notes,
				instructions: data.instructions,
				ingredients: data.ingredients,
				category: data.category
			})
			.then(
				setRecipeUpdated(true),
		)
		.catch()
	}

	const continueEditing = (e) => {
		e.preventDefault();
		setRecipeUpdated(false);
	}

	if (!user){
        return (
           <Link to={`/account/login`}>Log In</Link>
        );
	}
	
	if (user.uid !== recipe.user && !recipeUpdated) {
		return (
			<div>
				<p>Sorry, you can&#8217;t edit {recipe.title}.</p>
				<p><Link to={`/`}>Return home</Link>.</p>
			</div>
        );
	}

	if (user.uid === recipe.user && !recipeUpdated) {
		return (
			<div className="recipe-add">
				<form className="recipe-add__form" onSubmit={handleSubmit(onSubmit)}>
					<div className="recipe-add__form__title">
						<fieldset>
							<label htmlFor="title">Title</label>
							<input id="title" name="title" type="text" placeholder="Recipe title" {...register('title', { required: true })}/>
							{errors.title && <p className="error">A recipe title is required.</p>}
						</fieldset>
					</div>
					<div className="recipe-add__form__main">
						<fieldset>
							<legend>Ingredients</legend>
							{ingredientsFields.map((field, index) => (
								<div className="recipe-add__form__ingredients" key={field.id}>
									<div className="recipe-add__form__ingredients__quantity">
										<label htmlFor={`quantity${index}`}>Quantity</label>
										<input
											type="number"
											{...register(`ingredients.${index}.quantity`, { required: true })}
											id={`quantity${index}`}
											placeholder="1"
											step="0.01"
											defaultValue={field.quantity}
										/>
									</div>
									<div className="recipe-add__form__ingredients__measurement">
										<label htmlFor={`measurement${index}`}>Measurement</label>
										<input
											{...register(`ingredients.${index}.measurement`)}
											id={`measurement${index}`}
											placeholder="cup"
											defaultValue={field.measurement}
										/>
									</div>
									<div className="recipe-add__form__ingredients__item">
										<label htmlFor={`item${index}`}>Ingredient</label>
										<input
											{...register(`ingredients.${index}.item`, { required: true })}
											id={`item${index}`}
											placeholder="flour"
											defaultValue={field.item}
										/>
									</div>
									<button className="remove" type="button" onClick={() => ingredientsRemove(index)}>
										&ndash;
									</button>
									{errors.ingredients && <p className="error">Please add a quantity and an ingredient.</p>}
								</div>
							))}
							<button
								type="button"
								className="btn btn--add"
								onClick={() => {
									ingredientsAppend({ quantity: '', measurement: '', item: '' });
								}}
							>
								Add Ingredient
							</button>
						</fieldset>
						<fieldset>
							<legend>Instructions</legend>
							{instructionsFields.map((field, index) => (
								<div className="recipe-add__form__instructions" key={field.id}>
									<div className="recipe-add__form__instructions__item">
										<label htmlFor={`instructions${index}`}>Step {index + 1}</label>
										<textarea
											{...register(`instructions.${index}.step`, { required: true })}
											id={`instructions${index}`}
											placeholder="Add at least one step."
											defaultValue={field.step}
										></textarea>
									</div>
									<button className="remove" type="button" onClick={() => instructionsRemove(index)}>
										&ndash;
									</button>
									{errors.instructions && <p className="error">Please include instructions.</p>}
								</div>
							))}
							<button
								type="button"
								className="btn btn--add"
								onClick={() => {
									instructionsAppend({ step: '' });
								}}
							>
								Add Step
							</button>
						</fieldset>
						<fieldset>
							<div className="recipe-add__form__notes">
								<label htmlFor="notes">Notes</label>
								<textarea id="notes" name="notes" placeholder="Optional notes." {...register('notes')}></textarea>
							</div>
						</fieldset>
						<button className="btn btn--submit" type="submit">Update Recipe</button>
					</div>
					<div className="recipe-add__form__cats">
						<fieldset>
							<div className="recipe-add__form__cats__servings">
								<label htmlFor="servings">Number of Servings</label>
								<input id="servings" name="servings" placeholder="2" type="number" {...register('servings', { min: 1 })} />
							</div>
							{errors.servings && <p className="error">Must have at least one serving.</p>}
						</fieldset>
						<fieldset>
							<div className="recipe-add__form__cats__cat">
								<label htmlFor="category">Category</label>
								<select id="category" name="category" {...register('category', { required: true })}>
									<option value="">Choose a Category</option>
									<option value="beverages">Beverages</option>
									<option value="breads">Breads</option>
									<option value="breakfast">Breakfast</option>
									<option value="desserts">Desserts</option>
									<option value="main">Main</option>
									<option value="sauce">Sauce</option>
									<option value="side">Side</option>
									<option value="soup">Soup</option>
									<option value="other">Other</option>
								</select>
							</div>
							{errors.category && <p className="error">A recipe category is required.</p>}
						</fieldset>
						<fieldset>
							<legend>Tags</legend>
							{tagsFields.map((field, index) => (
								<div className="recipe-add__form__tags" key={field.id}>
									<div className="recipe-add__form__tags__tag">
										<label className="sr-only" htmlFor={`tags${index}`}>Tag</label>
										<input
											{...register(`tags.${index}.tag`)}
											id={`tags${index}`}
											placeholder="optional tag"
											defaultValue={field[index]}
										/>
									</div>
									<button className="remove" type="button" onClick={() => tagsRemove(index)}>
										&ndash;
									</button>
								</div>
							))}
							<button
								type="button"
								className="btn btn--add"
								onClick={() => {
									tagsAppend({ tag: '' });
								}}
							>
								Add Tag
							</button>
						</fieldset>
					</div>
				</form>
			</div>
		);
	}

	if (recipeUpdated) {
        return (
            <div>
				<p>Recipe updated!</p>
				<button onClick={continueEditing}>Return to Editing Recipe</button>
			</div>
        );
	}

	return (
		<p>Recipe loading.</p>
	)
}

export default RecipeEdit;