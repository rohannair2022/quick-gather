import React from "react";
import { Form } from "react-bootstrap";

const Signup = () => {
  return (
    <div className="signup" style={{ margin: 50 }}>
      <div className="form">
        <h1>Sign-up Page</h1>
        <form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              style={{ width: 250 }}
              placeholder="Your Username"
            />
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              style={{ width: 250 }}
              placeholder="Your Email"
            />
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              style={{ width: 250 }}
              placeholder="Your Password"
            />
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default Signup;
