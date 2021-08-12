import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

import "./assets/scss/main.scss";

const RecipeList = lazy(() => import('./components/RecipeList/RecipeList'));
const RecipeAdd = lazy(() => import('./components/RecipeAdd/RecipeAdd'));
const Recipe = lazy(() => import('./components/Recipe/Recipe'));
const SignIn = lazy(() => import('./components/SignIn/SignIn'));

function App() {
	return (
		<div className="App wrapper">
			<div>
				<Header />
				<Router>
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							<Route path="/account/signin">
								<SignIn />
							</Route>
							<Route path="/add">
								<RecipeAdd />
							</Route>
							<Route path="/recipe/:recipeTitle">
								<Recipe />
							</Route>
							<Route path="/category/:recipeCategory">
								<RecipeList />
							</Route>
							<Route>
								<RecipeList />
							</Route>
						</Switch>
					</Suspense>
				</Router>
			</div>
			<Footer />
		</div>
	);
}

export default App;
