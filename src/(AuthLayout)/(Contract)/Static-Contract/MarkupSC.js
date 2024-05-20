import { Button, Select, message } from "antd";
import GetAllPricingMarkUp from "../../components/Helper/GetAllPricingMarkUp";
import { POST_API } from "../../components/API/PostAPI";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import GetAllDMCs from "../../components/Helper/GetAllDMCs";
import GetAllUsers from "../../components/Helper/GetAllUsers";

const MarkupSC = ({ id, getAllContractData }) => {
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { DMCsValue } = GetAllDMCs();
  const { userAgent, userCoop } = GetAllUsers();
  const [formData, setFormData] = useState({});
  const { price_markup_id, buyerId, buyertype, markupid } = formData;
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
      message.error("Failed");
    }
  };
  const onSubmitExtraMarkup = async (e) => {
    e.preventDefault();
    if (!buyerId || !id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
        mutation {
            addEBMarkSC(cid: ${id}, bid_0_All: ${buyerId}, mid: ${markupid}, btype: ${buyertype}) {
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
      if (res.data.addEBMarkSC?.message === "success") {
        message.success(res.data.addEBMarkSC?.message);
        getAllContractData();
        setFormData({});
      } else {
        message.error(res.data.addEBMarkSC?.message);
      }
    } catch (error) {
      message.error("Failed");
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
              ? MarkUpValue?.map((item) => ({
                  key: item.id,
                  label: item.name,
                  value: Number(item.id),
                }))
              : ""
          }
        />
        <Button
          onClick={onSubmitMarkup}
          className="action-btn absolute right-5 bottom-2"
        >
          Update
        </Button>
      </span>
      <span className="w-full border border-black rounded-3xl h-[150px] relative p-5">
        <h1 className="title">extra markup for special buyer</h1>
        <div className="flex w-full justify-between">
          <span>
            <label className="labelStyle">buyer type</label>
            <Select
              value={buyertype}
              className="min-w-[200px] capitalize font-normal"
              onChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  buyertype: value,
                  buyerId: 0,
                }));
              }}
              options={[
                { value: "dmc", label: "DMC" },
                { value: "agent", label: "Agent" },
                { value: "coop", label: "Corporate" },
              ]}
            />
          </span>
          <span>
            <label className="labelStyle">buyer ID</label>
            <Select
              value={buyerId}
              className="min-w-[200px] capitalize font-normal"
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, buyerId: value }));
              }}
              options={
                buyertype === "dmc"
                  ? DMCsValue?.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: item.id,
                    }))
                  : buyertype === "agent"
                  ? userAgent?.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: item.id,
                    }))
                  : buyertype === "coop"
                  ? userCoop?.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: item.id,
                    }))
                  : ""
              }
            />
          </span>
          <span>
            <label className="labelStyle">markup</label>
            <Select
              value={markupid}
              className="min-w-[200px] capitalize font-normal"
              onChange={(value) => {
                setFormData((prev) => ({ ...prev, markupid: value }));
              }}
              options={
                MarkUpValue
                  ? MarkUpValue?.map((item) => ({
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
          onClick={onSubmitExtraMarkup}
          className="action-btn absolute right-5 bottom-2"
          icon={<PlusOutlined />}
        >
          Add
        </Button>
      </span>
    </div>
  );
};

export default MarkupSC;
