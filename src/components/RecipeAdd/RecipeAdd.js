import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useForm, useFieldArray } from "react-hook-form";

import { database } from '../../services/firebase';
import { auth } from '../../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const RecipeAdd = () => {
	const [user] = useAuthState(auth);
	const [recipeAdded, setRecipeAdded] = useState(false);
	const [recipeTitle, setRecipeTitle] = useState('');
	const [recipeKey, setRecipeKey] = useState('');
	
	const { control, reset, register, formState: { errors }, handleSubmit } = useForm({
		defaultValues: {
			tags: [{tag: ''}],
			ingredients: [{ quantity: '', measurement: '', item: '' }],
			instructions: [{ step: '' }],
		}
	});

	useEffect(() => {
		reset({
			title: '',
			servings: '',
			category: '',
			tags: [{tag: ''}],
			ingredients: [{ quantity: '', measurement: '', item: '' }],
			instructions: [{ step: '' }],
			notes: ''
		});
	}, [reset, recipeAdded]);

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
		let random = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
		setRecipeKey(random);
		database.ref('recipes')
		.child(Math.round(random))
		.set({
			key: Math.round(random),
			user: user.uid,
			added: Date.now(),
			title: data.title,
			tags: data.tags,
			servings: data.servings,
			notes: data.notes,
			instructions: data.instructions,
			ingredients: data.ingredients,
			category: data.category,
			favorited: 0
		})
		.then(
			setRecipeAdded(true)
		)
		.catch()
	}

	const handleTitle = (e) => {
		const title = e.target.value;
		setRecipeTitle(title);
	}

	const addNewRecipe = (e) => {
		setRecipeAdded(false);
	}
	
	if (recipeAdded) {
        return (
            <div>
				<p>Hurray! <Link className="link" to={`/recipe/${recipeKey}/${recipeTitle.toLowerCase().replace(/\s/g, '-')}`}> {recipeTitle}</Link> has been added!</p>
				<p><button className="btn btn--primary" onClick={addNewRecipe}>Add another recipe</button></p>
            </div>
        );
	}

	if (!user){
        return (
           <Link to={`/account/login`}>Log In</Link>
        );
	}
	
	return (
		<form className="recipe-form" onSubmit={handleSubmit(onSubmit)}>
			<div className="recipe-form__title">
				<p className="required">*Required fields.</p>
				<fieldset className="fieldset-padded">
					<label htmlFor="title">Title*</label>
					<input id="title" name="title" type="text" placeholder="Recipe title" {...register('title', { required: true })} onKeyUp = {(event) => handleTitle(event)} />
					{errors.title && <p className="error error-padded">Please add a recipe title.</p>}
				</fieldset>
			</div>

			<div className="recipe-form__main">
				<fieldset>
					<legend>Ingredients*</legend>
					{ingredientsFields.map((field, index) => (
						<div className="recipe-form__ingredient" key={field.id}>
							<div className="recipe-form__ingredient__quantity">
								<label htmlFor={`quantity${index}`}>Quantity</label>
								<input
									type="text"
									{...register(`ingredients.${index}.quantity`, {required: true})}
									id={`quantity${index}`}
									placeholder="1"
									defaultValue={field.quantity}
								/>
							</div>
							<div className="recipe-form__ingredient__measurement">
								<label htmlFor={`measurement${index}`}>Measurement</label>
								<input
									{...register(`ingredients.${index}.measurement`)}
									id={`measurement${index}`}
									placeholder="cup"
									defaultValue={field.measurement}
								/>
							</div>
							<div className="recipe-form__ingredient__item">
								<label htmlFor={`item${index}`}>Ingredient</label>
								<input
									{...register(`ingredients.${index}.item`, { required: true })}
									id={`item${index}`}
									placeholder="flour"
									defaultValue={field.item}
								/>
							</div>
							{ingredientsFields.length > 1 &&
								<div className="recipe-form__ingredient__remove">
									<button className="remove" type="button" onClick={() => ingredientsRemove(index)}>+</button>
								</div>
							}
							{errors.ingredients && <p className="error error-padded">Please add a quantity and an ingredient.</p>}
						</div>
					))}
					<button
						type="button"
						className="btn btn--add"
						onClick={() => ingredientsAppend({ quantity: '', measurement: '', item: ''  })}>
						Add Ingredient
					</button>
				</fieldset>

				<fieldset>
					<legend>Instructions*</legend>
					{instructionsFields.map((field, index) => (
						<div className="recipe-form__instruction" key={field.id}>
							<div className="recipe-form__instruction__step">
								<label htmlFor={`instructions${index}`}>Step {index + 1}</label>
								<textarea
									{...register(`instructions.${index}.step`, { required: true })}
									id={`instructions${index}`}
									placeholder="Add at least one step."
									defaultValue={field.step}
								></textarea>
							</div>
							{instructionsFields.length > 1 &&
								<div className="recipe-form__instruction__remove">
									<button className="remove" type="button" onClick={() => instructionsRemove(index)}>+</button>
								</div>
							}
							{errors.instructions && <p className="error">Please include instructions.</p>}
						</div>
					))}
					<button
						type="button"
						className="btn btn--add"
						onClick={() => instructionsAppend({ step: '' })}>
						Add Step
					</button>
				</fieldset>

				<fieldset className="fieldset-padded">
					<label htmlFor="notes">Notes</label>
					<textarea id="notes" name="notes" placeholder="Optional notes." {...register('notes')}></textarea>
				</fieldset>
			</div>

			<div className="recipe-form__side">
				<fieldset className="fieldset-padded">
					<label htmlFor="servings">Number of Servings*</label>
					<input id="servings" name="servings" placeholder="2" type="number" {...register('servings', { min: 1 })} />
					{errors.servings && <p className="error">Must have at least one serving.</p>}
				</fieldset>

				<fieldset className="fieldset-padded">
					<label htmlFor="category">Category*</label>
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
					{errors.category && <p className="error error-padded">Please select a category.</p>}
				</fieldset>

				<fieldset>
					<legend>Tags</legend>
					{tagsFields.map((field, index) => (
						<div className="recipe-form__tag" key={field.id}>
							<div className="recipe-form__tag__item">
								<label className="sr-only" htmlFor={`tags${index}`}>Tag</label>
								<input
									{...register(`tags.${index}.tag`)}
									id={`tags${index}`}
									placeholder="optional tag"
									defaultValue={field[index]}
								/>
							</div>
							{tagsFields.length > 1 &&
								<div className="recipe-form__tag__remove">
									<button className="remove" type="button" onClick={() => tagsRemove(index)}>+</button>
								</div>
							}
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
			<div className="recipe-form__submit">
				<button className="btn btn--primary" type="submit">Add Recipe</button>
				<Link className="btn btn--secondary" to={`/account/dashboard`}>Cancel</Link>
			</div>
		</form>
	);
}

export default RecipeAdd;