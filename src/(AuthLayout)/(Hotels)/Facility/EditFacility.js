import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";

const EditFacility = ({ getFacilities, handleCancel, record }) => {
  const [formData, setFormData] = useState({});
  const { name, description } = formData;
  useEffect(() => {
    record &&
      setFormData({
        name: record.facility,
        description: record.description,
      });
  }, []);

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
        editfacility(
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
      if (res) {
        message.success("Facility has been Edited Successfully");
        getFacilities();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Facility, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit facility</h1>
      <label className="labelStyle mt-4">Facility</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type facility name here"
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
      <Button onClick={onSubmit} className="m-5 button-bar float-right">
        Edit
      </Button>
    </form>
  );
};

export default EditFacility;
