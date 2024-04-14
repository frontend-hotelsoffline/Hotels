import logo from "./logo.svg";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import Login from "./(Login)/Login";
import Register from "./(Login)/Register";
import Dashboard from "./(AuthLayout)/Dashboard/Dashboard";
import MainLayout from "./(AuthLayout)/components/Layout/MainLayout";
import { useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const getCookie = (name) => {
    const cookieString = document.cookie;
    console.log(cookieString)
    const cookies = cookieString.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null; // Return null if the cookie with the specified name is not found
  };
  
  // Usage
  const myCookieValue = getCookie('myCookieName');
  console.log(myCookieValue);

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/Dashboard" /> :<Login />
            }
          />
          <Route
            path="/Register"
            element={
              isAuthenticated ? <Navigate to="/Dashboard" /> : <Register />
            }
          />
        </Routes>
          <Routes>
            <Route
              path="/Dashboard"
              element={
                isAuthenticated ? (
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
