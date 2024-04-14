import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { handleKeyPress } from "../components/Helper/ValidateInputNumber";

const EditPricing = ({ record, getPricing, handleCancel }) => {
  const [formData, setFormData] = useState({
    id: record.id || "",
    name: record.name || "",
    markup: record.markup || "",
  });
  const { name, markup, id } = formData;

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
        edit_a_pricing_markups(
          id: ${id}
            name: "${name}"
            markup: ${markup}
        )  {
          id
          name
          markup}
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
        message.success("Pricing has been Edited Successfully");
        getPricing();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Edit Pricing, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Pricing</h1>
      <label className="labelStyle mt-4">Pricing Name</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Pricing name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-3">markup</label>
      <Input
        max={1}
        min={0}
        step={0.01}
        onKeyPress={handleKeyPress}
        name="markup"
        value={markup}
        onChange={onChange}
        className="border-black w-full"
      />
      <Button htmlType="submit" className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default EditPricing;
