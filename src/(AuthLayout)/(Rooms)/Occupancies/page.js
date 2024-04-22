"use client";
import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import AddOccupancy from "./AddOccupancy";
import { GET_API } from "../../components/API/GetAPI";
import EditOccupancy from "./EditOccupancy";
import { EditIcon } from "../../components/Customized/EditIcon";

const Occupancies = () => {
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
  const [nameFilter, setNameFilter] = useState("");
  const filteredData = dataSource?.filter((item) =>
    item.occupancy.toLowerCase().includes(nameFilter.toLowerCase())
  );
  const getOccupancy = async () => {
    const GET_ALL = `{
      get_all_Occupancies {
        id
        name
        max_adults
        max_children
        no_of_beds
        no_of_extra_beds
        max_age_for_free_extra_bed
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        const tableArray = res.data.get_all_Occupancies.map((item) => ({
          key: item.id || "",
          id: item.id || "",
          occupancy: item.name || "",
          maxadult: item.max_adults || "",
          maxchild: item.max_children || "",
          numberofbeds: item.no_of_beds || "",
          numberofextrabeds: item.no_of_extra_beds || "",
          max_age_for_free_extra_bed: item.max_age_for_free_extra_bed || "",
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOccupancy();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "occupancy",
      dataIndex: "occupancy",
      key: "occupancy",
      sorter: (a, b) =>
        a.occupancy ? a.occupancy.localeCompare(b.occupancy) : "",
    },
    {
      title: "max adult",
      dataIndex: "maxadult",
      key: "maxadult",
      sorter: (a, b) => (a.maxadult ? a.maxadult - b.maxadult : ""),
    },
    {
      title: "max child",
      dataIndex: "maxchild",
      key: "maxchild",
      sorter: (a, b) => (a.maxchild ? a.maxchild - b.maxchild : ""),
    },
    {
      title: "number of beds",
      dataIndex: "numberofbeds",
      key: "numberofbeds",
      sorter: (a, b) => (a.numberofbeds ? a.numberofbeds - b.numberofbeds : ""),
    },
    {
      title: "number of extra beds",
      dataIndex: "numberofextrabeds",
      key: "numberofextrabeds",
      sorter: (a, b) =>
        a.numberofextrabeds ? a.numberofextrabeds - b.numberofextrabeds : "",
    },
    {
      title: "max age for free extra bed",
      dataIndex: "max_age_for_free_extra_bed",
      key: "max_age_for_free_extra_bed",
      sorter: (a, b) =>
        a.max_age_for_free_extra_bed
          ? a.max_age_for_free_extra_bed - b.max_age_for_free_extra_bed
          : "",
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
          >
            <EditOccupancy
              record={record}
              getOccupancy={getOccupancy}
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
          Add Occupancy
        </Button>
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddOccupancy
            getOccupancy={getOccupancy}
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

export default Occupancies;
