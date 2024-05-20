import { Button, Select, message } from "antd";
import GetAllPricingMarkUp from "../../components/Helper/GetAllPricingMarkUp";
import { POST_API } from "../../components/API/PostAPI";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const MarkupSC = ({ id, getAllContractData }) => {
  const { MarkUpValue } = GetAllPricingMarkUp();
  const [formData, setFormData] = useState({});
  const { price_markup_id } = formData;
  const onSubmitMarkup = async (e) => {
    e.preventDefault();
    if (!price_markup_id || !id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
        mutation {
          editSCMMarkup(
            cid: ${id}
            Mid: ${price_markup_id}
        ) {
            message
        }}
      `;

    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res.data.editSCMMarkup?.message === "success") {
        message.success(res.data.editSCMMarkup?.message);
        getAllContractData();
        setFormData({});
      } else {
        message.error(res.data.editSCMMarkup?.message);
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
    }
  };
  return (
    <div className="flex gap-5 w-full">
      <span className="w-[300px] border border-black rounded-3xl h-[150px] relative p-5">
        <h1 className="title">default markup</h1>
        <label className="labelStyle">markup</label>
        <Select
          value={price_markup_id}
          className="min-w-[200px] capitalize font-normal"
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, price_markup_id: value }));
          }}
          options={
            MarkUpValue
              ? MarkUpValue.map((item) => ({
                  key: item.id,
                  label: item.name,
                  value: Number(item.id),
                }))
              : ""
          }
        />
        <Button
          onClick={onSubmitMarkup}
          className="action-btn absolute right-3 bottom-2"
        >
          update
        </Button>
      </span>
      <span className="w-full border border-black rounded-3xl h-[150px] relative p-5">
        <h1 className="title">extra markup for special buyer</h1>
        <div className="flex w-full justify-between">
          <span>
            <label className="labelStyle">buyer type</label>
            <Select
              value={price_markup_id}
              className="min-w-[200px] capitalize font-normal"
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, price_markup_id: value }));
              }}
              options={
                MarkUpValue
                  ? MarkUpValue.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: Number(item.id),
                    }))
                  : ""
              }
            />
          </span>
          <span>
            <label className="labelStyle">buyer ID</label>
            <Select
              value={price_markup_id}
              className="min-w-[200px] capitalize font-normal"
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, price_markup_id: value }));
              }}
              options={
                MarkUpValue
                  ? MarkUpValue.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: Number(item.id),
                    }))
                  : ""
              }
            />
          </span>
          <span>
            <label className="labelStyle">markup</label>
            <Select
              value={price_markup_id}
              className="min-w-[200px] capitalize font-normal"
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, price_markup_id: value }));
              }}
              options={
                MarkUpValue
                  ? MarkUpValue.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: Number(item.id),
                    }))
                  : ""
              }
            />
          </span>
        </div>
        <Button
          onClick={onSubmitMarkup}
          className="action-btn absolute right-3 bottom-2"
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </span>
    </div>
  );
};

export default MarkupSC;
