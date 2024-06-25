import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="home" style={{ marginTop: 50, marginLeft: 50 }}>
      <h1>Home Page</h1>
      <Link to="/Signup" className="btn btn-primary">
        Signup Button
      </Link>
    </div>
  );
}
