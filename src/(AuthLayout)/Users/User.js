import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { GET_API } from "../components/API/GetAPI";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import AddUser from "./AddUser";
import { formatDate } from "../components/Helper/FormatDate";
import { EditIcon } from "../components/Customized/EditIcon";
import { BsFilter } from "react-icons/bs";
import GetProfile from "../components/Helper/GetProfile";

const User = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ProfileValue } = GetProfile();
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
        getUsers {
          id
          CRT
          f_log
          uname
          lev
          country
          cID
          name
          phone
        }
    }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      if (res.data && !res.errors) {
        const tableArray = res.data.getUsers.map((item) => ({
          key: item.id ? item.id : "",
          id: item.id ? item.id : "",
          dateadded: item.CRT && formatDate(item.CRT || null),
          username: item.name ? item.name : "",
          email: item.uname ? item.uname : "",
          ulevel: item.lev || "",
          accounttype:
            item.lev === 1
              ? "Super Admin"
              : item.lev === 2
              ? "Account manager"
              : item.lev === 4
              ? "DMC"
              : item.lev === 6
              ? "Hotel"
              : item.lev === 9
              ? "Corporate"
              : "",
          compid: item.cID ? item.cID : "",
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
    const updatedFilteredData = dataSource?.filter(
      (item) => item.ulevel === nameFilter
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
      title: "user name",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) =>
        a.username ? a.username.localeCompare(b.username) : "",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email ? a.email.localeCompare(b.email) : ""),
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
      render: (text, record) =>
        ProfileValue.lev !== 4 && (
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
            {/* <Modal
            footer={false}
            open={isModalOpenEdit}
            onOk={handleCancel}
            onCancel={handleCancel}
          ></Modal> */}
          </span>
        ),
    },
  ];

  const items = [
    "DMCS",
    "ACCOUNT MANAGERS",
    " HOTELS",
    "TRAVELLERS",
    "CORPORATE",
  ];

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
      <div className="flex justify-between mb-2 items-center flex-row">
        <div className="flex">
          <Input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="search-bar"
            prefix={<SearchOutlined />}
            placeholder="Search Name"
          />
          <Button className="filter-bar" icon={<BsFilter />}>
            Filter
          </Button>
        </div>
        {ProfileValue.lev !== 4 && (
          <Button
            onClick={showModal}
            className="button-bar"
            icon={<PlusOutlined />}
          >
            Add User
          </Button>
        )}
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddUser getUser={getUser} handleCancel={handleCancel} />
        </Modal>
      </div>
      <div>
        <ul className="list-none tab-btn  flex justify-between my-2 max-w-[600px]">
          <li
            className={`cursor-pointer ${
              activeItem === "" ? "font-bold tab-btn-active" : ""
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
                activeItem === index ? "font-bold tab-btn-active" : ""
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
      />
    </div>
  );
};

export default User;
