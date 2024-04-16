"use client";
import { Button, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { GET_API } from "../components/API/GetAPI";
import { HiDotsVertical } from "react-icons/hi";
import { PlusOutlined } from "@ant-design/icons";
import AddUser from "./AddUser";
import { formatDate } from "../components/Helper/FormatDate";
import {EditIcon}from "../components/Customized/EditIcon";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalEdit = () => {
    setIsModalOpenEdit(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
  };
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const getUser = async () => {
    const GET_ALL = `{
        get_all_users {
            id
            createdAt
            is_first_login_chng_pswd
            uname
            ulevel
            comp_id
            is_blocked
            country
            is_demo_user
        }
    }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data && !res.errors) {
        const tableArray = res.data.get_all_users.map((item) => ({
          key: item.id ? item.id : "",
          id: item.id ? item.id : "",
          dateadded: formatDate(item.createdAt || null) || "",
          username: item.uname ? item.uname : "",
          ulevel: item.ulevel || "",
          accounttype:
            item.ulevel === 1
              ? "Super Admin"
              : item.ulevel === 2
              ? "Account manager"
              : item.ulevel === 4
              ? "DMC"
              : item.ulevel === 6
              ? "Hotel"
              : item.ulevel === 9
              ? "Corporate"
              : "",
          compid: item.comp_id ? item.comp_id : "",
          country: item.country ? item.country : "",
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
    const updatedFilteredData = dataSource.filter(
      (item) => item.ulevel == nameFilter
    );
    setFilteredData(updatedFilteredData);
  }, [activeItem, nameFilter]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) =>
        a.username ? a.username.localeCompare(b.username) : "",
    },
    {
      title: "account type",
      dataIndex: "accounttype",
      key: "accounttype",
      sorter: (a, b) =>
        a.accounttype ? a.accounttype.localeCompare(b.accounttype) : "",
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => (a.country ? a.country.localeCompare(b.country) : ""),
    },
    {
      title: "comp id",
      dataIndex: "compid",
      key: "compid",
      sorter: (a, b) => (a.compid ? a.compid - b.compid : ""),
    },
    {
      title: "date added",
      dataIndex: "dateadded",
      key: "dateadded",
      sorter: (a, b) => (a.dateadded ? a.dateadded - b.dateadded : ""),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span className="w-full flex justify-center">
          <Popover
            content={
              <div className="flex flex-col gap-3">
                <Button onClick={showModalEdit} className="action-btn">
                  edit
                </Button>
              </div>
            }
          >
             {EditIcon}
          </Popover>
            <Modal
              footer={false}
              open={isModalOpenEdit}
              onOk={handleCancel}
              onCancel={handleCancel}
            ></Modal>
        </span>
      ),
    },
  ];

  const items = ["DMCS", "ACCOUNT MANAGERS", " HOTELS", "TRAVELLERS", "CORPORATE"];

  const handleItemClick = (index) => {
    setActiveItem(index);
    setNameFilter(
      index === 0
        ? 4
        : index === 1
        ? 2
        : index === 2
        ? 6
        : index === 3
        ? ""
        : index === 4
        ? 9
        : null
    );
  };
  return (
    <div className="w-full relative">
      <Button
        onClick={showModal}
        className="button-bar absolute right-3 -top-6"
        icon={<PlusOutlined />}
      >
        Add User
      </Button>
      <Modal
        footer={false}
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        <AddUser getUser={getUser} handleCancel={handleCancel} />
      </Modal>
      <div>
        <ul className="list-none text-[#A6A6A6]  flex justify-between my-2 max-w-[500px]">
          <li
            className={`cursor-pointer ${
              activeItem === "" ? "font-bold underline text-[#000000]" : ""
            }`}
            onClick={() => {
              setNameFilter("");
              setActiveItem("");
            }}
          >
            All
          </li>
          {items.map((item, index) => (
            <li
              key={index}
              className={`cursor-pointer capitalize ${
                activeItem === index ? "font-bold underline text-[#000000]" : ""
              }`}
              onClick={() => handleItemClick(index)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Table
        columns={columns}
        dataSource={activeItem === "" ? dataSource : filteredData}
        pagination={false}
      />
    </div>
  );
};

export default User;
