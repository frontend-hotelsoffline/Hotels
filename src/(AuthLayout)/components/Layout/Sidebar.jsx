"use client";
import React, { useState } from "react";
import {
  CaretRightOutlined,
  LogoutOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { MdOutlineHomeWork, MdOutlineBedroomParent, MdBarChart, MdOutlinePriceChange, MdCorporateFare  } from "react-icons/md";
import { BiSolidDashboard } from "react-icons/bi";
import { FiUsers, FiUser } from "react-icons/fi";
import { FaHandshake, FaMinus } from "react-icons/fa";
import { FaUsersGear, FaGift, FaWallet } from "react-icons/fa6";
import { Link, useLocation, useParams } from "react-router-dom";

const Sidebar = () => {

  const location = useLocation();
  const pathname = location.pathname.split('/')
  const currentKey = pathname.pop();

  const [currentPage, setCurrentPage] = useState({ currentKey });

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
      "dashboard",
      <BiSolidDashboard />
    ),
    getItem(<Link to={"/Users"}>Users</Link>, "users", <FiUsers />),
    getItem(<Link to={"/DMCs"}>DMCs</Link>, "dmcs", <MdBarChart />),
    getItem(<Link to={"/Account-Managers"}>Account Managers</Link>, "acc_owner", <FiUser />),
    getItem(<Link to={"/Corporate"}>Corporate</Link>, "corporate", <MdCorporateFare  />),
    getItem("Rooms", "rooms", <MdOutlineBedroomParent />, [
      getItem(<Link to="/Rooms">Rooms</Link>, "subroom", <FaMinus />),
      getItem(
        <Link to="/Categories">Category</Link>,
        "category",
        <FaMinus />
      ),
      getItem(
        <Link to="/Amenities">Amenities</Link>,
        "amenities",
        <FaMinus />
      ),
      getItem(
        <Link to="/Room-View">Room view</Link>,
        "roomview1",
        <FaMinus />
      ),
    ]),
    getItem(<Link to="/Search">Search</Link>, "search", <SearchOutlined />),
    getItem("Hotels", "hotels", <MdOutlineHomeWork />, [
      getItem(<Link to="/Hotels">Hotels</Link>, "Hotels", <FaMinus />),
      getItem(
        <Link to="/Facility">Facilities</Link>,
        "facilities",
        <FaMinus />
      ),
      getItem(<Link to={"/Places-of-Interest"}>Place of interest</Link>, "placeofinterest", <FaMinus />),
      getItem(<Link to={"/Chains"}>Chains</Link>, "chains", <FaMinus />),
    ]),
    getItem(
      <Link to="/Contracts">Contracts</Link>,
      "contracts",
      <FaHandshake />
    ),
    getItem(<Link to={"/Pricing"}>Pricing</Link>, "pricing", <MdOutlinePriceChange />),
    getItem(<Link to={"/Services"}>Services</Link>, "services", <FaUsersGear />),
    getItem(<Link to={"/Channel"}>Channel</Link>, "Channel", <FaUsersGear />),
    getItem(<Link to={"/Packages"}>Packages</Link>, "packages", <FaGift />),
    getItem(<Link to={"/Wallet"}>Wallet</Link>, "wallet", <FaWallet />),
  ];
  return (
    <div className="w-full p-3">
      <Menu className="w-full  overflow-auto"
        onClick={getCurrentKey}
        defaultSelectedKeys={[currentPage]}
        defaultOpenKeys={[currentPage]}
        // mode="inline"
        items={items}
      />
      <div
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="logout cursor-pointer"
      >
        <div className="border border-black mt-2 p-1 rounded-lg">
      <div className="w-full flex flex-row items-center justify-evenly border-black border rounded-md">
        <div className="super-admin-profile"></div>
        <span className="">
          <h1 className="title">Super Admin</h1>
          <h2 className="sub-title text-center">Moderator</h2>
        </span>
      </div>
        Log out <LogoutOutlined className="mt-2" />
      </div></div>
    </div>
  );
};

export default Sidebar;
