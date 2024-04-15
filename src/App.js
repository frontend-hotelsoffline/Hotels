import logo from "./logo.svg";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import Login from "./(Login)/Login";
import Register from "./(Login)/Register";
import Dashboard from "./(AuthLayout)/Dashboard/Dashboard";
import MainLayout from "./(AuthLayout)/components/Layout/MainLayout";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  useEffect(()=>{
    !isAuthenticated && setIsAuthenticated(localStorage.getItem("isAuthenticated"))
     }, [isAuthenticated])

  return (
    <div>
      <Router>
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
      </Router>
    </div>
  );
}

export default App;
