import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Home, Note, MyNotes, LikedNotes, Login, PageNotFound } from "./Pages";
import { firebaseConfig } from "./FirebaseConfig";
import PrivateRoute from "./Components/Navigation/PrivateRoute";
import useAuth from "./Hooks/useAuth";
import PageSpinner from "./Components/Spinners/PageSpinner";
import * as firebase from "firebase/app";
import Register from "./Pages/Register";
import SearchNotes from "./Pages/SearchNotes";
import { ToastContainer } from "react-toastify";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  return useAuth() ? (
    <div className="App">
      <ToastContainer />
      <Router>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute path="/note/:id" component={Note} />
          <PrivateRoute path="/my-notes" component={MyNotes} />
          <PrivateRoute path="/liked-notes" component={LikedNotes} />
          <PrivateRoute path="/search-notes" component={SearchNotes} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
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
