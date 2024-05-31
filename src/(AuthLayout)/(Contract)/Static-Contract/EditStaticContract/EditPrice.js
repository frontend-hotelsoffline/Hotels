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
  const [editedData, setEditedData] = useState([]);

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

    const formattedPrices = editedData.map((item) => ({
      rId: Number(item.room.id),
      sgl: item.sgl || -1,
      dbl: item.dbl || -1,
      twn: item.twn || -1,
      trl: item.trl || -1,
      qud: item.qud || -1,
      unit: item.unit || -1,
      minS: item.minS || -1,
      maxS: item.maxS || -1,
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

  useEffect(() => {
    if (rowData) {
      setEditedData(rowData?.rows);
    }
  }, [rowData, hotel_id, hotelValue]);

  useEffect(() => {
    console.log("Occupancy_and_category_cross", Occupancy_and_category_cross);
    console.log("editedData", editedData);
  }, [Occupancy_and_category_cross, editedData]);

  const columns = [
    {
      title: "Room",
      dataIndex: "category",
      key: "category",
      render: (text, record, index) => editedData[index]?.room?.name,
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
            value={(editedData[index]?.sgl > 0 && editedData[index]?.sgl) || ""}
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
            value={(editedData[index]?.dbl > 0 && editedData[index]?.dbl) || ""}
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
            value={(editedData[index]?.twn > 0 && editedData[index]?.twn) || ""}
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
            value={(editedData[index]?.trl > 0 && editedData[index]?.trl) || ""}
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
            value={(editedData[index]?.qud > 0 && editedData[index]?.qud) || ""}
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
            value={
              (editedData[index]?.unit > 0 && editedData[index]?.unit) || ""
            }
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
          value={(editedData[index]?.minS > 0 && editedData[index]?.minS) || ""}
          onChange={(e) => handleChange(e.target.value, index, "minS")}
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
          value={(editedData[index]?.maxS > 0 && editedData[index]?.maxS) || ""}
          onChange={(e) => handleChange(e.target.value, index, "maxS")}
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
        <Table
          size="small"
          columns={columns}
          dataSource={editedData}
          pagination={false}
        />
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
