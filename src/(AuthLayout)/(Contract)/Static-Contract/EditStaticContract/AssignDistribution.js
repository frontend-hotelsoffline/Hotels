"use client";
import { Input, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import GetAllPricingMarkUp from "../../../components/Helper/GetAllPricingMarkUp";
import { POST_API } from "../(AuthLayout)/components/API/PostAPI";

const AssignDistribution = ({
  id,handleCancel,
  getAllContractData,
}) => {
  const { MarkUpValue } = GetAllPricingMarkUp();
  const [formData, setFormData] = useState({})
  const { price_markup_id,} = formData

  const onSubmit = async (e) => {
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
      assign_a_pricing_markup_for_static_contract(
        array_of_inputs: [{ id: 1, price_markup_id: 2 }, { id: 2, price_markup_id: 1 }]
    ) {
      id
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
      if (res.data && !res.errors) {
        message.success("Successful");
        getAllContractData();
        setFormData({});
        handleCancel()
      }else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
    }
  };


  return (
    <div className="w-full p-10 relative">
      <h1 className="title">Assign a pricing markup</h1>
          <label className="labelStyle">Markup</label>
       <Select
          value={price_markup_id}
          className="w-[200px] capitalize font-normal"
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
          }/>
      <button onClick={onSubmit}
        className="absolute bottom-0 right-10 bg-[#cecece] px-3 py-1 rounded-lg"
      >
        Submit
      </button>
    </div>
  );
};

export default AssignDistribution;
