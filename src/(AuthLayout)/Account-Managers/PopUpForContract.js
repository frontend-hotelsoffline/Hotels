import { Table } from "antd";
import React, { useEffect, useState } from "react";

const PopUpForContract = ({ record }) => {
  const [popDataSource, setPopDataSource] = useState([]);
  useEffect(() => {
    const contractArray =
      record?.indirect_dynamic_Live_contracts_if_acc_mnger?.map((item) => ({
        key: item.id || "",
        id: item.id || "",
        name: item.name || "",
        status: item.status || "",
      }));
    const contractArrayD =
      record?.indirect_static_Live_contracts_if_acc_mnger?.map((item) => ({
        key: item.id || "",
        id: item.id || "",
        name: item.name || "",
        status: item.status || "",
      }));
    const contractArrayDi =
      record?.direct_static_Live_conracts_if_acc_mngr?.map((item) => ({
        key: item.id || "",
        id: item.id || "",
        name: item.name || "",
        status: item.status || "",
      }));
    const contractArraydy =
      record?.direct_dynamic_Live_conracts_if_acc_mngr?.map((item) => ({
        key: item.id || "",
        id: item.id || "",
        name: item.name || "",
        status: item.status || "",
      }));
    setPopDataSource([
      ...contractArray,
      ...contractArraydy,
      ...contractArrayD,
      ...contractArrayDi,
    ]);
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
      <Table size="small" dataSource={popDataSource} columns={popColumn} />
    </div>
  );
};

export default PopUpForContract;
