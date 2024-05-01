import { Table } from "antd";
import React, { useEffect, useState } from "react";

const TablePopup = ({ record }) => {
  const [popDataSourceRoom, setPopDataSourceRoom] = useState([]);

  useEffect(() => {
    const roomArray = record?.room?.map((item) => ({
      key: item.id || "",
      id: item.id || "",
      category: item?.category?.name || "",
      occupancy:
        item?.occupancies?.map((item) => (
          <ul>
            <li key={item.occupancy.id}>{item.occupancy.name}</li>
          </ul>
        )) || "",
      name: item.name || "",
      status: item.room_status || "",
    }));
    setPopDataSourceRoom(roomArray);
  }, [record]);

  const popColumn = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : ""),
    },
    {
      title: "category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) =>
        a.category ? a.category.localeCompare(b.category) : "",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : ""),
    },
  ];
  return (
    <div className="p-5">
      <h1 className="title">ROOMS</h1>
      <Table size="small" dataSource={popDataSourceRoom} columns={popColumn} />
    </div>
  );
};

export default TablePopup;
