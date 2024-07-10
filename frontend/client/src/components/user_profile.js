import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useState } from "react";

function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const uploadPic = (data) => {
    const username = JSON.parse(localStorage.getItem("username"));
    const formData = new FormData();
    formData.append("picture", data.profile_pic[0]);
    formData.append("user_name", username.name);

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    // Now you can send this formData to your server
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        // Remove "content-type" header when sending FormData
      },
      body: formData, // Use formData directly, don't stringify
    };

    fetch("/user/uploadpic", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setShow(true);
        serverResponse(data.message);
      })
      .catch((error) => {
        setShow(true);
        serverResponse(data.error);
      });
  };

  return (
    <>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Default file input example</Form.Label>
        <Form.Control
          type="file"
          {...register("profile_pic", { required: true })}
        />
      </Form.Group>
      <Form.Group>
        <Button as="sub" variant="primary" onClick={handleSubmit(uploadPic)}>
          Upload New Profile Pic
        </Button>
      </Form.Group>
      <Alert show={show} style={{ width: 250, background: "red" }}>
        <p>{serverResponse}</p>
        <hr />
        <div className="d-flex justify-content-start">
          <Button onClick={() => setShow(false)} variant="outline-success">
            Close me
          </Button>
        </div>
      </Alert>
    </>
  );
}

export default Profile;
