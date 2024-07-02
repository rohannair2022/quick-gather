import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { logout, useAuth } from "../auth";

function LoggedInLinks() {
  return (
    <>
      <Link to="/" className="nav-link">
        Home
      </Link>

      <Link to="/Blogs" className="nav-link">
        Create Group
      </Link>

      <Link to="/joinGroup" className="nav-link">
        Join Group
      </Link>

      <a href="/" onClick={logout} className="nav-link">
        Log-Out
      </a>
    </>
  );
}

function LoggedOutLinks() {
  return (
    <>
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/Blogs" className="nav-link">
        Ask our AI to plan
      </Link>
      <Link to="/Login" className="nav-link">
        Log-In
      </Link>
      <Link to="/Signup" className="nav-link">
        Sign-up
      </Link>
    </>
  );
}

export default function NavBar(props) {
  const [logged] = useAuth();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">IWillBeThere</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {logged ? (
              <LoggedInLinks></LoggedInLinks>
            ) : (
              <LoggedOutLinks></LoggedOutLinks>
            )}
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
