import Page1 from "./Pages/Page1";
import Page2 from "./Pages/Page2";
import Page3 from "./Pages/Page3";
import Page4 from "./Pages/Page4";
import Register from "./Pages/Register";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import ProtectedRoute from "./Routes/ProtectedRoute";
import SimpleRoute from "./Routes/SimpleRoute";

function Navigator(props) {
  console.log("in Navigator : ", props);
  return (
    <Router>
      <Switch>
        <SimpleRoute path="/" exact component={Page1} />
        <SimpleRoute path="/register" exact component={Register} />
        <ProtectedRoute path="/ready" exact component={Page2} />
        <ProtectedRoute path="/room" exact component={Page3} />
        <ProtectedRoute path="/test" state={props.state} exact component={Page4} />

      </Switch>
    </Router>
  );
}

export default Navigator;
