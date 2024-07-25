import React from "react";
import { Form, Button, Alert, Container, Col, Row } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
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
          localStorage.setItem(
            "username",
            JSON.stringify({ name: data.username })
          );
        } else {
          setShow(true);
          setServerResponse(data.message);
        }
      });
  };

  const [isHoveredLogin, setIsHoveredLogin] = useState(false);

  return (
    <Container fluid className="py-3 py-md-5 mt-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={6} className="text-center mt-3 mb-4 mb-lg-0">
          <img
            src={process.env.PUBLIC_URL + "/short_logo.png"}
            alt="Short Logo"
            className="img-fluid"
          />
        </Col>
        <Col xs={12} lg={6}>
          <div className="login p-3 p-md-5">
            <h1 className="mb-4">Log-In Page</h1>
            <Form onSubmit={handleSubmit(submitForm)}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Your Username"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <Form.Text className="text-danger">
                    Username Required
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Your Password"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <Form.Text className="text-danger">
                    Password Required
                  </Form.Text>
                )}
              </Form.Group>

              <Alert
                show={show}
                variant="danger"
                onClose={() => setShow(false)}
                dismissible
              >
                <Alert.Heading>Login Attempt</Alert.Heading>
                <p>{serverResponse}</p>
              </Alert>

              <Button
                type="submit"
                variant="primary"
                className="w-100 mb-3"
                style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "white",
                  backgroundColor: "#B3CCF5",
                  border: "none",
                  borderRadius: "5px",
                  boxShadow: "5px 3px 0 #333",
                  transition: "all 0.1s",
                  cursor: "pointer",
                  transform: isHoveredLogin ? "translateY(5px)" : "none",
                }}
                onMouseEnter={() => setIsHoveredLogin(true)}
                onMouseLeave={() => setIsHoveredLogin(false)}
              >
                Login
              </Button>

              <Form.Text className="text-muted">
                Don't have an account? <Link to="/signup">Sign-up</Link>
              </Form.Text>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
