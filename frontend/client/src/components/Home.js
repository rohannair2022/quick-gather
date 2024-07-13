import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import Blog from "./Blog";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import { useRef } from "react";
const socket = io("http://127.0.0.1:5000", {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

const LoggedinHome = () => {
  const [blogs, setBlog] = useState([]);
  const [show1, setshow1] = useState(false);
  const [show2, setshow2] = useState(false);
  const [show, setShow] = useState(false);

  const [serverResponse, setServerResponse] = useState("");
  const [blogId, setBlogId] = useState(0);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(0);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const storedUsername = JSON.parse(localStorage.getItem("username"));
    if (storedUsername) {
      setUsername(storedUsername.name);
    }
  }, []);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    socket.on("join_confirm", (data) => {
      console.log("Received join confirmation:", data);
    });

    socket.on("leave_confirm", (data) => {
      console.log("Recived leave confirmation:", data);
    });

    return () => {
      socket.off("join_confirm");
      socket.off("leave_confirm");
    };
  }, []);

  const joinRoom = () => {
    if (username && room) {
      console.log(
        `Emitting 'join' event with username: ${username}, room: ${room}`
      );
      socket.emit("join", { username, room });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    if (username && room) {
      console.log(
        `Emitting 'leave' event with username: ${username}, room: ${room}`
      );
      socket.emit("leave", { username, room });
      setJoined(false);
    }
  };

  const handleClose = () => {
    setshow1(false);
  };

  const handleshow1 = (id) => {
    setshow1(true);
    setBlogId(id);
    blogs.map((blog) => {
      if (blog.id == id) {
        setValue("title", blog.title);
        setValue("description", blog.description);
      }
    });
  };

  const fetchBlogs = () => {
    const username = JSON.parse(localStorage.getItem("username"));
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    fetch(`/blog/blogs/${encodeURIComponent(username.name)}`, requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => setBlog(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const submitForm = (data) => {
    const body = {
      title: data.title,
      description: data.description,
    };

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(`/blog/blog/${blogId}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        setServerResponse("Blog Updated");
        setShow(true);

        setBlog((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id === data.id ? data : blog))
        );

        reset();
        handleClose();
        fetchBlogs(); // Re-fetch blogs after successful update
      });
  };

  const deleteBlog = (id) => {
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    const username = JSON.parse(localStorage.getItem("username"));

    const body = {
      username: username.name,
    };

    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    };

    fetch(`/blog/blog/${id}`, requestOptions)
      .then((res) => res.json())
      .then((data) => {
        fetchBlogs(); // Re-fetch blogs after successful update
      });
  };

  return (
    <div style={{ margin: 50 }}>
      <h1>Groups Joined</h1>

      {/* 1: The modal for the Update Button */}

      <Modal show={show1} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>New Title</Form.Label>
              <Form.Control
                type="email"
                placeholder="Your Title"
                {...register("title", { required: true })}
              />
            </Form.Group>
            {errors.title && (
              <span style={{ color: "red" }}>Title Required</span>
            )}
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>New Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Your Description"
                {...register("description", { required: true })}
              />
            </Form.Group>
            {errors.description && (
              <span style={{ color: "red" }}>Description Required</span>
            )}
          </Form>
          <Alert show={show} style={{ width: 250, background: "green" }}>
            <p>{serverResponse}</p>
            <hr />
            <div className="d-flex justify-content-start">
              <Button onClick={() => setShow(false)} variant="outline-success">
                Close me
              </Button>
            </div>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit(submitForm)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 2: The modal for the Chat Button */}

      <Modal
        show={show2}
        onHide={() => {
          setshow2(false);
          leaveRoom();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Group Name: {room}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              leaveRoom();
              setshow2(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {blogs.map((blog, index) => (
        <div>
          <Blog
            title={blog.title}
            id={blog.id}
            key={index}
            description={blog.description}
            handleshow1={() => {
              handleshow1(blog.id);
            }}
            deleteBlog={() => deleteBlog(blog.id)}
            startChat={() => {
              setRoom(blog.id);
              setshow2(true);
              joinRoom();
            }}
          />
        </div>
      ))}
    </div>
  );
};

const LoggedoutHome = () => {
  return (
    <div className="home" style={{ marginTop: 50, marginLeft: 50 }}>
      <h1>Home Page</h1>
      <Link to="/Signup" className="btn btn-primary">
        Signup Button
      </Link>
    </div>
  );
};

export default function HomePage() {
  const [loggedin] = useAuth();
  return <div>{loggedin ? <LoggedinHome /> : <LoggedoutHome />}</div>;
}
