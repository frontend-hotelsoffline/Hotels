import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useNavigate, } from "react-router-dom";

const EditRoomView = ({ getAllRoomView, handleCancel, record }) => {
  const router = useNavigate();
  const [formData, setFormData] = useState({
    name: record.roomview,
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
        edit_a_room_view(
          id: ${record.id},
          name: "${name ? name : ""}",
          description: "${description ? description : ""}",
        ) {
          id
          name
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
      console.log(res);
      if (res) {
        message.success("Room View has been Edited Successfully");
        getAllRoomView();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Room View, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit RoomView</h1>
      <label className="labelStyle mt-4">Room View</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type RoomView name here"
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

export default EditRoomView;
