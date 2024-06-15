import { Button, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";

const EditChannel = ({ getChannel, handleCancel, record }) => {
  const [formData, setFormData] = useState({});
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { id, band, resT, mId } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    setFormData({
      id: record.id || "",
      band: record.band || "",
      resT: record.resT || "",
      mId: record.mId || "",
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
    editChannel
        (
          id: ${id},
          band: ${band || ""},
          resT: ${resT || ""},
          mId: ${mId || ""},
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
      <label className="labelStyle mt-4">markup</label>
      <Select
        value={mId}
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        onChange={(value) => setFormData((prev) => ({ ...prev, mId: value }))}
        options={
          MarkUpValue
            ? MarkUpValue?.map((item) => ({
                key: item.id,
                label: item.name,
                value: Number(item.id),
              }))
            : ""
        }
        className="w-full border-black"
      />
      <label className="labelStyle mt-6">Response time</label>
      <Input
        name="resT"
        value={resT}
        onChange={onChange}
        className="border-black w-full"
      />
      <label className="labelStyle mt-6">Bandwidth </label>
      <Input
        name="band"
        value={band}
        onChange={onChange}
        className="border-black w-full"
      />
      <Button htmlType="submit" className="m-5 button-bar float-right">
        Edit
      </Button>
    </form>
  );
};

export default EditChannel;
