import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
//import {Link} from 'react-router-dom';

//import database from '../../services/firebase';

const RecipeAdd = () => {
	const [recipe, setRecipe] = useState();
	const { control, register, formState: { errors }, handleSubmit } = useForm({
		defaultValues: {
			tags: [{tag: ''}],
			ingredients: [{ quantity: '', measurement: '', item: '' }],
			instructions: [{step: ''}]
		}
	});

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
		setRecipe(data);
	} 

	return (
		<form className="form" onSubmit={handleSubmit(onSubmit)}>
			<div className="form__title">
				<fieldset>
					<label htmlFor="title">Title</label>
					<input id="title" name="title" type="text" {...register('title', { required: true })} />
					{errors.title && <p className="error">A recipe title is required.</p>}
				</fieldset>
			</div>
			<div className="form__main">
				<fieldset>
					<legend>Ingredients</legend>
					{ingredientsFields.map((field, index) => (
						<div className="form__ingredients" key={field.id}>
							<div className="form__ingredients__quantity">
								<label htmlFor={`quantity${index}`}>Quantity</label>
								<input
									type="number"
									{...register(`ingredients.${index}.quantity`, {required: true})}
									id={`quantity${index}`}
									defaultValue={field.quantity}
								/>
							</div>
							<div className="form__ingredients__measurement">
								<label htmlFor={`measurement${index}`}>Measurement</label>
								<input
									{...register(`ingredients.${index}.measurement`)}
									id={`measurement${index}`}
									defaultValue={field.measurement}
								/>
							</div>
							<div className="form__ingredients__item">
								<label htmlFor={`item${index}`}>Ingredient</label>
								<input
									{...register(`ingredients.${index}.item`, { required: true })}
									id={`item${index}`}
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
							ingredientsAppend({ quantity: '', measurement: '', item: ''  });
						}}
					>
						Add Ingredient
					</button>
				</fieldset>
				<fieldset>
					<legend>Instructions</legend>
					{instructionsFields.map((field, index) => (
						<div className="form__instructions" key={field.id}>
							<div className="form__instructions__item">
								<label htmlFor={`instructions${index}`}>Step {index + 1}</label>
								<textarea
									{...register(`instructions.${index}.step`, { required: true })}
									id={`instructions${index}`}
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
					<div className="form__notes">
						<label htmlFor="notes">Notes</label>
						<textarea id="notes" name="notes" {...register('notes')}></textarea>
					</div>
				</fieldset>
				<button className="btn btn--submit" type="submit">Add Recipe</button>
			</div>
			<div className="form__cats">
				<fieldset>
					<div className="form__cats__servings">
						<label htmlFor="servings">Number of Servings</label>
						<input id="servings" name="servings" type="number" {...register('servings', { min: 1 })} />
					</div>
					{errors.servings && <p className="error">Must have at least one serving.</p>}
				</fieldset>
				<fieldset>
					<div className="form__cats__cat">
						<label htmlFor="category">Category</label>
						<select id="category" name="category" {...register('category', { required: true })}>
							<option value="">Choose a Category</option>
							<option value="soup">Soup</option>
							<option value="other">Other</option>
						</select>
					</div>
					{errors.category && <p className="error">A recipe category is required.</p>}
				</fieldset>
				<fieldset>
					<legend>Tags</legend>
					{tagsFields.map((field, index) => (
						<div className="form__tags" key={field.id}>
							<div className="form__tags__tag">
								<label className="sr-only" htmlFor={`tags${index}`}>Tag</label>
								<input
									{...register(`tags.${index}.tag`)}
									id={`tags${index}`}
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
	);
}

export default RecipeAdd;