import { Route, Routes } from "react-router";
import { BrowserRouter as Router, Navigate } from "react-router-dom";
import Login from "./(Login)/Login";
import Register from "./(Login)/Register";
import Dashboard from "./(AuthLayout)/Dashboard/Dashboard";
import MainLayout from "./(AuthLayout)/components/Layout/MainLayout";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import User from "./(AuthLayout)/Users/User";
import DMCs from "./(AuthLayout)/DMCs/DMC";
import Wallet from "./(AuthLayout)/Wallet/page";
import Packages from "./(AuthLayout)/(Packages)/Packages/Package";
import Channel from "./(AuthLayout)/Channel/Channel";
import Services from "./(AuthLayout)/(Services)/Services";
import Pricing from "./(AuthLayout)/Pricing/Pricing";
import Contracts from "./(AuthLayout)/(Contract)/Contracts/Contracts";
import Chains from "./(AuthLayout)/(Hotels)/Chains/Chains";
import PlacesOfInterest from "./(AuthLayout)/(Hotels)/Places-of-Interest/Places-of-Interest";
import Facility from "./(AuthLayout)/(Hotels)/Facility/Facility";
import Hotels from "./(AuthLayout)/(Hotels)/Hotels/Hotels";
import AddHotel from "./(AuthLayout)/(Hotels)/Add-Hotel/AddHotel";
import Search from "./(AuthLayout)/Search/Search";
import RoomView from "./(AuthLayout)/(Rooms)/Room-View/RoomView";
import Amenities from "./(AuthLayout)/(Rooms)/Amenities/Amenities";
import Categories from "./(AuthLayout)/(Rooms)/Categories/Categories";
import Rooms from "./(AuthLayout)/(Rooms)/Rooms/Rooms";
import Corporate from "./(AuthLayout)/Corporate/Corporate";
import AccountOwners from "./(AuthLayout)/Account-Managers/AccountManagers";
import AddRoom from "./(AuthLayout)/(Rooms)/Add-Room/Add-Room";
import StaticContract from "./(AuthLayout)/(Contract)/Static-Contract/StaticContract";
import { EditHotel } from "./(AuthLayout)/(Hotels)/Edit-Hotel/EditHotel";
import EditRoom from "./(AuthLayout)/(Rooms)/Edit-Room/EditRoom";
import AddServices from "./(AuthLayout)/(Services)/Add-Services/AddServices";

function App() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    !isAuthenticated &&
      setIsAuthenticated(localStorage.getItem("isAuthenticated"));
  }, [isAuthenticated]);

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
            path="/Users"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <User />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/DMCs"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <DMCs />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Account-Managers"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <AccountOwners />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Corporate"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Corporate />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Rooms"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Rooms />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Add-Room"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <AddRoom />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Edit-Room"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <EditRoom />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Categories"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Categories />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Amenities"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Amenities />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Room-View"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <RoomView />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Search"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Search />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Hotels"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Hotels />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Add-Hotel"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <AddHotel />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Edit-Hotel"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <EditHotel />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Facility"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Facility />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Places-of-Interest"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <PlacesOfInterest />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Chains"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Chains />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Contracts"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Contracts />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Static-Contract"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <StaticContract />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Pricing"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Pricing />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Services"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Services />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Add-Services"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <AddServices />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Channel"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Channel />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Packages"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Packages />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/Wallet"
            element={
              isAuthenticated ? (
                <MainLayout>
                  <Wallet />
                </MainLayout>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/Dashboard" /> : <Login />}
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
