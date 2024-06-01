import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { countryList } from "../../components/Helper/ListOfAllCountries";
import { POST_API } from "../../components/API/PostAPI";

const AddRegion = ({ handleCancel, getRegionsWithCountries }) => {
  const [formData, setFormData] = useState({});
  const { region, countries } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!countries) {
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        addRGNS(   name: "${region}",
        countries: ${JSON.stringify(
          countries?.map((item) => ({ country: item }))
        ).replace(/"([^"]+)":/g, "$1:")}) {
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
      if (res.data.addRGNS?.message === "success") {
        message.success(res.data.addRGNS?.message);
        handleCancel();
        setFormData({});
        getRegionsWithCountries();
      } else {
        message.error(res.data.addRGNS?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  return (
    <form className="p-5">
      <h1 className="title">Add Region</h1>
      <label className="labelStyle">Region</label>
      <Input
        name="region"
        value={region}
        onChange={onChange}
        className="w-full border-black"
      />
      <label className="labelStyle">Countries</label>
      <Select
        mode="multiple"
        showSearch
        filterOption={(input, option) =>
          (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
        }
        value={countries}
        onChange={(value) => {
          const selectedValues = Array.isArray(value) ? value : [value];
          setFormData((prev) => ({ ...prev, countries: selectedValues }));
        }}
        options={countryList}
        className="border-black w-full"
      />
      <Button onClick={onSubmit} className="m-5 action-btn float-right">
        Add Region
      </Button>
    </form>
  );
};

export default AddRegion;
