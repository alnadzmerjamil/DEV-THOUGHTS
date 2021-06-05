import logo from './logo.svg';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// components
import AddPost from './components/AddPost';
import Registration from './components/Registration';

// css
import poststyle from './css/poststyle.css';
class App extends React.Component {
  state = {
    userTab: false,
  };
  componentDidMount = () => {
    axios.get(this.props.url + '/getposts').then((posts) => {
      console.log(posts.data);
      this.props.dispatchPOsts(posts.data);
    });
  };
  logoutHandler = () => {
    if (window.confirm('Are you sure you to log out?')) {
      this.props.logOut('logout');
    }
    this.setState({
      userTab: false,
    });
  };
  render() {
    return (
      <div className="App">
        <nav className="main-nav">
          <div className="title">
            <span id="dev">DEV</span>
            <span id="thoughts">thoughts</span>
          </div>
          <div className="user-right-side">
            <div
              className="lg-screen"
              onClick={() => {
                this.setState({
                  userTab: !this.state.userTab,
                });
              }}
            >
              {this.props.user ? (
                <span className="user-profile-right">
                  {this.props.user.username.slice(0, 1).toUpperCase()}
                </span>
              ) : (
                <span className="user-profile-right">?</span>
              )}
            </div>
            <div
              className="sml-screen"
              onClick={() => {
                this.setState({
                  userTab: !this.state.userTab,
                });
              }}
            >
              <i className="fas fa-bars"></i>
            </div>
            {this.state.userTab ? (
              <div
                className="user-tab-container"
                onClick={() => {
                  this.setState({
                    userTab: !this.state.userTab,
                  });
                }}
              >
                <div className="user-tab">
                  <div className="user-profile-tab">
                    <p>
                      {this.props.user ? this.props.user.username : 'Unknown'}
                    </p>
                    <p id="email-tab">
                      @{' '}
                      {this.props.user
                        ? this.props.user.emailAddress
                        : 'email unavailable'}
                    </p>
                  </div>
                  <div className="user-mini-tab">
                    {this.props.user ? (
                      <p id="signout-tab" onClick={this.logoutHandler}>
                        SIGN OUT
                      </p>
                    ) : (
                      <p className="signup-signin-tab">
                        <Link
                          to="/register"
                          className="link link-signup"
                          onClick={() => {
                            this.setState({
                              userTab: false,
                            });
                          }}
                        >
                          SIGN UP
                        </Link>
                        <Link
                          to="/register"
                          className="link link-signin"
                          onClick={() => {
                            this.setState({
                              userTab: false,
                            });
                          }}
                        >
                          SIGN IN
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </nav>

        <Route exact path="/posts">
          <AddPost />
        </Route>
        <Route exact path="/register">
          <Registration />
        </Route>
      </div>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    url: store.url,
    user: store.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchPOsts: (posts) =>
      dispatch({
        type: 'POSTS_TO_STORE',
        payload: posts,
      }),
    logOut: (logout) =>
      dispatch({
        type: 'LOG_OUT',
        payload: logout,
      }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
