import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import Blogs from "./components/Blogs";

const App = () => {
  const [loggedIn, setLogIn] = useState(false);
  return (
    <Router>
      <div className="">
        <NavBar loggedin={loggedIn} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Blogs" element={<Blogs />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
