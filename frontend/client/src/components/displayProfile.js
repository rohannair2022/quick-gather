import { Modal, Card } from "react-bootstrap";

const DisplayProfile = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Blog Profile for {props.username}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card style={{ width: "29rem" }}>
          <Card.Img variant="top" src={props.picture} />
          <Card.Body>
            <Card.Text>
              <h6>Mood: {props.mood}</h6>
              <h6>Budget: {props.budget}</h6>
              <h6>Travel: {props.travel}</h6>
            </Card.Text>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default DisplayProfile;
