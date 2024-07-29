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
              <p>
                <strong>Mood :</strong> {props.mood}
              </p>
              <p>
                <strong>Budget :</strong> {props.budget}
              </p>
              <p>
                <strong>Travel :</strong> {props.travel}
              </p>
            </Card.Text>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default DisplayProfile;
