import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { currencyList } from "../components/Helper/ListOfAllCountries";
import GetAllDMCs from "../components/Helper/GetAllDMCs";
import GetAllHotels from "../components/Helper/GetAllHotels";
import GetAllCorporates from "../components/Helper/GetAllCorporate";

const AddMoneyByAdmin = ({ getWallet, handleCancel }) => {
  const { DMCsValue } = GetAllDMCs();
  const { hotelValue } = GetAllHotels();
  const { CorporatesValue } = GetAllCorporates();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { OT, oC, amount, oId, curr } = formData;

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
       addMoneyByAdmin(OT: ${OT}, oC: ${oC}, amount: ${amount}, oId: ${oId}, curr: ${curr}) {
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
        message.success(res.data.addMoneyByAdmin?.message);
        getWallet();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Add Facility, Please check and try again");
    }
  };

  return (
    <div className="w-full h-full p-4">
      <h1 className="title capitalize">add wallet</h1>
      <label className="labelStyle mt-4">Owner Type</label>
      <Select
        value={OT}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, OT: value, oC: "" }))
        }
        options={[
          { value: 1, label: "Admin" },
          { value: 2, label: "Account manager" },
          { value: 4, label: "dmc" },
          { value: 6, label: "hotel" },
          { value: 9, label: "corporate" },
          { value: 10, label: "Agent" },
        ]}
        className="w-full border-black"
      />
      <label className="labelStyle mt-4">Owner Company</label>
      <Select
        value={oC}
        onChange={(value) => setFormData((prev) => ({ ...prev, oC: value }))}
        options={
          oC === 4
            ? DMCsValue.map((item) => ({
                value: item.id ? item.id : "",
                label: item.name ? item.name : "",
              }))
            : oC === 6
            ? hotelValue.map((item) => ({
                value: item.id ? item.id : "",
                label: item.name ? item.name : "",
              }))
            : oC === 9
            ? CorporatesValue?.map((item) => ({
                value: item.id ? item.id : "",
                label: item.name ? item.name : "",
              }))
            : null
        }
        className="w-full border-black"
      />
      <label className="labelStyle mt-4">amount</label>
      <Input
        name="amount"
        value={amount}
        onChange={onChange}
        className="w-full border-black"
      />
      <span className="flex w-full gap-2">
        <label className="labelStyle mt-4 w-full">
          Owner ID
          <Input
            name="oId"
            value={oId}
            onChange={onChange}
            className="w-full border-black"
          />
        </label>
        <label className="labelStyle mt-4 w-full">
          currency
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(
                input?.toLowerCase()
              )
            }
            value={curr}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, curr: value }))
            }
            options={currencyList}
            className="w-full"
          />
        </label>
      </span>

      <Button onClick={onSubmit} className="m-5 button-bar float-right">
        Save
      </Button>
    </div>
  );
};

export default AddMoneyByAdmin;
