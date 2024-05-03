"use client";
import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { POST_API } from "../components/API/PostAPI";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";
import GetAllUsers from "../components/Helper/GetAllUsers";

const AddDMCs = ({ getDMCs, handleCancel }) => {
  const router = useNavigate();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { accManager } = GetAllUsers();
  const [formData, setFormData] = useState({ name: "", status: "" });
  const {
    name,
    status,
    acc_mnger_id,
    default_markup_id,
    email,
    buying_markup_id,
  } = formData;

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
        addDMC(
          name: "${name ? name : ""}",
          status: ${status ? status : ""},
          a_mngrId: ${acc_mnger_id},
          SMid: ${default_markup_id}
          BMid: ${buying_markup_id}
          email: "${email}"
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
      if (res) {
        message.success(res.data.addDMC?.message);
        getDMCs();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Add DMCs, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">add DMCs</h1>
      <label className="labelStyle">DMCs</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type DMCs name here"
        className="w-full border-black"
      />
      <label className="labelStyle">status</label>
      <Select
        name="status"
        value={status}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, status: value }))
        }
        options={[
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ]}
        className="border-black w-full"
      />
      <label className="labelStyle">account manager</label>
      <Select
        value={acc_mnger_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, acc_mnger_id: value }))
        }
        options={
          accManager
            ? accManager?.map((item) => ({
                key: item.id,
                label: item.name,
                value: Number(item.id),
              }))
            : ""
        }
        className="border-black w-full"
      />
      <label className="labelStyle">default selling markup</label>
      <Select
        value={default_markup_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, default_markup_id: value }))
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
      <label className="labelStyle">default buying markup</label>
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
      <label className="labelStyle">email</label>
      <Input
        name="email"
        value={email}
        onChange={onChange}
        type="email"
        className="border-black w-full"
      />
      <Button htmlType="submit" className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default AddDMCs;
