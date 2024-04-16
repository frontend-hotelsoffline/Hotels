import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useNavigate, } from "react-router-dom";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";

const EditOccupancy = ({ getOccupancy, handleCancel, record }) => {
  console.log(record);
  const router = useNavigate();
  const [formData, setFormData] = useState({
    name: record.occupancy || "",
    max_adults: record.maxadult || 0,
    max_children: record.maxchild || 0,
    no_of_beds: record.numberofbeds || 0,
    no_of_extra_beds: record.numberofextrabeds || 0,
    max_age_for_free_extra_bed: record.max_age_for_free_extra_bed || 0,
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
        edit_an_occupancy(
            id: ${record.id}
          name: "${name ? name : ""}",
          max_adults: ${max_adults ? max_adults : ""},
          max_children: ${max_children ? max_children : ""},
          no_of_beds: ${no_of_beds ? no_of_beds : ""}
          no_of_extra_beds: ${no_of_extra_beds ? no_of_extra_beds : ""}
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
        message.success("Occupancy has been Edited Successfully");
        getOccupancy();
        handleCancel();
      }
    } catch (error) {
      message.error("Failed to Edit Occupancy, Please check and try again");
      console.error(error);
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize">Edit Occupancy</h1>
      <label className="labelStyle mt-4">Occupancy</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type Occupancy name here"
        className="w-full "
      />
      <div className="flex justify-between">
        <span>
          <label className="labelStyle mt-6">Max Adult</label>
          <Input
            onKeyPress={handleKeyPress}
            name="max_adults"
            value={max_adults}
            onChange={onChange}
            className=" w-28"
          />
        </span>
        <span>
          <label className="labelStyle mt-6">Max Child</label>
          <Input
            onKeyPress={handleKeyPress}
            name="max_children"
            value={max_children}
            onChange={onChange}
            className=" w-28"
          />
        </span>
        <span>
          <label className="labelStyle mt-6">Number of Beds</label>
          <Input
            onKeyPress={handleKeyPress}
            name="no_of_beds"
            value={no_of_beds}
            onChange={onChange}
            className=" w-28"
          />
        </span>
        <span>
          <label className="labelStyle mt-6">Number of extra Beds</label>
          <Input
            onKeyPress={handleKeyPress}
            name="no_of_extra_beds"
            value={no_of_extra_beds}
            onChange={onChange}
            className=" w-28"
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
          className=" w-28"
        />
      </span>
      <Button onClick={onSubmit} className="m-5 list-btn float-right">
        Edit
      </Button>
    </form>
  );
};

export default EditOccupancy;
