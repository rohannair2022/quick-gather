import React from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

const Blog = (props) => {
  return (
    <Card style={{ marginTop: 20 }}>
      <Card.Header>{`Group ID : ${props.id}`}</Card.Header>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary" onClick={props.handleshow1}>
          Update
        </Button>{" "}
        <Button variant="danger" onClick={props.deleteBlog}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Blog;
