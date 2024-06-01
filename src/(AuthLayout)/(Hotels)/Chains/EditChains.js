import { Button, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";

const EditChains = ({ getChains, handleCancel, record }) => {
  const [formData, setFormData] = useState({});
  const { name } = formData;
  useEffect(() => {
    record &&
      setFormData({
        name: record.name,
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
        editChain(
            id: ${record.id}
          name: "${name ? name : ""}",
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
      if (res.data.editChain) {
        message.success("Chains has been Edited Successfully");
        getChains();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Chains, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Chains</h1>
      <label className="labelStyle mt-4">Chains</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type name here"
        className="w-full border-black"
      />
      <Button onClick={onSubmit} className="m-5 button-bar float-right">
        Save
      </Button>
    </form>
  );
};

export default EditChains;
