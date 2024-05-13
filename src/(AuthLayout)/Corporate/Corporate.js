"use client";
import { Button, Input, Table, Modal, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import { GET_API } from "../components/API/GetAPI";
import AddCorporate from "./AddCorporate";

const Corporate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
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
  const [loading, setLoading] = useState(false);

  const [nameFilter, setnameFilter] = useState("");
  const filteredData = dataSource?.filter((item) => {
    return item.name?.toLowerCase().includes(nameFilter.toLowerCase());
  });

  const getCorporate = async () => {
    const GET_ALL = `{
      getcoops {
        id
        name
        status
        email
        a_mngr
        BM
        buyM {
            id
            CRT
            name
            markup
        }
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      if (res.data) {
        const tableArray = res.data.getcoops?.map((item) => ({
          key: item.id,
          id: item.id,
          name: item.name,
          status: item.status,
          markup: item.buyM.markup && (item.buyM.markup * 1).toFixed(2) + "%",
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCorporate();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Corporate",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : ""),
    },
    {
      title: "markup",
      dataIndex: "markup",
      key: "markup",
      sorter: (a, b) => (a.markup ? a.markup.localeCompare(b.markup) : ""),
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : ""),
    },
  ];

  return (
    <section>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Input
            value={nameFilter}
            onChange={(e) => setnameFilter(e.target.value)}
            className="search-bar"
            prefix={<SearchOutlined />}
            placeholder="Search Name"
          />
          <Button className="filter-bar" icon={<BsFilter />}>
            Filter
          </Button>
        </div>
        <Button
          onClick={showModal}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Corporate
        </Button>
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddCorporate
            getCorporate={getCorporate}
            handleCancel={handleCancel}
          />
        </Modal>
      </div>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
      />
    </section>
  );
};

export default Corporate;
