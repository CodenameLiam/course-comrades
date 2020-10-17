import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Home, Login, PageNotFound } from "./Pages";
import { firebaseConfig } from "./FireBaseConfig";
import * as firebase from "firebase/app";
import PrivateRoute from "./Components/Navigation/PrivateRoute";
import useAuth from "./Hooks/useAuth";
import PageSpinner from "./Components/Spinners/PageSpinner";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
	return useAuth() ? (
		<div className="App">
			<Router>
				<Switch>
					<PrivateRoute exact path="/" component={Home} />
					<Route path="/login" component={Login} />

					<Route path="/404" component={PageNotFound} />
					<Redirect to="/404" />
				</Switch>
			</Router>
		</div>
	) : (
		<PageSpinner />
	);
}

export default App;
