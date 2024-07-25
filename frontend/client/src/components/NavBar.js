import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { logout, useAuth } from "../auth";

function LoggedInLinks() {
  return (
    <>
      <Link to="/" className="nav-link px-4" style={{ fontWeight: "bold" }}>
        Home
      </Link>

      <Link
        to="/Blogs"
        className="nav-link px-4"
        style={{ fontWeight: "bold" }}
      >
        Create Group
      </Link>

      <Link
        to="/joinGroup"
        className="nav-link px-4"
        style={{ fontWeight: "bold" }}
      >
        Join Group
      </Link>

      <Link
        to="/profile"
        className="nav-link px-4"
        style={{ fontWeight: "bold" }}
      >
        Update Profile
      </Link>

      <a
        href="/"
        onClick={logout}
        className="nav-link"
        style={{ fontWeight: "bold" }}
      >
        Log-Out
      </a>
    </>
  );
}

function LoggedOutLinks() {
  return (
    <>
      <Link to="/" className="nav-link px-4" style={{ fontWeight: "bold" }}>
        Home
      </Link>
      <Link
        to="/Login"
        className="nav-link px-4"
        style={{ fontWeight: "bold" }}
      >
        Log-In
      </Link>
      <Link
        to="/Signup"
        className="nav-link px-4"
        style={{ fontWeight: "bold" }}
      >
        Sign-up
      </Link>
    </>
  );
}

export default function NavBar() {
  const [logged] = useAuth();

  return (
    <Navbar
      expand="lg"
      style={{
        marginTop: 40,
        marginRight: 50,
        marginLeft: 50,
        borderRadius: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#333",
        opacity: 0.6,
      }}
    >
      <Container className="d-flex justify-content-center">
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-center">
          <Nav className="my-2 my-lg-0" navbarScroll>
            {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <style jsx>{`
        .nav-link {
          color: whitesmoke !important;
          font-size: 17px;
          padding-right: 30px;
          transition: color 0.2s ease-in-out;
        }
        .nav-link:hover {
          color: #111 !important;
        }
        .navbar {
          padding: 1rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </Navbar>
  );
}
