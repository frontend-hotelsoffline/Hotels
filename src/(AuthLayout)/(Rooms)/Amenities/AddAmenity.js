import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useNavigate } from "react-router-dom";

const AddAmenity = ({ getAmenities, handleCancel }) => {
  const router = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "" });
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
        addAmenity(
          name: "${name ? name : ""}",
          desc: "${description ? description : ""}",
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
        message.success("Amenity has been Added Successfully");
        getAmenities();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Add Amenity, Please check and try again");
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">add Amenity</h1>
      <label className="labelStyle mt-4">Amenity</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type amenity name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-6">Description</label>
      <TextArea
        name="description"
        value={description}
        onChange={onChange}
        placeholder="type description here"
        className="border-black"
        style={{ height: 150 }}
      />
      <Button onClick={onSubmit} className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default AddAmenity;
