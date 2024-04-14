"use client";
import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter} from "react-icons/bs";
import { HiDotsVertical} from "react-icons/hi";
import { GET_API } from "../../components/API/GetAPI";
import AddPlacesOfInterest from "./AddPlacesOfInterest";
import EditPlacesOfInterest from "./EditPlacesOfInterest";
import {EditIcon}from "../../components/Customized/EditIcon";

const PlacesOfInterest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalEdit = ()=>{
    setIsModalOpenEdit(true)
  }
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEdit(false)
  };
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const filteredData = dataSource.filter((item) => {
    return item.PlacesOfInterest.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getPlacesOfInterest = async () => {
    const GET_ALL = `{
      get_all_places_of_interest {
        id
        name
        country
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        const tableArray = res.data.get_all_places_of_interest.map((item) => ({
          key: item.id||"",
          id: item.id||"",
          PlacesOfInterest: item.name||"",
          country: item.country||""
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPlacesOfInterest();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Places Of Interest",
      dataIndex: "PlacesOfInterest",
      key: "PlacesOfInterest",
      sorter: (a, b) =>
        a.PlacesOfInterest ? a.PlacesOfInterest.localeCompare(b.PlacesOfInterest) : "",
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) =>
        a.country ? a.country.localeCompare(b.country) : "",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (<span className="w-full flex justify-center">
        <Popover
          content={
            <div className="flex flex-col gap-3">
              <Button
                onClick={showModalEdit}
                className="action-btn"
              >
                edit
              </Button>
            </div>
          }
        >
           {EditIcon}
        </Popover>
                <Modal
                  className=""
                  footer={false}
                  open={isModalOpenEdit}
                  onOk={handleCancel}
                  onCancel={handleCancel}
                  >
                  <EditPlacesOfInterest record={record}
                    getPlacesOfInterest={getPlacesOfInterest}
                    handleCancel={handleCancel}
                    />
                </Modal>
                    </span>
      ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between mb-2">
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
        <Button
          onClick={showModal}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Places Of Interest
        </Button>
        <Modal
          className=""
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddPlacesOfInterest
            getPlacesOfInterest={getPlacesOfInterest}
            handleCancel={handleCancel}
          />
        </Modal>
      </div>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    </section>
  );
};

export default PlacesOfInterest;
