import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import NewPlaces from "./places/pages/NewPlaces";
import UserPlaces from "./places/pages/UserPlaces";
import Map from "./shared/components/UIElements/Map";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./users/pages/Users";

function App() {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact component={Users} />
          <Route path="/places/new" exact component={NewPlaces} />
          <Route path="/:userId/places" exact component={UserPlaces} />
          <Route path="/map" exact component={Map} />
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
