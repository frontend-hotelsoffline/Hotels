import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { handleKeyPress } from "../components/Helper/ValidateInputNumber";
import { POST_API } from "../components/API/PostAPI";
import GetAllUsers from "../components/Helper/GetAllUsers";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";
import { countryList } from "../components/Helper/ListOfAllCountries";

const AddCorporate = ({ getCorporate, handleCancel }) => {
  const { accManager } = GetAllUsers();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const [formData, setFormData] = useState({});
  const {
    name,
    status,
    acc_mnger_id,
    buying_markup_id,
    email,
    whatsapp,
    whatsappCode,
  } = formData;

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
        addcoop(name: "${name}", status: ${status},email: "${email}", a_mngrId: ${acc_mnger_id},
      whatsapp: "${whatsappCode || ""}${whatsapp || ""}"
       BMid: ${buying_markup_id} ) {
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
      if (res.data.addcoop?.message === "success") {
        message.success(res.data.addcoop?.message);
        getCorporate();
        handleCancel();
        setFormData({});
      } else {
        message.error(res.data.addcoop?.message);
      }
    } catch (error) {
      message.error("Failed to Add Corporate, Please check and try again");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">add Corporate</h1>
      <label className="labelStyle mt-4">Corporate Name</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Corporate name here"
        className="w-full border-black"
      />
      <label className="labelStyle mt-3">status</label>
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        className="w-full"
        options={[
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ]}
        onChange={(value) => {
          setFormData((prevData) => ({
            ...prevData,
            status: value,
          }));
        }}
      />
      <label className="labelStyle mt-4">Email</label>
      <Input
        name="email"
        value={email}
        onChange={onChange}
        className="w-full border-black"
      />
      <label className="labelStyle mt-1 w-full">account manager</label>
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        className="input-style w-full"
        value={acc_mnger_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, acc_mnger_id: value }))
        }
        options={
          accManager
            ? accManager?.map((item) => ({
                key: item.id,
                label: item.name,
                value: item.id,
              }))
            : ""
        }
      />
      <label className="labelStyle mt-1 w-full">Buying Markup</label>
      <Select
        value={buying_markup_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, buying_markup_id: value }))
        }
        options={
          MarkUpValue
            ? MarkUpValue.map((item) => ({
                key: item.id,
                label: item.name,
                value: item.id,
              }))
            : ""
        }
        className="border-black w-full"
      />{" "}
      <label className="labelStyle mt-1">whatsapp</label>
      <Input.Group compact>
        <Select
          showSearch
          value={whatsappCode}
          filterOption={(input, option) =>
            (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
          }
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, whatsappCode: value }))
          }
          options={countryList?.map((item) => ({
            value: item.phone,
            label: `${item.value} (+${item.phone})`,
          }))}
          style={{ width: "50%" }}
        />
        <Input
          style={{ width: "50%" }}
          name="whatsapp"
          value={whatsapp}
          onChange={onChange}
          placeholder="Number"
          className="input-style"
        />
      </Input.Group>
      <Button htmlType="submit" className="m-5 button-bar float-right">
        Save
      </Button>
    </form>
  );
};

export default AddCorporate;
