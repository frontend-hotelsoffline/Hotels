import { Button, Input, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { currencyList } from "../components/Helper/ListOfAllCountries";

const TransferMoneyToUserByAdmin = ({ getWallet, handleCancel }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { OT, oC, amount, oId, curr, accountNoOrIban_Email, withdrawAccType } =
    formData;

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
       transferMoneyToUserByAdmin(OT: ${OT}, oC: ${oC}, accountNoOrIban_Email: "${accountNoOrIban_Email}",
        withdrawAccType:${withdrawAccType} amount: ${amount}, oId: ${oId}, curr: ${curr}) {
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
        message.success(res.data.transferMoneyToUserByAdmin?.message);
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
      <h1 className="title capitalize">transfer Money To User</h1>
      <label className="labelStyle mt-2">Owner Type</label>
      <Input
        name="OT"
        value={OT}
        onChange={onChange}
        className="w-full border-black"
      />
      <label className="labelStyle mt-2">Owner Company</label>
      <Input
        name="oC"
        value={oC}
        onChange={onChange}
        className="w-full border-black"
      />
      <label className="labelStyle mt-2">amount</label>
      <Input
        name="amount"
        value={amount}
        onChange={onChange}
        className="w-full border-black"
      />
      <label className="labelStyle mt-2">account No. Or Iban_Email</label>
      <Input
        name="accountNoOrIban_Email"
        value={accountNoOrIban_Email}
        onChange={onChange}
        className="w-full border-black"
      />
      <span className="flex w-full gap-2">
        <label className="labelStyle mt-2 w-full">
          Owner ID
          <Input
            name="oId"
            value={oId}
            onChange={onChange}
            className="w-full border-black"
          />
        </label>
        <label className="labelStyle mt-2 w-full">
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
        <label className="labelStyle mt-2 w-full">
          withdraw Acc. Type
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(
                input?.toLowerCase()
              )
            }
            value={withdrawAccType}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, withdrawAccType: value }))
            }
            options={[
              { value: "bank", label: "bank" },
              { value: "binance", label: "binance" },
              { value: "payoneer", label: "payoneer" },
            ]}
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

export default TransferMoneyToUserByAdmin;
