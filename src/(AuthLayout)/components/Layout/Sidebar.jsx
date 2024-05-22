import React, { useContext, useState } from "react";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import {
  MdOutlineHomeWork,
  MdOutlineBedroomParent,
  MdBarChart,
  MdOutlinePriceChange,
  MdCorporateFare,
  MdOutlineLightMode,
} from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";
import { FiUsers, FiUser } from "react-icons/fi";
import { FaHandshake, FaMinus } from "react-icons/fa";
import { FaUsersGear, FaGift, FaWallet } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { IoMoonOutline } from "react-icons/io5";
import { AuthContext } from "../../../AuthProvider";
import GetProfile from "../Helper/GetProfile";

const Sidebar = () => {
  const { lightOrDark, setLightOrDark } = useContext(AuthContext);
  const location = useLocation();
  const pathname = location.pathname.split("/");
  const currentKey = pathname.pop();

  const [currentPage, setCurrentPage] = useState(currentKey);
  const { ProfileValue } = GetProfile();
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const getCurrentKey = ({ key }) => {
    setCurrentPage(key);
  };
  const items = [
    getItem(
      <Link to="/Dashboard">Dashboard</Link>,
      "Dashboard",
      <BiSolidDashboard />
    ),
    getItem(<Link to={"/Users"}>Users</Link>, "Users", <FiUsers />),
    getItem(<Link to={"/DMCs"}>DMCs</Link>, "DMCs", <MdBarChart />),
    getItem(
      <Link to={"/Account-Managers"}>Account Managers</Link>,
      "Account-Managers",
      <FiUser />
    ),
    getItem(
      <Link to={"/Corporate"}>Corporate</Link>,
      "Corporate",
      <MdCorporateFare />
    ),
    getItem("Rooms", "rooms", <MdOutlineBedroomParent />, [
      getItem(<Link to="/Rooms">Rooms</Link>, "Rooms", <FaMinus />),
      getItem(
        <Link to="/Categories">Category</Link>,
        "Categories",
        <FaMinus />
      ),
      getItem(<Link to="/Amenities">Amenities</Link>, "Amenities", <FaMinus />),
      getItem(<Link to="/Room-View">Room view</Link>, "Room-View", <FaMinus />),
    ]),
    getItem(<Link to="/Search">Search</Link>, "Search", <SearchOutlined />),
    getItem("Hotels", "hHtels", <MdOutlineHomeWork />, [
      getItem(<Link to="/Hotels">Hotels</Link>, "Hotels", <FaMinus />),
      getItem(<Link to="/Facility">Facilities</Link>, "Facility", <FaMinus />),
      getItem(
        <Link to={"/Places-of-Interest"}>Place of interest</Link>,
        "Places-of-Interest",
        <FaMinus />
      ),
      getItem(<Link to={"/Chains"}>Chains</Link>, "Chains", <FaMinus />),
    ]),
    getItem(
      <Link to="/Contracts">Contracts</Link>,
      "Contracts",
      <FaHandshake />
    ),
    getItem(
      <Link to={"/Pricing"}>Pricing</Link>,
      "Pricing",
      <MdOutlinePriceChange />
    ),
    getItem(
      <Link to={"/Services"}>Services</Link>,
      "Services",
      <FaUsersGear />
    ),
    getItem(<Link to={"/Channel"}>Channel</Link>, "Channel", <FaUsersGear />),
    getItem(<Link to={"/Packages"}>Packages</Link>, "Packages", <FaGift />),
    getItem(<Link to={"/Wallet"}>Wallet</Link>, "Wallet", <FaWallet />),
  ];
  return (
    <div className="w-full h-full relative p-3">
      <h1 className={`${lightOrDark === "dark" && "dark-mode"} logo-title`}>
        HotelsOffline
      </h1>
      <hr className="mb-1 -mt-2 w-full" />
      <Menu
        style={{
          background: lightOrDark === "dark" ? "#151718 " : "",
          // color: lightOrDark === "dark" ? "#FFFFFF" : "",
        }}
        className="w-full  overflow-auto"
        onClick={getCurrentKey}
        defaultSelectedKeys={[currentPage]}
        defaultOpenKeys={[currentPage]}
        items={items}
      />
      <span className="absolute bottom-2">
        <div
          className={`${
            lightOrDark === "dark" && "dark-mode border-white"
          } border border-black mt-2 p-1 rounded-lg`}
        >
          <div
            className={`${
              lightOrDark === "dark" && "dark-mode border-white"
            } w-full flex flex-row items-center justify-evenly border rounded-md`}
          >
            <div className="super-admin-profile"></div>
            <span className="">
              <h1
                className={`${
                  lightOrDark === "dark" && "dark-mode"
                } title capitalize`}
              >
                {ProfileValue?.name}
              </h1>
              <h2
                className={`${
                  lightOrDark === "dark" && "dark-mode"
                } sub-title text-center`}
              >
                {ProfileValue.lev === 1
                  ? "Super Admin"
                  : ProfileValue.lev === 2
                  ? "Account manager"
                  : ProfileValue.lev === 4
                  ? "users under a dmc"
                  : ProfileValue.lev === 6
                  ? "users under a hotel"
                  : ProfileValue.lev === 9
                  ? "users under a corporate"
                  : ProfileValue.lev === 1
                  ? "Agent"
                  : ""}
              </h2>
            </span>
          </div>
          <div
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="logout cursor-pointer"
          >
            Log out <LogoutOutlined className="mt-1" />
          </div>
        </div>
        <div className="w-full group flex justify-between rounded-md bg-[#1b2644] mt-2 p-1 px-2">
          <span
            onClick={() => setLightOrDark("light")}
            className={`${
              lightOrDark === "light" ? "bg-white" : ""
            } flex gap-2 items-center justify-center w-[70px] rounded-md cursor-pointer`}
          >
            <MdOutlineLightMode /> Light
          </span>
          <span
            onClick={() => setLightOrDark("dark")}
            className={`${
              lightOrDark === "dark" ? "dark-mode border-white border" : ""
            } flex gap-2 items-center text-white justify-center w-[70px] rounded-md cursor-pointer`}
          >
            <IoMoonOutline /> Dark
          </span>
        </div>
      </span>
    </div>
  );
};

export default Sidebar;
