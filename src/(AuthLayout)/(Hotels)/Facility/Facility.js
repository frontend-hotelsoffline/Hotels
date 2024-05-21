import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import { GET_API } from "../../components/API/GetAPI";
import AddFacility from "./AddFacility";
import EditFacility from "./EditFacility";
import { EditIcon } from "../../components/Customized/EditIcon";

const Facility = () => {
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
  const filteredData = dataSource?.filter((item) => {
    return item.facility.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getFacilities = async () => {
    const GET_ALL = `{
      getfacilities {
        id
        name
        desc
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        const tableArray = res.data.getfacilities?.map((item) => ({
          key: item.id,
          id: item.id,
          facility: item.name,
          description: item.desc,
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFacilities();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "Facility",
      dataIndex: "facility",
      key: "Facility",
      sorter: (a, b) =>
        a.facility ? a.facility.localeCompare(b.facility) : "",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
      sorter: (a, b) =>
        a.description ? a.description.localeCompare(b.description) : "",
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
            <EditFacility
              record={record}
              getFacilities={getFacilities}
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
          Add Facility
        </Button>
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddFacility
            getFacilities={getFacilities}
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

export default Facility;
