import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";

const Blogs = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [serverResponse, setServerResponse] = useState("");
  const [show, setShow] = useState(false);

  const submitForm = (data) => {
    //console.log(data);
    // Works fine the data is coming through the form
    const body = {
      title: data.title,
      description: data.description,
    };

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    console.log(token);

    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch("/blog/blogs", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Blog Created") {
          setServerResponse(data.message);
          setShow(true);
          reset();
        }
      });
  };

  return (
    <div className="blogs" style={{ margin: 50 }}>
      <h1>Create Blog</h1>
      <form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Blog Title"
            {...register("title", { required: true })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Blog Description"
            {...register("description", { required: true })}
          />
        </Form.Group>
        <Form.Group>
          <Button as="sub" variant="primary" onClick={handleSubmit(submitForm)}>
            Create Blog
          </Button>
        </Form.Group>
        <Alert show={show} style={{ width: 250, background: "green" }}>
          <p>'Blog : {serverResponse} has been created'</p>
          <hr />
          <div className="d-flex justify-content-start">
            <Button onClick={() => setShow(false)} variant="outline-success">
              Close me
            </Button>
          </div>
        </Alert>
      </form>
    </div>
  );
};

export default Blogs;
