import { Table } from "antd";
import React, { useEffect, useState } from "react";

const PopUpContract = ({ record }) => {
  const [popDataSource, setPopDataSource] = useState([]);
  useEffect(() => {
    const contractArray = record?.Live_static_contracts?.map((item) => ({
      key: item.id || "",
      id: item.id || "",
      name: item.name || "",
      status: item.status || "",
    }));
    const contractArraydy = record?.Live_dynamic_contracts?.map((item) => ({
      key: item.id || "",
      id: item.id || "",
      name: item.name || "",
      status: item.status || "",
    }));
    setPopDataSource([...contractArray, ...contractArraydy]);
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
      <h1 className="title">Contract</h1>
      <Table
        size="small"
        pagination={false}
        dataSource={popDataSource}
        columns={popColumn}
      />
    </div>
  );
};

export default PopUpContract;
