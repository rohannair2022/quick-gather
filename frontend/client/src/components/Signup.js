import React from "react";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitForm = (data) => {
    console.log(data);
    reset();
  };

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
              // Using the form hook -> var name, rules for the input
              {...register("username", {
                required: true,
                maxLenght: 25,
                minLength: 6,
              })}
            />
          </Form.Group>
          {errors.username && (
            <span style={{ color: "red" }}>Username Required</span>
          )}
          {errors.username?.type == "maxLength" && (
            <span style={{ color: "red" }}>
              {" "}
              max lenght of characters is 25
            </span>
          )}
          {errors.username?.type == "minLength" && (
            <span style={{ color: "red" }}> min lenght of characters is 6</span>
          )}
          <br></br>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              style={{ width: 250 }}
              placeholder="Your Email"
              {...register("email", { required: true, maxLenght: 80 })}
            />
          </Form.Group>
          {errors.email && <span style={{ color: "red" }}>Email Required</span>}
          <br></br>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              style={{ width: 250 }}
              placeholder="Your Password"
              {...register("password", {
                required: true,
                maxLenght: 20,
                minLength: 6,
              })}
            />
          </Form.Group>
          {errors.password && (
            <span style={{ color: "red" }}>Password Required</span>
          )}
          {errors.password?.type == "maxLength" && (
            <span style={{ color: "red" }}>
              {" "}
              max lenght of characters is 20
            </span>
          )}
          {errors.password?.type == "minLength" && (
            <span style={{ color: "red" }}> min lenght of characters is 6</span>
          )}
          <br></br>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              style={{ width: 250 }}
              placeholder="Your Confirmed Password"
              {...register("confirm", {
                required: true,
                maxLenght: 20,
                minLength: 6,
              })}
            />
          </Form.Group>
          {errors.confirm && (
            <span style={{ color: "red" }}>Passwords do not match</span>
          )}
          <br></br>
          <Form.Group>
            <Button
              as="sub"
              variant="primary"
              onClick={handleSubmit(submitForm)}
            >
              Sign-Up
            </Button>
          </Form.Group>
          <br></br>
          <Form.Group>
            <small>
              Already have an account?<Link to="/login"> Log-in</Link>
            </small>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default Signup;
