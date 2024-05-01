import { Table } from "antd";
import React, { useEffect, useState } from "react";

const PopUpHotel = ({ record }) => {
  const [popDataSource, setPopDataSource] = useState([]);

  useEffect(() => {
    const roomArray = record?.hotels_of_the_dmc?.map((item) => ({
      key: item?.hotel?.id || "",
      id: item?.hotel?.id || "",
      name: item?.hotel?.name || "",
      status: item?.hotel?.hotel_status || "",
    }));
    setPopDataSource(roomArray);
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
      title: "status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => (a.status ? a.status.localeCompare(b.status) : ""),
    },
  ];
  return (
    <div className="p-5">
      <h1 className="title">Hotels</h1>
      <Table size="small" dataSource={popDataSource} columns={popColumn} />
    </div>
  );
};

export default PopUpHotel;
