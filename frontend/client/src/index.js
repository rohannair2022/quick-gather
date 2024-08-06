import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import Blogs from "./components/Blogs";
import JoinGroup from "./components/joinGroup";
import Profile from "./components/user_profile";
import Success from "./components/signupSuccess";
import Failure from "./components/signupFailure";
import Stats from "./components/Stats";
import { useAuth, setupTokenRefresh } from "./auth";

const App = () => {
  const [isLoggedIn] = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      const expiresIn = 3600;
      if (expiresIn) {
        setupTokenRefresh(expiresIn);
      }
    }
  }, [isLoggedIn]);

  return (
    <Router>
      {/*
        Alerts are a useful way to indicate that the sign-up was succesful or not. We use the predefined 
        style and functionality created by the react-bootstrap library. Notice that the onClick, sets the Show
        variable to false. This is to remove the pop up and not show it.     
        */}
      <div className="">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Blogs" element={<Blogs />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/JoinGroup" element={<JoinGroup />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Failure" element={<Failure />} />
          <Route path="/Success" element={<Success />} />
          <Route path="/Stats" element={<Stats />} />
        </Routes>
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
