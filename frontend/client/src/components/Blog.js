import React from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

const Blog = (props) => {
  return (
    <Card style={{ marginTop: 20 }}>
      <Card.Header>Featured</Card.Header>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary" onClick={props.handleshow1}>
          Update
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Blog;
