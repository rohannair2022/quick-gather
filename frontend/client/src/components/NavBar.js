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

export default function NavBar(props) {
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
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/Blogs" className="nav-link">
              Blogs
            </Link>
            <Link to="/Blogs" className="nav-link">
              Groups
            </Link>
            <Link to="/Blogs" className="nav-link">
              Ask our AI to plan
            </Link>
            <Link to="/Logout" className="nav-link">
              Log-Out
            </Link>
            <Link to="/Login" className="nav-link">
              Log-In
            </Link>
            <Link to="/Signup" className="nav-link">
              Sign-up
            </Link>
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
