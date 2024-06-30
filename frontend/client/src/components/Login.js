import React from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const submitForm = (data) => {
    const body = {
      username: data.username,
      password: data.password,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch("/auth/login", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Success") {
          console.log(data);
          login(data);
          navigate("/");
        } else {
          setShow(true);
          setServerResponse(data.message);
        }
      });
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
              {...register("username", { required: true })}
            />
          </Form.Group>
          {errors.username && (
            <span style={{ color: "red" }}>Username Required</span>
          )}
          <br></br>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              style={{ width: 250 }}
              placeholder="Your Password"
              {...register("password", { required: true })}
            />
          </Form.Group>
          {errors.password && (
            <span style={{ color: "red" }}>Password Required</span>
          )}
          <br></br>
          <Alert show={show} style={{ width: 250, background: "red" }}>
            <p>{serverResponse}</p>
            <hr />
            <div className="d-flex justify-content-start">
              <Button onClick={() => setShow(false)} variant="outline-success">
                Close me
              </Button>
            </div>
          </Alert>
          <Form.Group>
            <Button
              as="sub"
              variant="primary"
              onClick={handleSubmit(submitForm)}
            >
              Login
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
