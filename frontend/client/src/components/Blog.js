import React from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";

const Blog = (props) => {
  const [isHoveredUpdate, setIsHoveredUpdate] = useState(false);
  const [isHoveredLeave, setIsHoveredLeave] = useState(false);
  const [isHoveredChat, setIsHoveredChat] = useState(false);
  return (
    <Card style={{ marginTop: 20 }}>
      <Card.Header>{`Group ID : ${props.id}`}</Card.Header>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button
          variant="primary"
          onClick={props.handleshowModal1}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "white",
            backgroundColor: "#B3CCF5",
            border: "none",
            borderRadius: "5px",
            boxShadow: "5px 3px 0 #333",
            transition: "all 0.1s",
            cursor: "pointer",
            transform: isHoveredUpdate ? "translateY(5px)" : "none",
          }}
          onMouseEnter={() => setIsHoveredUpdate(true)}
          onMouseLeave={() => setIsHoveredUpdate(false)}
        >
          Update
        </Button>
        <Button
          className="leave mx-4"
          variant="danger"
          onClick={props.deleteBlog}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "white",
            backgroundColor: "#ff6666",
            border: "none",
            borderRadius: "5px",
            boxShadow: "5px 3px 0 #333",
            transition: "all 0.1s",
            cursor: "pointer",
            transform: isHoveredLeave ? "translateY(5px)" : "none",
          }}
          onMouseEnter={() => setIsHoveredLeave(true)}
          onMouseLeave={() => setIsHoveredLeave(false)}
        >
          Leave
        </Button>
        <Button
          style={{
            display: "inline-block",
            padding: "10px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "white",
            backgroundColor: "#b2b200",
            border: "none",
            borderRadius: "5px",
            boxShadow: "5px 3px 0 #333",
            transition: "all 0.1s",
            cursor: "pointer",
            transform: isHoveredChat ? "translateY(5px)" : "none",
          }}
          onMouseEnter={() => setIsHoveredChat(true)}
          onMouseLeave={() => setIsHoveredChat(false)}
          onClick={props.startChat}
        >
          Chat
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Blog;
