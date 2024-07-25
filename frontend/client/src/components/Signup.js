import React from "react";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";

// We use Link to transition to the next component
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const Signup = () => {
  /* 
    register has several purposes:
      1) Defines the data that will be sent to the handleSubmit function 
      2) This is defined when creating the group/labels in the control section.
      3) Helps set the data in the errors. 

    handleSubmit is defined in the button onClick section which direct the function that deals
    with the form data with an argument of all the data registered in the form. 

    reset is used to remove all the elements from the form after submission. This helps 
    us to prevent doing unnessecary steps like create a state for each element that stores data 
    in the form. 
  */
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // To show the succesful message that takes place after creating a user.

  const [show, setShow] = useState(false);

  // To show wether the post request to add a user was succesful or not

  const [serverResponse, setServerResponse] = useState("");

  // To send the form to the server and get a response back on wether the request was 200 or not.

  const submitForm = (data) => {
    // Confirm if passwords match
    if (data.password == data.confirm) {
      // Each of the registered datas from the form are extracted.
      const body = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      /*
      Setting up the request options.
          1) Method: Decide wether its a GET, POST, PUT, DELTE method 
          2) Headers: This allows us to define additional paramters like content-type 
          3) Body: Indicates the type of body to be sent to the sever.Convert the given JS Object 
                   to json string representation using JSON.Stringify that is passed on to server. 
      */

      const requestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      };

      /*
      Fetching response from server.
          1) We use the fetch function from Javascript. This returns only when the request is complete. 
            The Two paramters are the direction to the part of the server that deals with signup requests and the
            requestOption details of the request that  is going through 
          2) We then take the data stream that we recieved from the server and convert it into a JSON object. 
             It is important to undertstand that the conversion of the data stream to JSON object is a promise. 
             The reason why we do this is that res.json() parases through the body (content) of the API call and gives us smt to work with.
          3) We then take the JSON object and access the message attribute. This is the server response stores the info 
             in the message attibute ( auth/ singup ). 
          4) We then set the server response with the fetched data and set the sign-up pop up to True
      */

      fetch("/auth/signup", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          setServerResponse(data.message);
          setShow(true);
        });

      // Call the reset func defined using the form hook.
      reset();
    } else {
      // Raise an alert if the passwords dont match.
      alert("Password do not match");
    }
  };

  const [isHoveredSignup, setIsHoveredSignup] = useState(false);

  return (
    <Container fluid className="py-3 py-md-5 mt-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={6} className="text-center mt-5 mb-4 mb-lg-0 ">
          <img
            src={process.env.PUBLIC_URL + "/short_logo.png"}
            alt="Short Logo"
            className="img-fluid"
          />
        </Col>
        <Col xs={12} lg={6}>
          <div className="login p-3 p-md-5">
            <div className="form">
              <h1 className="mb-4">Sign-Up Page</h1>
              {/*
          Alerts are a useful way to indicate that the sign-up was succesful or not. We use the predefined 
          style and functionality created by the react-bootstrap library. Notice that the onClick, sets the Show
          variable to false. This is to remove the pop up and not show it.     
        */}
              <Alert show={show} variant="success" style={{ width: 250 }}>
                <p>{serverResponse}</p>
                <hr />
                <div className="d-flex justify-content-start">
                  <Button
                    onClick={() => setShow(false)}
                    variant="outline-success"
                  >
                    Close me
                  </Button>
                </div>
              </Alert>
              <form>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
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
                {errors.username?.type === "maxLength" && (
                  <span style={{ color: "red" }}>
                    {" "}
                    max lenght of characters is 25
                  </span>
                )}
                {errors.username?.type === "minLength" && (
                  <span style={{ color: "red" }}>
                    {" "}
                    min lenght of characters is 6
                  </span>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Your Email"
                    {...register("email", { required: true, maxLenght: 80 })}
                  />
                </Form.Group>
                {errors.email && (
                  <span style={{ color: "red" }}>Email Required</span>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
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
                {errors.password?.type === "maxLength" && (
                  <span style={{ color: "red" }}>
                    {" "}
                    max lenght of characters is 20
                  </span>
                )}
                {errors.password?.type === "minLength" && (
                  <span style={{ color: "red" }}>
                    {" "}
                    min lenght of characters is 6
                  </span>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
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
                <Form.Group className="mb-3">
                  <Button
                    as="sub"
                    variant="primary"
                    className="w-100 mb-3"
                    onClick={handleSubmit(submitForm)}
                    style={{
                      display: "inline-block",
                      padding: "10px 20px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      textDecoration: "none",
                      color: "white",
                      backgroundColor: "#D5B895",
                      border: "none",
                      borderRadius: "5px",
                      boxShadow: "5px 3px 0 #333",
                      transition: "all 0.1s",
                      cursor: "pointer",
                      transform: isHoveredSignup ? "translateY(5px)" : "none",
                    }}
                    onMouseEnter={() => setIsHoveredSignup(true)}
                    onMouseLeave={() => setIsHoveredSignup(false)}
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
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
