import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import registration from '../css/registration.css';
import { Redirect } from 'react-router-dom';
//form for registration
class Registration extends React.Component {
  state = {
    user: false,
    username: '',
    passwordLogin: '',
    password: '',
    confirmedPassword: '',
    emailAddress: '',
    alternateEmail: '',
    role: 'user',
    createAccount: false,
  };

  submitBtn = () => {
    if (this.state.password !== this.state.confirmedPassword) {
      return alert('Password is incorrect');
    } else if (this.state.username === '' || this.state.password === '') {
      alert('Error !');
    } else {
      let initial = {
        username: this.state.username,
        emailAddress: this.state.emailAddress,
        password: this.state.password,
        role: this.state.role,
      };
      console.log(initial);
      // return;
      axios.post(this.props.url + '/register', initial).then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          alert('Welcome, you may now login!');
          console.log(res.data);
          this.setState({ redirect: true });
        }
      });
    }
  };

  loginBtn = () => {
    if (this.state.passwordLogin == '' || this.state.alternateEmail == '') {
      return;
    }
    let credential = {
      username: this.state.alternateEmail,
      password: this.state.passwordLogin,
    };
    // return console.log(credential);
    axios.post(this.props.url + '/login', credential).then((user) => {
      if (user.data.error) {
        return alert(user.data.error);
      } else {
        this.props.saveMyAccount(user.data.user);
        localStorage.setItem('token', user.data.token);
        console.log(user.data);
        alert('Welcome ' + user.data.user.username + ' !');
        this.setState({ user: true });
      }
    });
  };

  render() {
    console.log(this.props.url);
    return (
      <>
        {this.state.user && <Redirect to="/posts" />}
        <div className="main-container">
          <div className="wrapper">
            <div className="div-thoughts">
              <h3>DEV Thoughts</h3>
              <p>Share and Learn </p>
            </div>
            <div className="mini-container login-container">
              <input
                placeholder="Username or Email"
                className="input-username"
                type="text"
                required
                value={this.state.alternateEmail}
                onChange={(e) =>
                  this.setState({ alternateEmail: e.target.value })
                }
              ></input>
              <br />
              <input
                placeholder="Password"
                className="input-password"
                type="password"
                required
                value={this.state.passwordLogin}
                onChange={(e) => {
                  this.setState({ passwordLogin: e.target.value });
                }}
              ></input>
              <br />
              <div className="div-for-login">
                <button className="login-btn" onClick={this.loginBtn}>
                  Log In
                </button>
              </div>

              <div className="div-for-create-account">
                <button
                  className="new-account-btn"
                  onClick={() => {
                    this.setState({
                      createAccount: true,
                    });
                  }}
                >
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.state.createAccount ? (
          <div className="main-modal">
            <div className="mini-modal">
              <div className="mini-container signup-container">
                <div className="signuptext">
                  <h3 className="p-sign-up">Sign Up</h3>
                  <p>It's quick and easy.</p>
                  <span
                    onClick={() => {
                      this.setState({
                        createAccount: false,
                      });
                    }}
                  >
                    X
                  </span>
                </div>
                <div className="signup-info-wrapper">
                  <label>Username</label>
                  <br />
                  <input
                    className="input-username"
                    type="text"
                    required
                    value={this.state.username}
                    onChange={(e) =>
                      this.setState({ username: e.target.value })
                    }
                  ></input>
                  <br />
                  <label>Email Address</label>
                  <br />
                  <input
                    className="input-email"
                    type="email"
                    required
                    value={this.state.emailAddress}
                    onChange={(e) =>
                      this.setState({ emailAddress: e.target.value })
                    }
                  ></input>
                  <br />
                  <label>Password</label>
                  <br />
                  <input
                    className="input-password"
                    type="password"
                    required
                    value={this.state.password}
                    onChange={(e) => {
                      this.setState({ password: e.target.value });
                    }}
                  ></input>
                  <br />
                  <label>Confirm Password</label>
                  <br />
                  <input
                    className="input-password confirm"
                    type="password"
                    required
                    value={this.state.confirmedPassword}
                    onChange={(e) => {
                      this.setState({ confirmedPassword: e.target.value });
                    }}
                  ></input>
                  <br />
                  <div className="div-for-submit">
                    <button className="submitBtn" onClick={this.submitBtn}>
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    user: '',
    url: store.url,
  };
};
const mapDispatcToProps = (dispatch) => {
  return {
    saveMyAccount: (myAccount) =>
      dispatch({
        type: 'SAVE_ACCOUNT',
        payload: myAccount,
      }),
  };
};
export default connect(mapStateToProps, mapDispatcToProps)(Registration);
