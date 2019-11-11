import React, { Component } from "react";
import { Router, Route, Link, NavLink, Switch } from "react-router-dom";
import logo from "./images/logo-32x32-white.png";
import Home from "./pages/home";
import Login from "./pages/login";
import ResetPassword from "./pages/resetPassword";
import CreateAccount from "./pages/createAccount";
import Application from "./pages/applicationForm";
import Review from "./pages/review";
import VerifyEmail from "./pages/verifyEmail";
import Profile from "./pages/profile";
import ReviewAssignment from "./pages/reviewAssignment";
import ReviewHistory from "./pages/reviewHistory";
import EventStats from "./pages/eventStats";
import { PrivateRoute } from "./components";
import UserDropdown from "./components/User";
import ReactGA from "react-ga";
import "./App.css";
import history from "./History";

ReactGA.initialize("UA-136093201-1", {
  debug: false,
  testMode: process.env.NODE_ENV === "test"
});

ReactGA.pageview(window.location.pathname + window.location.search);
history.listen((location, action) => {
  ReactGA.pageview(location.pathname + location.search);
});

const BUG_SUBJECT_TEXT = "I encountered an bug in Lytehouse!";
const BUG_BODY_TEXT = `Browser name and version:
What I was trying to do:
Description of problem: 
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      collapsed: true
    };

    this.refreshUser = this.refreshUser.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: JSON.parse(localStorage.getItem("user"))
    });
  }

  refreshUser() {
    this.setState({
      user: JSON.parse(localStorage.getItem("user"))
    });
  }

  toggleMenu = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  isEventAdmin = user => {
    if (!user) {
      return false;
    }
    return (
      user.is_admin || (user.roles && user.roles.some(r => r.role === "admin"))
    );
  };

  isEventReviewer = user => {
    if (!user) {
      return false;
    }
    return user.roles && user.roles.some(r => r.role === "reviewer");
  };

  render() {
    const bug_mailto =
      "mailto:hello@lyte-house.com?subject=" +
      encodeURI(BUG_SUBJECT_TEXT) +
      "&body=" +
      encodeURI(BUG_BODY_TEXT);

    return (
      <Router history={history}>
        <div>
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="/">
              <img
                src={logo}
                width="30"
                height="30"
                class="d-inline-block align-top"
                alt=""
              />
              Lytehouse
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon" />
            </button>
            <div
              class={
                "collapse navbar-collapse" +
                (this.state.collapsed ? " collapsed" : "")
              }
              id="navbarNav"
            >
              <ul class="navbar-nav mr-auto">
                <li class={"nav-item"}>
                  <NavLink
                    exact
                    to="/"
                    activeClassName="nav-link active"
                    className="nav-link"
                    onClick={this.toggleMenu}
                  >
                    Home
                  </NavLink>
                </li>
                {this.state.user && (
                  <li class="nav-item">
                    <NavLink
                      to="/applicationForm"
                      activeClassName="nav-link active"
                      className="nav-link"
                      onClick={this.toggleMenu}
                    >
                      Apply
                    </NavLink>
                  </li>
                )}
                {this.isEventAdmin(this.state.user) && (
                  <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Event Admin
                  </a>
                  <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <NavLink
                      to="/eventStats"
                      className="dropdown-item"
                      onClick={this.toggleMenu}
                    >
                      Event Stats
                    </NavLink>
                    <NavLink
                      to="/reviewAssignment"
                      className="dropdown-item"
                      onClick={this.toggleMenu}
                    >
                      Review Assignment
                    </NavLink>
                  </div>
                  </li>
                )}
                {this.isEventReviewer(this.state.user) && (
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Reviews
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                      <NavLink
                        to="/review"
                        className="dropdown-item"
                        onClick={this.toggleMenu}
                        >
                          Review
                      </NavLink>
                      <NavLink
                        to="/reviewHistory"
                        className="dropdown-item"
                        onClick={this.toggleMenu}
                      >
                        Review History
                      </NavLink>
                    </div>
                  </li>
                )}
              </ul>
              <UserDropdown
                logout={this.refreshUser}
                user={this.state.user}
                onClick={this.toggleMenu}
              />
            </div>
          </nav>
          <div class="Body">
            <div className="container-fluid">
              <Switch>
                <Route
                  exact
                  path="/"
                  render={props => <Home {...props} user={this.state.user} />}
                />
                <Route
                  exact
                  path="/login"
                  render={props => (
                    <Login {...props} loggedIn={this.refreshUser} />
                  )}
                />
                <Route
                  exact
                  path="/createAccount"
                  render={props => (
                    <CreateAccount {...props} loggedIn={this.refreshUser} />
                  )}
                />
                <Route
                  exact
                  path="/resetPassword"
                  render={props => (
                    <ResetPassword {...props} loggedIn={this.refreshUser} />
                  )}
                />
                <Route exact path="/verifyEmail" component={VerifyEmail} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute
                  exact
                  path="/applicationForm"
                  component={Application}
                />
                <PrivateRoute exact path="/eventStats" component={EventStats} />
                <PrivateRoute
                  exact
                  path="/reviewAssignment"
                  component={ReviewAssignment}
                />
                <PrivateRoute
                  exact
                  path="/reviewHistory"
                  component={ReviewHistory}
                />
                <PrivateRoute exact path="/review" component={Review} />
                <PrivateRoute exact path="/review/:id" component={Review} />
              </Switch>
            </div>
          </div>
          <footer class="text-muted">
            <div class="container-flex">
              <p>
                Lytehouse, © 2019 |{" "}
                <a href="http://www.lyte-house.com">
                  Find out more
                </a>{" "}
                |{" "}
                <a href={bug_mailto} class="btn btn-info float-right">
                  Report a Bug
                </a>
              </p>
            </div>
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
