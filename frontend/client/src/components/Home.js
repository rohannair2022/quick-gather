import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth.tsx";
import Blog from "./Blog";
import {
  Modal,
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import io from "socket.io-client";
import { useRef } from "react";
import Stats from "./Stats";
import Profile from "./user_profile";
const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL ||
  "https://quickgather-5069dcada862.herokuapp.com";
const socket = io(REACT_APP_API_URL, {
  transports: ["websocket"],
});

const LoggedinHome = () => {
  // Each Group Joined
  const [blogs, setBlog] = useState([]);

  // Modal1: Update
  const [showModal1, setshowModal1] = useState(false);

  // Modal2: Chat
  const [showModal2, setshowModal2] = useState(false);

  // Alert Section for Update
  const [show, setShow] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const [blogId, setBlogId] = useState(0);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(0);

  // In a joined room or not
  const [joined, setJoined] = useState(false);

  // For the messages in a group
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

    socket.on("message_confirm", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: [
          ...(prevMessages[room] || []),
          { username: data.username, message: data.msg },
        ],
      }));
    });

    socket.on("message_history", (data) => {
      console.log("Received message history:", data);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [room]: data.messages,
      }));
    });

    return () => {
      socket.off("join_confirm");
      socket.off("leave_confirm");
      socket.off("message_confirm");
      socket.off("message_history");
    };
  }, [room]);

  useEffect(() => {
    if (room) {
      joinRoom();
    }
  }, [room]);

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
    if (username && room && joined) {
      console.log(
        `Emitting 'leave' event with username: ${username}, room: ${room}`
      );
      socket.emit("leave", { username, room });
      setJoined(false);
      setRoom(0);
    }
  };

  const messageRoom = (e) => {
    e.preventDefault();
    console.log("Submitting message:", message);
    if (message && room) {
      console.log(
        `Emitting 'message' event with username: ${username}, room: ${room}, message: ${message}`
      );
      socket.emit("message", { username, room, message });
      setMessage("");
    }
  };

  const MessageList = ({ messages, currentUser, room }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const roomMessages = messages[room] || [];

    return (
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {roomMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.username === currentUser ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <strong>{msg.username}: </strong>
            <span>{msg.message}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const handleClose = () => {
    setshowModal1(false);
  };

  const handleshowModal1 = (id) => {
    setshowModal1(true);
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
    <Container fluid className="py-3 py-md-5 mt-5">
      <Row className="justify-content-center">
        <Col xs={12} lg={9} className="mb-4 mb-lg-0">
          <div style={{ margin: 50 }}>
            {/* 1: The modal for the Update Button */}

            <Modal show={showModal1} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Update Blog</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
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
                    <Button
                      onClick={() => setShow(false)}
                      variant="outline-success"
                    >
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
              show={showModal2}
              onHide={() => {
                console.log("Modal closing");
                setshowModal2(false);
                leaveRoom();
                // Don't clear all messages, just leave the room
              }}
            >
              <Modal.Header closeButton>
                <Modal.Title>Group Name: {room}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Stats id={room} />
                <MessageList
                  messages={messages}
                  currentUser={username}
                  room={room}
                />
                <Form onSubmit={messageRoom}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Button type="submit" variant="primary">
                      Send Message
                    </Button>
                  </Form.Group>
                </Form>
              </Modal.Body>
            </Modal>

            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <div key={index}>
                  <Blog
                    title={blog.title}
                    id={blog.id}
                    description={blog.description}
                    handleshowModal1={() => {
                      handleshowModal1(blog.id);
                    }}
                    deleteBlog={() => deleteBlog(blog.id)}
                    startChat={() => {
                      setRoom(blog.id);
                      setshowModal2(true);
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="no-blogs-message">
                <h3>No Groups available</h3>
                <p>
                  There are currently no groups to display. Why not create or
                  join one?
                </p>
              </div>
            )}
          </div>
        </Col>
        <Col xs={12} lg={3} className="text-center">
          <div style={{ margin: 50 }}>
            <Profile />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const LoggedoutHome = () => {
  const [isHoveredLogin, setIsHoveredLogin] = useState(false);
  const [isHoveredSignup, setIsHoveredSignup] = useState(false);
  return (
    <div>
      <Container fluid className="home py-3 py-md-5 mt-5">
        <Row className="justify-content-center">
          <Col xs={12} lg={6} className="text-center mt-3 mb-4 mb-lg-0">
            <img
              src={process.env.PUBLIC_URL + "/short_logo.png"}
              alt="Short Logo"
              className="img-fluid"
            />
          </Col>
          <Col xs={12} lg={6} className="text-left mt-4 px-5">
            <Row className="justify-content-center">
              <h1
                className="title mt-5 mb-5"
                style={{
                  color: "#333",
                }}
              >
                Welcome to QuickGather
              </h1>
              <h5 className="body mb-3">
                QuickGather is an innovative social media platform , designed to
                streamline event planning with your friends, regardless of the
                event's size. Users have the flexibility to create or join
                groups, specifying their mood, budget, and travel distance
                preferences. Leveraging advanced algorithms, QuickGather
                predicts the most suitable factors and recommends activities
                tailored to these preferences. Whether organizing a casual
                get-together or a large gathering, QuickGather simplifies the
                process, ensuring personalized and enjoyable experiences for
                everyone involved.
              </h5>
            </Row>
            <br></br>
            <Row xs="auto" className="justify-content-left">
              <Col>
                <Link
                  to="/Login"
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
                    transform: isHoveredLogin ? "translateY(5px)" : "none",
                  }}
                  onMouseEnter={() => setIsHoveredLogin(true)}
                  onMouseLeave={() => setIsHoveredLogin(false)}
                >
                  Log-in
                </Link>
              </Col>
              <Col>
                <Link
                  to="/Signup"
                  style={{
                    display: "inline-block",
                    padding: "10px 20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#D5B895",
                    border: "none",
                    borderRadius: "5px",
                    boxShadow: "5px 3px 0 #333",
                    transition: "all 0.1s",
                    cursor: "pointer",
                    transform: isHoveredSignup ? "translateY(5px)" : "none",
                  }}
                  onMouseEnter={() => setIsHoveredSignup(true)}
                  onMouseLeave={() => setIsHoveredSignup(false)}
                >
                  Singup
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default function HomePage() {
  const [loggedin] = useAuth();
  return <div>{loggedin ? <LoggedinHome /> : <LoggedoutHome />}</div>;
}
