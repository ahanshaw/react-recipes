import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { RecipeList } from "./components/RecipeList/RecipeList";
import { Recipe } from "./components/Recipe/Recipe";

import "./assets/scss/main.scss";

function App() {
	return (
		<div className="App">
			<Header />
			<Router>
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
			</Router>
			<Footer />
		</div>
	);
}

export default App;
