import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";

const EditAmenity = ({ getAmenities, handleCancel, record }) => {
  const [formData, setFormData] = useState({});
  const { name, description } = formData;

  useEffect(() => {
    record &&
      setFormData({
        name: record.amenity,
        description: record.description,
      });
  }, [record]);

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
        editAmenity(
          id: ${record.id},
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
      if (res.data?.editAmenity) {
        message.success(res.data.editAmenity?.message);
        getAmenities();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Amenity, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Amenity</h1>
      <label className="labelStyle mt-4">Amenity</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Amenity name here"
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
        Edit
      </Button>
    </form>
  );
};

export default EditAmenity;
