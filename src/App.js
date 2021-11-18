import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";

import Home from "./components/Home/Home";
import RecipeList from "./components/RecipeList/RecipeList";
import RecipeAdd from "./components/RecipeAdd/RecipeAdd";
import RecipeEdit from "./components/RecipeEdit/RecipeEdit";
import Recipe from "./components/Recipe/Recipe";
import UserRegister from "./components/UserRegister/UserRegister";
import UserLogin from "./components/UserLogin/UserLogin";
import UserPasswordReset from "./components/UserPasswordReset/UserPasswordReset";
import UserDashboard from "./components/UserDashboard/UserDashboard";

import "./assets/scss/main.scss";

const App = () => {

	return (
		<div className="App wrapper">
			<div>
				<Header />
				<Router>
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
				</Router>
			</div>
			<Footer />
		</div>
	);
}

export default App;
