import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useNavigate } from "react-router-dom";
import { countryList } from "../../components/Helper/ListOfAllCountries";

const AddPlacesOfInterest = ({ getPlacesOfInterest, handleCancel }) => {
  const router = useNavigate();
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { name, country, city } = formData;

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
        addPinterest(
          name: "${name ? name : ""}",
          country: "${country}"
          city: "${city}"
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
        message.success(res.data.addPinterest?.message);
        getPlacesOfInterest();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error(
        "Failed to Add Places of Interest, Please check and try again"
      );
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">add Places of Interest</h1>
      <label className="labelStyle mt-4">Places of Interest</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type name here"
      />
      <label className="labelStyle mt-2">country</label>
      <Select
        showSearch
        value={country}
        filterOption={(input, option) =>
          (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
        }
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, country: value }))
        }
        options={countryList}
        className="h-[34px] inputfildinsearch"
      />
      <label className="labelStyle mt-2">city</label>
      <Input
        name="city"
        value={city}
        onChange={onChange}
        className="h-[34px] inputfildinsearch"
      />
      <Button onClick={onSubmit} className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default AddPlacesOfInterest;
