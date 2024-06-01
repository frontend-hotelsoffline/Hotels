import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { handleKeyPress } from "../components/Helper/ValidateInputNumber";

const EditDMCs = ({ getDMCs, handleCancel, record }) => {
  const [formData, setFormData] = useState({
    id: record.id,
    name: record.name,
    status: record.status,
    email: record.email,
  });
  const { name, status, acc_mnger_id, email } = formData;

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
        edit_a_dmc(
            id: ${record.id}
          name: "${name ? name : ""}",
          status: "${status ? status : ""}",
          acc_mnger_id: ${acc_mnger_id}
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

      if (res) {
        message.success("DMCs has been Edited Successfully");
        getDMCs();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Edit DMCs, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">Edit DMCs</h1>
      <label className="labelStyle mt-4">DMCs</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type DMCs name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-6">status</label>
      <Select
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
      <label className="labelStyle mt-6">account manager id</label>
      <Input
        onKeyPress={handleKeyPress}
        name="acc_mnger_id"
        value={acc_mnger_id}
        onChange={onChange}
        className="border-black w-full"
      />
      <label className="labelStyle mt-6">email</label>
      <Input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        className="border-black w-full"
      />
      <Button htmlType="submit" className="m-5 button-bar float-right">
        Save
      </Button>
    </form>
  );
};

export default EditDMCs;
