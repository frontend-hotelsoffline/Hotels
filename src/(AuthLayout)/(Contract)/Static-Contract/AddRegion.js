import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { countryList } from "../../components/Helper/ListOfAllCountries";
import { POST_API } from "../../components/API/PostAPI";

const AddRegion = ({ handleCancel }) => {
  const [formData, setFormData] = useState({});
  const { region, countries } = formData;

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
        create_region_and_countries(   region: "${region}",
        countries: ${JSON.stringify(countries.map(item=>({country: item}))).replace(/"([^"]+)":/g, "$1:")}) {
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
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">Create a region</h1>
      <label className="labelStyle mt-4">Region</label>
      <Input
        name="region"
        value={region}
        onChange={onChange}
        className="w-full border-black"
      />
     
      <label className="labelStyle mt-4">Countries</label>
      <Select mode="multiple"
      showSearch
      filterOption={(input, option) =>
        (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
      }
        value={countries}
        onChange={(value) =>{
            const selectedValues = Array.isArray(value) ? value : [value];
          setFormData((prev) => ({ ...prev, countries: selectedValues }))
        }}
        options={countryList}
        className="border-black w-full"
      />
      <Button htmlType="submit" className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default AddRegion;
