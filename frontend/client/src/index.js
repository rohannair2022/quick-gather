import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import CreateGroup from "./components/Blogs";
import JoinGroup from "./components/joinGroup";
import Success from "./components/signupSuccess";
import Failure from "./components/signupFailure";
import { useAuth, login, logout } from "./auth.tsx";

const App = () => {
  const [initial, setInitial] = useState(true);
  const [check, setCheck] = useState(true);

  const fetchBlogs = async () => {
    console.log("CHECKER");
    const username = JSON.parse(localStorage.getItem("username"));
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    if (username && token) {
      if (username.name != "" && token.accessToken != "") {
        console.log("IN CHECKER");
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.accessToken}`, // Use access_token
            "content-Type": "application/json",
          },
        };

        try {
          const res = await fetch(
            `/blog/blogs/${encodeURIComponent(username.name)}`,
            requestOptions
          );

          if (res.status === 401) {
            setCheck(false);
            throw new Error("Unauthorized");
          }

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await res.json();
          console.log("Blogs fetched:", data);
          setCheck(true);
        } catch (error) {
          console.error("Error fetching blogs:", error.message);
          setCheck(false);
        }
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchBlogs();
    };
    initialize();
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      const username = JSON.parse(localStorage.getItem("username"));
      const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
      if (username && !check && token) {
        console.log("hi");
        try {
          const response = await fetch("/auth/refresh", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token.refreshToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const updatedSession = {
            ...token,
            accessToken: data.accessToken,
          };
          localStorage.setItem(
            "REACT_TOKEN_AUTH_KEY",
            JSON.stringify(updatedSession)
          );
          login(updatedSession); // Update the session with the new access token
          // Reset check and re-fetch blogs
          setCheck(true);
          window.location.reload();
        } catch (error) {
          console.error("Failed to refresh token:", error.message);
          logout(); // Handle logout if refresh fails
          localStorage.removeItem("REACT_TOKEN_AUTH_KEY");
          localStorage.removeItem("username");
        }
      }
      setInitial(false);
    };

    refreshToken();
  }, [check]);

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
          <Route path="/createGroup" element={<CreateGroup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/JoinGroup" element={<JoinGroup />} />
          <Route path="/Failure" element={<Failure />} />
          <Route path="/Success" element={<Success />} />
        </Routes>
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
