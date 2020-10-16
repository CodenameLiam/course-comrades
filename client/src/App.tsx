import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Home, Login, PageNotFound } from "./Pages";
import logo from './logo.svg';
import './App.css';
import { firebaseConfig } from './FireBaseConfig';
import * as firebase from 'firebase/app';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />

                    <Route path="/404" component={PageNotFound} />
                    <Redirect to="/404" />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
