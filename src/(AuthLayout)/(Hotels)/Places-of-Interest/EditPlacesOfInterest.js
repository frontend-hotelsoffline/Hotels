import { Button, Input, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useRouter } from "next/navigation";
import { countryList } from "../../components/Helper/ListOfAllCountries";

const EditPlacesOfInterest = ({getPlacesOfInterest, handleCancel, record }) => {
    console.log(record)
    const router = useRouter()
    const [formData, setFormData] = useState({name: record.PlacesOfInterest, country: record.country})
    const {name,country} = formData

    const onChange = (e)=>{
        setFormData(prev=>({...prev, [e.target.name] : e.target.value }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const headers = {
          "Content-Type": "application/json",
        };
        const mutation = `
      mutation {
        edit_a_Place_of_interest(
            id: ${record.id}
          name: "${name ? name : ""}",
          country: "${country}"
        ) {
          id,
          name
          country
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
              message.success("Places of Interest has been Edited Successfully")
              getPlacesOfInterest()
              handleCancel()
          }
        } catch (error) {
          message.error("Failed to Edit Places of Interest, Please check and try again")
          console.error(error);
        }
      };

  return (
    <form className="w-full h-full p-4">
        <h1 className="title capitalize">Edit Places of Interest</h1>
      <label className="labelStyle mt-4">Places of Interest</label>
      <Input name="name" value={name} onChange={onChange} placeholder="type name here"/>
      <label className="labelStyle mt-2">country</label>
      <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label?.toLowerCase() ?? "").includes(
                  input?.toLowerCase()
                )
              }
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, country: value }))
              }
              options={countryList}
              className="h-[34px] inputfildinsearch"
            />
      <Button onClick={onSubmit} className="m-5 list-btn float-right">Save</Button>
    </form>
  );
};

export default EditPlacesOfInterest;
