"use client";
import { POST_API } from "../../../../(AuthLayout)/components/API/PostAPI";
import ControlInputValue from "../../../../(AuthLayout)/components/Helper/ControlInputValue";
import { formatDate } from "../../../../(AuthLayout)/components/Helper/FormatDate";
import { Input, Table, message } from "antd";
import React, { useEffect, useState } from "react";

const EditPrice = ({
  rowData,
  getAllContractData,
  handleCancel,
  id,
  hotel_id,
}) => {
  const { Occupancy_and_category_cross, hotelValue } =
    ControlInputValue(hotel_id);
  const [dataSource, setDataSource] = useState([]);
  const [editedData, setEditedData] = useState(rowData?.rows);

  const handleChange = (newValue, index, field) => {
    const newData = [...editedData];
    newData[index][field] = Number(newValue);
    setEditedData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };

    // Create an array to hold the formatted prices data
    const formattedPrices = editedData.map((item) => ({
      rId: Number(item.room.id),
      sgl: item.sgl || -1,
      dbl: item.dbl || -1,
      twn: item.twn || -1,
      trl: item.trl || -1,
      qud: item.qud || -1,
      unit: item.unit || -1,
      minS: item.min_stay || -1,
      maxS: item.max_stay || -1,
    }));

    const mutation = `
    mutation {
      editPSC(
        cid: ${id},
        from: "${rowData.from_date}",
        to: "${rowData.to_date}",
        rows: 
          ${JSON.stringify(formattedPrices).replace(/"([^(")"]+)":/g, "$1:")}
        
      ) {
        message
      }
    }
    `;
    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res.data.editPSC?.message === "success") {
        message.success(res.data.editPSC?.message);
        handleCancel();
        getAllContractData();
      } else {
        message.error(res.data.editPSC?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const editedDataArray = editedData.map((item, index) => ({
    key: index,
    category: item.room?.name,
    SGL: item.sgl === 0 ? 0 : item.sgl > 0 ? item.sgl : "",
    DBL: item.dbl === 0 ? 0 : item.dbl > 0 ? item.dbl : "",
    TWN: item.twn === 0 ? 0 : item.twn > 0 ? item.twn : "",
    TRPL: item.trl === 0 ? 0 : item.trl > 0 ? item.trl : "",
    QUAD: item.qud === 0 ? 0 : item.qud > 0 ? item.qud : "",
    unit: item.unit === 0 ? 0 : item.unit > 0 ? item.unit : "",
    minstay: item.minS === 0 ? 0 : item.minS > 0 ? item.minS : "",
    maxstay: item.maxS === 0 ? 0 : item.maxS > 0 ? item.maxS : "",
  }));

  useEffect(() => {
    setDataSource(editedDataArray);
  }, [rowData, editedData, hotel_id, hotelValue]);

  const columns = [
    {
      title: "Room",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "SGL",
      dataIndex: "SGL",
      key: "SGL",
      render: (text, record, index) =>
        Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
          "SGL"
        ) ? (
          <Input
            className="borderedRow active"
            value={text}
            onChange={(e) => handleChange(e.target.value, index, "sgl")}
          />
        ) : (
          <Input readOnly className="borderedRow inactive" />
        ),
    },

    {
      title: "DBL",
      dataIndex: "DBL",
      key: "DBL",
      render: (text, record, index) =>
        Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
          "DBL"
        ) ? (
          <Input
            className="borderedRow active"
            value={text}
            onChange={(e) => handleChange(e.target.value, index, "dbl")}
          />
        ) : (
          <Input readOnly className="borderedRow inactive" />
        ),
    },
    {
      title: "TWN",
      dataIndex: "TWN",
      key: "TWN",
      render: (text, record, index) =>
        Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
          "TWN"
        ) ? (
          <Input
            className="borderedRow active"
            value={text}
            onChange={(e) => handleChange(e.target.value, index, "twn")}
          />
        ) : (
          <Input readOnly className="borderedRow inactive" />
        ),
    },
    {
      title: "TRPL",
      dataIndex: "TRPL",
      key: "TRPL",
      render: (text, record, index) =>
        Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
          "TRPL"
        ) ? (
          <Input
            className="borderedRow active"
            value={text}
            onChange={(e) => handleChange(e.target.value, index, "trl")}
          />
        ) : (
          <Input readOnly className="borderedRow inactive" />
        ),
    },
    {
      title: "QUAD",
      dataIndex: "QUAD",
      key: "QUAD",
      render: (text, record, index) =>
        Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
          "QUAD"
        ) ? (
          <Input
            className="borderedRow active"
            value={text}
            onChange={(e) => handleChange(e.target.value, index, "qud")}
          />
        ) : (
          <Input readOnly className="borderedRow inactive" />
        ),
    },
    {
      title: "unit",
      dataIndex: "unit",
      key: "unit",
      render: (text, record, index) =>
        Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
          "UNIT"
        ) ? (
          <Input
            className="borderedRow active"
            value={text}
            onChange={(e) => handleChange(e.target.value, index, "unit")}
          />
        ) : (
          <Input readOnly className="borderedRow inactive" />
        ),
    },

    {
      title: "min stay",
      dataIndex: "minstay",
      key: "minstay",
      render: (text, record, index) => (
        <Input
          className="borderedRow active"
          value={text}
          onChange={(e) => handleChange(e.target.value, index, "min_stay")}
        />
      ),
    },
    {
      title: "max stay",
      dataIndex: "maxstay",
      key: "maxstay",
      render: (text, record, index) => (
        <Input
          className="borderedRow active"
          value={text}
          onChange={(e) => handleChange(e.target.value, index, "max_stay")}
        />
      ),
    },
  ];

  return (
    <div className="w-full p-10 relative">
      <span className="flex gap-10">
        <p>From: {rowData?.from_date && formatDate(rowData?.from_date)}</p>
        <p>To: {rowData?.to_date && formatDate(rowData?.to_date)}</p>
      </span>

      <div className="h-[200px]">
        <Table size="small" columns={columns} dataSource={dataSource} />
      </div>
      <button
        className="absolute bottom-0 right-10 bg-[#cecece] px-3 py-1 rounded-lg"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

export default EditPrice;
