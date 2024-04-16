"use client";
import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { useNavigate, } from "react-router-dom";
import { POST_API } from "../components/API/PostAPI";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";
import GetAllUsers from "../components/Helper/GetAllUsers";

const AddDMCs = ({ getDMCs, handleCancel }) => {
  const router = useNavigate();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { accManager } = GetAllUsers();
  const [formData, setFormData] = useState({ name: "", status: "" });
  const { name, status, acc_mnger_id, default_markup_id, email, buying_markup_id } = formData;

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
        create_a_dmc(
          name: "${name ? name : ""}",
          status: "${status ? status : ""}",
          acc_mnger_id: ${acc_mnger_id},
          default_selling_markup_id: ${default_markup_id}
          buying_markup_id: ${buying_markup_id}
          email: "${email}"
        ) {
          id,
          name,
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
        message.success("DMCs has been Added Successfully");
        router("/DMCs");
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
      <label className="labelStyle mt-4">DMCs</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type DMCs name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-2">status</label>
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
      <label className="labelStyle mt-2">account manager</label>
      <Select
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
        className="border-black w-full"
      />
      <label className="labelStyle mt-2">default selling markup</label>
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
      <label className="labelStyle mt-2">default buying markup</label>
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
      <label className="labelStyle mt-2">email</label>
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
