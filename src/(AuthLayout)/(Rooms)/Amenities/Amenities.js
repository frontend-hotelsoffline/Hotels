"use client";
import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter} from "react-icons/bs";
import { HiDotsVertical} from "react-icons/hi";
import { GET_API } from "../../components/API/GetAPI";
import AddAmenity from "./AddAmenity";
import EditAmenity from "./EditAmenity";
import {EditIcon}from "../../components/Customized/EditIcon";

const Amenities = () => {
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
  const [nameFilter, setnameFilter] = useState("");
  const filteredData = dataSource.filter((item) => {
    return item.amenity.toLowerCase().includes(nameFilter.toLowerCase());
  });

  const getAmenities = async () => {
    const GET_ALL = `{
      get_all_Amenities {
        id
        name
        description
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        const tableArray = res.data.get_all_Amenities.map((item) => ({
          key: item.id,
          id: item.id,
          amenity: item.name,
          description: item.description,
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAmenities();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Amenity",
      dataIndex: "amenity",
      key: "amenity",
      sorter: (a, b) => (a.amenity ? a.amenity.localeCompare(b.amenity) : ""),
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) =>
        a.description ? a.description.localeCompare(b.description) : "",
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
                  footer={false}
                  open={isModalOpenEdit}
                  onOk={handleCancel}
                  onCancel={handleCancel}
                >
                  <EditAmenity record={record}
                    getAmenities={getAmenities}
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
          Add Amenity
        </Button>
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddAmenity getAmenities={getAmenities} handleCancel={handleCancel} />
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

export default Amenities;
