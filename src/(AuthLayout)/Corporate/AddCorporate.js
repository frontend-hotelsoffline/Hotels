import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { handleKeyPress } from "../components/Helper/ValidateInputNumber";
import { POST_API } from "../components/API/PostAPI";
import GetAllUsers from "../components/Helper/GetAllUsers";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";

const AddCorporate = ({ getCorporate, handleCancel }) => {
  const { accManager } = GetAllUsers();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const [formData, setFormData] = useState({});
  const { name, status, acc_mnger_id, buying_markup_id } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        create_a_corporate(name: "${name}", status: "${status}", acc_mnger_id: ${acc_mnger_id}, buying_markup_id: ${buying_markup_id} ) {
            id
            name
            status
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
        message.success("Corporate has been Added Successfully");
        getCorporate();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Add Corporate, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">add Corporate</h1>
      <label className="labelStyle mt-4">Corporate Name</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Corporate name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-3">status</label>
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        className="h-[25px] w-full"
        options={[
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ]}
        onChange={(value) => {
          setFormData((prevData) => ({
            ...prevData,
            status: value,
          }));
        }}
      />
      <label className="labelStyle mt-1 w-full">account manager</label>
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
      />
      <label className="labelStyle mt-1 w-full">account manager</label>
      <Select
        value={buying_markup_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, buying_markup_id: value }))
        }
        options={
          MarkUpValue
            ? MarkUpValue.map((item) => ({
                key: item.id,
                label: item.name,
                value: Number(item.id),
              }))
            : ""
        }
        className="border-black w-full"
      />
      <Button htmlType="submit" className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default AddCorporate;
