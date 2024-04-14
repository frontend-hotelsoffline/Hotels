import logo from "./logo.svg";
import { Route, Routes } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./(Login)/Login";
import Register from "./(Login)/Register";
import Dashboard from "./(AuthLayout)/Dashboard/Dashboard";
import MainLayout from "./(AuthLayout)/components/Layout/MainLayout";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
        <MainLayout>
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </MainLayout>
      </Router>
    </div>
  );
}

export default App;
