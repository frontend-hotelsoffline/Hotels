import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import EditChannel from "./EditChannel";
import { GET_API } from "../components/API/GetAPI";
import { EditIcon } from "../components/Customized/EditIcon";

const Channel = () => {
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [rowData, setRowData] = useState([]);

  const showModalEdit = (record) => {
    setIsModalOpenEdit(true);
    setRowData(record);
  };
  const handleCancel = () => {
    setIsModalOpenEdit(false);
  };
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const filteredData = dataSource?.filter((item) => {
    return item.name?.toLowerCase().includes(nameFilter?.toLocaleLowerCase());
  });
  const getChannel = async () => {
    const GET_ALL = `{
      getChannels {
            id
        name
        type
        mId
        resT
        band
        markup {
            id
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
        const tableArray = res.data.getChannels?.map((item) => ({
          key: item.id,
          id: item.id,
          name: item.name || "",
          resT: item.resT || "",
          band: item.band || "",
          mId: item.mId || "",
          markup: item.markup?.markup || "",
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getChannel();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "Channel",
      dataIndex: "name",
      key: "Channel",
      sorter: (a, b) => (a.Channel ? a.Channel.localeCompare(b.Channel) : ""),
    },
    {
      title: "Bandwidth",
      dataIndex: "band",
      key: "band",
      sorter: (a, b) => (a.band ? a.band.localeCompare(b.band) : ""),
    },
    {
      title: "Response time",
      dataIndex: "resT",
      key: "resT",
      sorter: (a, b) => (a.resT ? a.resT.localeCompare(b.resT) : ""),
    },
    {
      title: "markup",
      dataIndex: "markup",
      key: "markup",
      sorter: (a, b) => (a.markup ? a.markup.localeCompare(b.markup) : ""),
    },
    {
      title: "Type",
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
        <EditChannel
          record={rowData}
          getChannel={getChannel}
          handleCancel={handleCancel}
        />
      </Modal>
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
      </div>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        //
        loading={loading}
      />
    </section>
  );
};

export default Channel;
