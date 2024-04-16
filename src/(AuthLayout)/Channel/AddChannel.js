import { Button, Input, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { useNavigate, } from "react-router-dom";
import { POST_API } from "../components/API/PostAPI";

const AddChannel = ({getChannel, handleCancel}) => {
    const router = useNavigate()
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
        create_a_channel(
          name: "${name ? name : ""}",
          description: "${description ? description : ""}",
        ) {
          id,
          name,
          description
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
              message.success("Channel has been Added Successfully")
              getChannel()
              handleCancel()
              setFormData({})
          }
        } catch (error) {
          message.error("Failed to Add Channel, Please check and try again")
          console.error(error);
        }
      };

  return (
    <form onSubmit={onSubmit} className="w-full h-full p-4">
        <h1 className="title capitalize">add Channel</h1>
      <label className="labelStyle mt-4">Channel</label>
      <Input name="name" value={name} onChange={onChange} placeholder="type Channel name here" className="w-full border-black"/>
      <label className="labelStyle mt-6">Description</label>
      <TextArea name="description" value={description} onChange={onChange} placeholder="type description here" className="border-black" style={{height: 150}}/>
      <Button htmlType="submit" className="m-5 list-btn float-right">Save</Button>
    </form>
  );
};

export default AddChannel;
