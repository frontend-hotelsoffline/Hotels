"use client";
import React, { useState } from "react";
import {
  CaretRightOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
import { FaHandshake, FaMinus, FaRegMoon } from "react-icons/fa";
import { FaUsersGear, FaGift, FaWallet } from "react-icons/fa6";
import { Link, useLocation, useParams } from "react-router-dom";
import { CiLight } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname.split("/");
  const currentKey = pathname.pop();

  const [currentPage, setCurrentPage] = useState(currentKey);
  const [lightOrDark, setLightOrDark] = useState("light");

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
    <div className="w-full p-3">
      <h1 className="logo-title">HotelsOffline</h1>
      <hr className="mb-1 -mt-2 w-full" />
      <Menu
        className="w-full  overflow-auto"
        onClick={getCurrentKey}
        defaultSelectedKeys={[currentPage]}
        defaultOpenKeys={[currentPage]}
        // mode="inline"
        items={items}
      />
      <div className="border border-black mt-2 p-1 rounded-lg">
        <div className="w-full flex flex-row items-center justify-evenly border-black border rounded-md">
          <div className="super-admin-profile"></div>
          <span className="">
            <h1 className="title">Super Admin</h1>
            <h2 className="sub-title text-center">Moderator</h2>
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
      <div className="w-full group flex justify-between rounded-md bg-[#2A83FF] mt-2 p-1 px-2">
        <span
          onClick={() => setLightOrDark("light")}
          className={`${
            lightOrDark === "light" ? "bg-white lightORDark" : ""
          } flex gap-2 items-center justify-center text-white w-[70px] rounded-md cursor-pointer`}
        >
          <MdOutlineLightMode /> Light
        </span>
        <span
          onClick={() => setLightOrDark("dark")}
          className={`${
            lightOrDark === "dark" ? "bg-white lightORDark" : ""
          } flex gap-2 items-center justify-center  text-white w-[70px] rounded-md cursor-pointer`}
        >
          <IoMoonOutline /> Dark
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
