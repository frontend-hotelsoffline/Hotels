import { Button, Input, Table, Modal, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import AddCategory from "./AddCategory";
import { GET_API } from "../../components/API/GetAPI";
import EditCategory from "./EditCategory";
import { EditIcon } from "../../components/Customized/EditIcon";

const Categories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [rowData, setrowData] = useState([]);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalEdit = (record) => {
    setIsModalOpenEdit(true);
    setrowData(record);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
  };

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const [nameFilter, setnameFilter] = useState("");
  const filteredData = dataSource?.filter((item) => {
    return item.category.toLowerCase().includes(nameFilter.toLowerCase());
  });

  const getCategory = async () => {
    const GET_ALL = `{
      getCtgories {
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
      if (res.data) {
        const tableArray = res.data.getCtgories.map((item) => ({
          key: item.id,
          id: item.id,
          category: item.name,
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
    getCategory();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "Category",
      sorter: (a, b) =>
        a.category ? a.category.localeCompare(b.category) : "",
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
      render: (text, record) => (
        <span className="w-full flex justify-center">
          <Popover
            content={
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => showModalEdit(record)}
                  className="action-btn"
                >
                  edit
                </Button>
              </div>
            }
          >
            {EditIcon}
          </Popover>
        </span>
      ),
    },
  ];

  return (
    <section>
      <Modal
        footer={false}
        open={isModalOpenEdit}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        <EditCategory
          record={rowData}
          getCategory={getCategory}
          handleCancel={handleCancel}
        />
      </Modal>
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
          Add Category
        </Button>
        <Modal
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddCategory getCategory={getCategory} handleCancel={handleCancel} />
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

export default Categories;
