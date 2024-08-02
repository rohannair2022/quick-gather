import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [path, setPath] = useState("");
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
        setServerResponse(data.message);
      })
      .catch((error) => {
        setShow(true);
        setServerResponse("An error Occured");
      });
  };

  const getPic = () => {
    const username = JSON.parse(localStorage.getItem("username"));
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    const requestOptionsGet = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
    };

    fetch(`/user/uploadpic?username=${username.name}`, requestOptionsGet)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.image_path);
        setPath(data.image_path);
      })
      .catch((error) => {
        console.error("Error fetching profile picture:", error);
      });
  };

  useEffect(() => {
    getPic();
  }, []);

  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={path} />
        <Card.Body>
          <h5>{JSON.parse(localStorage.getItem("username")).name}</h5>
          <Form.Group controlId="formFile">
            <Form.Label>Update Profile pic</Form.Label>
            <Form.Control
              className="mb-3"
              type="file"
              {...register("profile_pic", { required: true })}
            />
          </Form.Group>
          <Form.Group className="btn btn-outline-light">
            <Button onClick={handleSubmit(uploadPic)}>
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
        </Card.Body>
      </Card>
    </>
  );
}

export default Profile;
