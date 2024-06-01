import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";

const EditChannel = ({ getChannel, handleCancel, record }) => {
  const [formData, setFormData] = useState({
    name: record.name,
    description: record.description,
  });
  const { name, description } = formData;

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
        edit_Channels(
          id: ${record.id},
          name: "${name ? name : ""}",
          type: "${description ? description : ""}",
        ) {
          id,
          description
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
        message.success("Channel has been Edited Successfully");
        getChannel();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Channel, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Channel</h1>
      <label className="labelStyle mt-4">Channel</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Channel name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-6">Type</label>
      <TextArea
        name="description"
        value={description}
        onChange={onChange}
        className="border-black"
        style={{ height: 150 }}
      />
      <Button htmlType="submit" className="m-5 button-bar float-right">
        Edit
      </Button>
    </form>
  );
};

export default EditChannel;
