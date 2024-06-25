import React from "react";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const submitForm = () => {
    console.log("form submitted");

    // After dealing with the form
    setUsername("");
    setPassword("");
  };
  return (
    <div className="login" style={{ margin: 50 }}>
      <div className="form">
        <h1>Log-In Page</h1>
        <form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              style={{ width: 250 }}
              placeholder="Your Username"
              value={username}
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Group>
          <br></br>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              style={{ width: 250 }}
              placeholder="Your Password"
              value={password}
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Group>
          <br></br>
          <Form.Group>
            <Button as="sub" variant="primary" onClick={submitForm}>
              Sign-Up
            </Button>
          </Form.Group>
          <br></br>
          <Form.Group>
            <small>
              Do not have an account?<Link to="/signup"> Sign-up</Link>{" "}
            </small>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default Login;
