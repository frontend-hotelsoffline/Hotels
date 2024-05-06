import { Button, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import GetAllHotels from "../components/Helper/GetAllHotels";
import GetAllDMCs from "../components/Helper/GetAllDMCs";
import GetAllUsers from "../components/Helper/GetAllUsers";

const CombineDmcHotel = ({ handleCancel, record }) => {
  const { hotelValue } = GetAllHotels();
  const { DMCsValue } = GetAllDMCs();
  const { accManager } = GetAllUsers();
  const [formData, setFormData] = useState({
    hotel_id: record?.hotelid || 0,
    acc_mnger_id: record?.id_acc_mngr?.id || 0,
  });
  const { acc_mnger_id, dmc_id, hotel_id } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        addHtoDMC( dmcid: ${dmc_id}, hid: ${hotel_id}) {
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
      console.log(res);
      if (res) {
        message.success("Successful");
        handleCancel();
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">Assign DMC to hotel</h1>
      {/* <label className="labelStyle mt-1 w-full">account manager</label>
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        className="input-style w-full"
        value={acc_mnger_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, acc_mnger_id: value }))
        }
        options={
          accManager
            ? accManager?.map((item) => ({
                key: item.id,
                label: item.uname,
                value: Number(item.id),
              }))
            : ""
        }
      />*/}
      <label className="labelStyle mt-1 w-full">hotel Name</label>
      <Select
        showSearch
        value={hotel_id}
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        className="input-style w-full"
        options={hotelValue.map((item) => ({
          value: item.id ? item.id : "",
          label: item.name ? item.name : "",
        }))}
        onChange={(value) => {
          setFormData((prevData) => ({
            ...prevData,
            hotel_id: value,
          }));
        }}
      />
      <label className="labelStyle mt-1 w-full">DMC</label>
      <Select
        value={dmc_id}
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        className="input-style w-full"
        options={DMCsValue.map((item) => ({
          value: item.id ? item.id : "",
          label: item.name ? item.name : "",
        }))}
        onChange={(value) => {
          setFormData((prevData) => ({
            ...prevData,
            dmc_id: value,
          }));
        }}
      />
      <Button htmlType="submit" className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default CombineDmcHotel;
