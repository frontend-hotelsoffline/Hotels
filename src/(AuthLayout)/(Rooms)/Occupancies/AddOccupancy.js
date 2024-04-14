import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useRouter } from "next/navigation";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";

const AddOccupancy = ({ getOccupancy, handleCancel }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    max_adults: 0,
    max_children: 0,
    no_of_beds: 0,
    no_of_extra_beds: 0,
  });
  const {
    name,
    max_adults,
    max_children,
    no_of_beds,
    no_of_extra_beds,
    max_age_for_free_extra_bed,
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
        add_an_occupancy(
          name: "${name ? name : ""}",
          max_adults: ${max_adults ? max_adults : ""},
          max_children: ${max_children ? max_children : ""},
          no_of_beds: ${no_of_beds ? no_of_beds : ""}
          no_of_extra_beds: ${no_of_extra_beds}
          max_age_for_free_extra_bed: ${max_age_for_free_extra_bed}

        ) {
          id,
          name,
          max_adults,
        max_children,
        no_of_beds
        no_of_extra_beds
        max_age_for_free_extra_bed
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
      console.log(res);
      if (res) {
        message.success("Occupancy has been Added Successfully");
        getOccupancy();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Add Occupancy, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">add Occupancy</h1>
      <label className="labelStyle mt-4">Occupancy</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Occupancy name here"
        className="w-full border-black"
      />
      <div className="flex justify-between">
        <span>
          <label className="labelStyle mt-6">Max Adult</label>
          <Input
            onKeyPress={handleKeyPress}
            name="max_adults"
            value={max_adults}
            onChange={onChange}
            className="border-black w-28"
          />
        </span>
        <span>
          <label className="labelStyle mt-6">Max Child</label>
          <Input
            onKeyPress={handleKeyPress}
            name="max_children"
            value={max_children}
            onChange={onChange}
            className="border-black w-28"
          />
        </span>
        <span>
          <label className="labelStyle mt-6">Number of Beds</label>
          <Input
            onKeyPress={handleKeyPress}
            name="no_of_beds"
            value={no_of_beds}
            onChange={onChange}
            className="border-black w-28"
          />
        </span>
        <span>
          <label className="labelStyle mt-6">Number of extra Beds</label>
          <Input
            onKeyPress={handleKeyPress}
            name="no_of_extra_beds"
            value={no_of_extra_beds}
            onChange={onChange}
            className="border-black w-28"
          />
        </span>
      </div>
      <span>
        <label className="labelStyle mt-6">Max age for free extra bed</label>
        <Input
          onKeyPress={handleKeyPress}
          name="max_age_for_free_extra_bed"
          value={max_age_for_free_extra_bed}
          onChange={onChange}
          className="border-black w-28"
        />
      </span>
      <Button onClick={onSubmit} className="m-5 list-btn float-right">
        Save
      </Button>
    </form>
  );
};

export default AddOccupancy;
