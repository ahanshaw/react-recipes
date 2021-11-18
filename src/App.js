import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Loader } from "./components/Loader/Loader";

import "./assets/scss/main.scss";

const Home = lazy(() => import('./components/Home/Home'));
const RecipeList = lazy(() => import('./components/RecipeList/RecipeList'));
const RecipeAdd = lazy(() => import('./components/RecipeAdd/RecipeAdd'));
const RecipeEdit = lazy(() => import('./components/RecipeEdit/RecipeEdit'));
const Recipe = lazy(() => import('./components/Recipe/Recipe'));
const UserRegister = lazy(() => import('./components/UserRegister/UserRegister'));
const UserLogin = lazy(() => import('./components/UserLogin/UserLogin'));
const UserPasswordReset = lazy(() => import('./components/UserPasswordReset/UserPasswordReset'));
const UserDashboard = lazy(() => import('./components/UserDashboard/UserDashboard'));

const App = () => {

	return (
		<div className="App wrapper">
			<div>
				<Header />
				<Router>
					<Suspense fallback={<Loader/>}>
						<Switch>
							<Route path="/account/login">
								<UserLogin />
							</Route>
							<Route path="/account/register">
								<UserRegister />
							</Route>
							<Route path="/account/reset">
								<UserPasswordReset />
							</Route>
							<Route path="/account/dashboard">
								<UserDashboard />
							</Route>
							<Route path="/add">
								<RecipeAdd />
							</Route>
							<Route path="/edit/:recipeKey/:recipeTitle">
								<RecipeEdit />
							</Route>
							<Route path="/recipe/:recipeKey/:recipeTitle">
								<Recipe />
							</Route>
							<Route path="/recipes">
								<RecipeList />
							</Route>
							<Route path="/category/:recipeCategory">
								<RecipeList />
							</Route>
							<Route path="/tag/:recipeTag">
								<RecipeList />
							</Route>							
							<Route>
								<Home />
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
