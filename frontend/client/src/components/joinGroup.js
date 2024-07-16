import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Alert } from "react-bootstrap";

function JoinGroup() {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [serverResponse, setServerResponse] = useState("");
  const [color, setColor] = useState("");
  const [show, setShow] = useState(false);

  const submitForm = (data) => {
    const username = JSON.parse(localStorage.getItem("username"));

    const body = {
      id: parseInt(data.id),
      title: data.title,
      description: data.description,
      username: username.name,
      mood: data.mood,
      travel: data.travel,
      budget: data.budget,
    };

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    console.log(token);

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(`/blog/join/${parseInt(data.id)}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        if (data.message == "Success") {
          setServerResponse(data.message);
          setShow(true);
          setColor("green");
          reset();
        } else {
          setServerResponse(data.message);
          setShow(true);
          setColor("red");
          reset();
        }
      });
  };

  return (
    <div className="signup" style={{ margin: 50 }}>
      <h1>Join a Group</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formHorizontalEmail">
          <Form.Label>Id</Form.Label>
          <Form.Control
            type="text"
            placeholder="Group id"
            style={{ width: 250 }}
            {...register("id", { required: true })}
          />
        </Form.Group>
        <br></br>
        <Form.Group>
          <Form.Label>Mood</Form.Label>
          <Form.Select
            aria-label="Default select example"
            placeholder="Select a Mood"
            style={{ width: 250 }}
            {...register("mood", { required: true })}
          >
            <option>Select a Mood</option>
            <option value="1">Chill</option>
            <option value="2">Energetic</option>
            <option value="3">Traditional</option>
            <option value="4">Anything</option>
          </Form.Select>
        </Form.Group>
        <br></br>
        <Form.Group>
          <Form.Label>Budget</Form.Label>
          <Form.Select
            aria-label="Default select example"
            placeholder="Select a Mood"
            style={{ width: 250 }}
            {...register("budget", { required: true })}
          >
            <option>Select a Mood</option>
            <option value="1">{`<50`}</option>
            <option value="2">{`50 - 500`}</option>
            <option value="3">{`500 - 2500`}</option>
            <option value="4">No Budget</option>
          </Form.Select>
        </Form.Group>
        <br></br>
        <Form.Group>
          <Form.Label>Travel</Form.Label>
          <Form.Select
            style={{ width: 250 }}
            aria-label="Default select example"
            placeholder="Select a Mood"
            {...register("travel", { required: true })}
          >
            <option>Select a Mood</option>
            <option value="1">Close By</option>
            <option value="2">Anywhere in the City</option>
            <option value="3">Outside the city within the country</option>
            <option value="4">Outside the country</option>
          </Form.Select>
        </Form.Group>
        <br></br>

        <Form.Group className="mb-3">
          <Button type="submit" onClick={handleSubmit(submitForm)}>
            Join Group
          </Button>
        </Form.Group>
        <Alert show={show} style={{ width: 250, background: `${color}` }}>
          <p>'{serverResponse}'</p>
          <hr />
          <div className="d-flex justify-content-start">
            <Button onClick={() => setShow(false)} variant="outline-success">
              Close me
            </Button>
          </div>
        </Alert>
      </Form>
    </div>
  );
}

export default JoinGroup;
