import { Button, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import {
  countryList,
  getAllCitiesOfCountry,
} from "../../components/Helper/ListOfAllCountries";

const EditPlacesOfInterest = ({
  getPlacesOfInterest,
  handleCancel,
  record,
}) => {
  const [formData, setFormData] = useState({});
  const { name, country, city } = formData;
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    record &&
      setFormData({
        name: record.PlacesOfInterest,
        country: record.country,
        city: record.city,
      });
    if (country) {
      const selectedcountry = countryList.find((c) => c.value === country);
      setCityList(getAllCitiesOfCountry(selectedcountry.code));
    } else {
      setCityList([]);
    }
  }, [country, record]);

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
        editPinterest(
            id: ${record.id}
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
      if (res.data.editPinterest) {
        message.success("Places of Interest has been Edited Successfully");
        getPlacesOfInterest();
        handleCancel();
      }
    } catch (error) {
      message.error(
        "Failed to Edit Places of Interest, Please check and try again"
      );
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Places of Interest</h1>
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
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
        }
        onChange={(value) => setFormData((prev) => ({ ...prev, city: value }))}
        options={cityList}
        className="h-[34px] inputfildinsearch"
        value={city}
      />
      <Button onClick={onSubmit} className="m-5 button-bar float-right">
        Save
      </Button>
    </form>
  );
};

export default EditPlacesOfInterest;
