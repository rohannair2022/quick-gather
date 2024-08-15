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
import { useAuth, login, logout } from "./auth.tsx";

const App = () => {
  const { isAuthenticated, authSession } = useAuth();
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      if (!initial && authSession) {
        try {
          const response = await fetch("/auth/refresh", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authSession.refresh_token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const updatedSession = {
            ...authSession,
            access_token: data.accessToken,
          };
          localStorage.setItem(
            "REACT_TOKEN_AUTH_KEY",
            JSON.stringify(updatedSession)
          );
          login(updatedSession); // Update the session with the new access token
        } catch (error) {
          console.error("Failed to refresh token:", error.message);
          logout(); // Handle logout if refresh fails
          localStorage.removeItem("REACT_TOKEN_AUTH_KEY");
        }
      }
      setInitial(false);
    };

    refreshToken();
  }, [initial, authSession, login, logout]);

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
