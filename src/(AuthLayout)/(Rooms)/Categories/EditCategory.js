import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";

const EditCategory = ({ getCategory, handleCancel, record }) => {
  const [formData, setFormData] = useState({});
  const { name, description } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    record &&
      setFormData({
        name: record.category,
        description: record.description,
      });
  }, [record]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        editCtgory(
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

      if (res.data.editCtgory) {
        message.success("Category has been Edited Successfully");
        getCategory();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Category, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Category</h1>
      <label className="labelStyle mt-4">Category</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Category name here"
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

export default EditCategory;
