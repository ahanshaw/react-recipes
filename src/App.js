import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';

import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { RecipeList } from "./components/RecipeList/RecipeList";

import "./assets/scss/main.scss";

function App() {
	return (
		<div className="App">
			<Header />
			<Router>
				<RecipeList />
			</Router>
			<Footer />
		</div>
	);
}

export default App;
