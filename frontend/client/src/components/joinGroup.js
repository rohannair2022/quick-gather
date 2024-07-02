import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function JoinGroup() {
  return (
    <div className="signup" style={{ margin: 50 }}>
      <h1>Join a Group</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formHorizontalEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            style={{ width: 250 }}
          />
        </Form.Group>
        <br></br>
        <Form.Group className="mb-3" controlId="formHorizontalPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            style={{ width: 250 }}
          />
        </Form.Group>
        <br></br>
        <Form.Group>
          <Form.Label>Mood</Form.Label>
          <Form.Select
            aria-label="Default select example"
            placeholder="Select a Mood"
            style={{ width: 250 }}
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
          <Button type="submit">Sign in</Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default JoinGroup;
