import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

import "./assets/scss/main.scss";

const RecipeList = lazy(() => import('./components/RecipeList/RecipeList'));
const Recipe = lazy(() => import('./components/Recipe/Recipe'));

function App() {
	return (
		<div className="App wrapper">
			<div>
				<Header />
				<Router>
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
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
