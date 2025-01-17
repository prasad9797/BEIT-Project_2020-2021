import React from "react";
import { Form, Button, Row, Col, Navbar } from "react-bootstrap";
import "../CSS/login.css";
import "../CSS/animation.css";
import axios from "axios";
import FooterComp from "../Component/footer";
import { connect } from "react-redux";
import { SET_USER, SET_ADMIN, LOGOUT } from "../actions/types";
import { Redirect } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: "",
      isAdmin: false,
      errors: "",
      isValid: false,
      isAutheticating: false,
      isLoggedIn: false,
    };
  }

  async componentWillMount() {
    console.log(sessionStorage.getItem("jwtToken"));
    if (this.props.isAuthenticated) {
      this.setState({ isLoggedIn: true });
    } else {
      this.setState({ isLoggedIn: false });
    }
  }

  componentDidMount() {
    delete axios.defaults.headers.common["Authorization"];
  }

  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  isAdmin = () => {
    this.setState({
      isAdmin: !this.state.isAdmin,
    });
  };

  async validate() {
    await this.setState({
      error: "",
    });
    let isValid = true;
    if (this.state.email !== null) {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(this.state.email)) {
        isValid = false;
        this.setState({
          errors: "Please enter valid email address",
        });
      }
    }
    if (this.state.password === "") {
      isValid = false;
      this.setState({
        errors: "Please enter password",
      });
    }
    this.setState({
      isValid: isValid,
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({
      isAutheticating: true,
      errors: "",
    });
    await this.validate();
    if (this.state.isValid) {
      //console.log("validated");
      if (this.state.isAdmin) {
        //Call Admin route
        let auth = {
          email: this.state.email,
          password: this.state.password,
        };
        //console.log(this.state.isAdmin);
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}api/v1/auth`, auth)
          .then(async (res) => {
            await this.props.auth(true, res.data.data);
            //console.log(this.props.Admin);
            //console.log(res.data);
            axios.defaults.headers.common["Authorization"] = res.data.data;
            this.props.history.push("/admin/upload/svg");
            this.setState({});
          })
          .catch((err) => {
            this.setState({
              errors: err.response.data.message,
              isAutheticating: false,
            });
          });
      } else {
        //Call User route
        this.setState({
          errors: "",
        });
        let auth = {
          email: this.state.email,
          password: this.state.password,
        };
        axios
          .post(`${process.env.REACT_APP_BACKEND_URL}api/v1/auth/login`, auth)
          .then((res) => {
            //console.log(res.data);
            this.props.auth(false, res.data.data);
            axios.defaults.headers.common["Authorization"] = res.data.data;
            //console.log("User logged in!");
            this.props.history.push("/student/dashboard");
          })
          .catch((err) => {
            console.log(err.response);
            //console.log(this.state.isAutheticating);
            this.setState({
              errors: err.response.data.message,
              isAutheticating: false,
            });
          });
      }
    } else {
      this.setState({ isAutheticating: false });
    }
  };

  render() {
    return this.state.isLoggedIn === false ? (
      <section id="login">
        <div className="custom-nav slide-bottom">
          <Navbar variant="light">
            <Navbar.Brand href="/">Educhain</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          </Navbar>
        </div>
        <div className="rowWrapper">
          <Row
            sm={1}
            md={1}
            lg={1}
            xs={1}
            className="rowwa justify-content-center align-items-center"
          >
            <Col>
              <h2 className="header-title swing-in-left-fwd" align="center">
                Login
              </h2>
              <Form
                className="login-form login-fields"
                style={{ padding: "20px" }}
              >
                <Form.Group controlId="formBasicEmail">
                  <Form.Label className="swing-in-left-fwd">
                    Email address
                  </Form.Label>
                  <Form.Control
                    className="swing-in-left-fwd"
                    style={{ animationDelay: "0.2s" }}
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    onChange={this.changeHandler}
                  />
                  <Form.Text
                    className="text-muted swing-in-left-fwd"
                    style={{ animationDelay: "0.4s" }}
                  >
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label
                    className="swing-in-left-fwd"
                    style={{ animationDelay: "0.6s" }}
                  >
                    Password
                  </Form.Label>
                  <Form.Control
                    className="swing-in-left-fwd"
                    style={{ animationDelay: "0.8s" }}
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={this.changeHandler}
                  />
                </Form.Group>
                <Form.Check
                  className="swing-in-left-fwd"
                  style={{ animationDelay: "1s" }}
                  type="switch"
                  id="custom-switch"
                  label="Login as Admin (Toggle if Admin)"
                  name="isAdmin"
                  onChange={this.isAdmin}
                />
                <a
                  href="/signup"
                  className="no-account swing-in-left-fwd"
                  style={{ animationDelay: "1s" }}
                >
                  Don't have an account? Click here to create one!
                </a>
                <p align="center" className="error">
                  {this.state.errors}
                </p>
                <p
                  align="center"
                  className="swing-in-left-fwd"
                  style={{ animationDelay: "1.2s" }}
                >
                  {this.state.isAutheticating ? (
                    // <a
                    //   align="center"
                    //   style={{ backgroundColor: "transparent", padding: "0" }}
                    // >
                    //   Checking...
                    // </a>
                    <Button variant="primary" disabled>
                      {" "}
                      <a
                        align="center"
                        style={{ backgroundColor: "transparent", padding: "0" }}
                      >
                        Loading...
                      </a>
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={this.onSubmit}>
                      {" "}
                      <a
                        align="center"
                        style={{ backgroundColor: "transparent", padding: "0" }}
                      >
                        Submit
                      </a>
                    </Button>
                  )}
                </p>
              </Form>
            </Col>
          </Row>
        </div>
      </section>
    ) : (
      <Redirect to="/" />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
    Admin: state.Admin,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    auth: (isAdmin, jwtToken) => {
      if (isAdmin) {
        dispatch({ type: SET_ADMIN, token: jwtToken });
      } else {
        dispatch({ type: SET_USER, token: jwtToken });
      }
    },
    Logout: () => {
      dispatch({ type: LOGOUT });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
