import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useRouter } from "next/navigation";

const AddChains = ({getChains, handleCancel}) => {
    const router = useRouter()
    const [formData, setFormData] = useState({name: '', description:''})
    const {name, description} = formData

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
        create_a_hotel_chain(
          name: "${name ? name : ""}",
        ) {
          id,
          name
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
              message.success("Chains has been Added Successfully")
              getChains()
              handleCancel()
              setFormData({})
          }
        } catch (error) {
          message.error("Failed to Add Chains, Please check and try again")
        }
      };

  return (
    <form className="w-full h-full p-4">
        <h1 className="title capitalize">add Chains</h1>
      <label className="labelStyle mt-4">Chains</label>
      <Input name="name" value={name} onChange={onChange} placeholder="type name here" className="w-full border-black"/>
     <Button onClick={onSubmit} className="m-5 list-btn float-right">Save</Button>
    </form>
  );
};

export default AddChains;
