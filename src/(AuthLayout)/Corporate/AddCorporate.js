import { Button, Form, Input, Select, Upload, message } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { POST_API } from "../components/API/PostAPI";
import GetAllUsers from "../components/Helper/GetAllUsers";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";
import { countryList } from "../components/Helper/ListOfAllCountries";

const AddCorporate = ({ getCorporate, handleCancel }) => {
  const { accManager } = GetAllUsers();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const {
    name,
    status,
    acc_mnger_id,
    buying_markup_id,
    email,
    whatsapp,
    whatsappCode,
    Address,
  } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const [form] = Form.useForm();
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const mutation = `
      mutation ( $idPic: Upload, $Psport: Upload , $OtherPic: Upload, $tradeLic: Upload){
        addcoop(name: "${name}", status: ${status},email: "${email}", a_mngrId: ${acc_mnger_id},
      whatsapp: "${whatsappCode || ""}${whatsapp || ""}"
      Address: "${Address}", 
      idPic: $idPic
      tradeLic: $tradeLic
      Psport: $Psport
      OtherPic: $OtherPic
       BMid: ${buying_markup_id} ) {
            message
        }
      }
    `;

    const path = "";
    try {
      const operations = {
        query: mutation,
        variables: {
          idPic: null,
          Psport: null,
          OtherPic: null,
          tradeLic: null,
        },
      };

      const map = {
        0: ["variables.idPic"],
        1: ["variables.Psport"],
        2: ["variables.OtherPic"],
        3: ["variables.tradeLic"],
      };

      const formDataToSend = new FormData();
      formDataToSend.append("operations", JSON.stringify(operations));
      formDataToSend.append("map", JSON.stringify(map));

      if (values.idPic && values.idPic[0] && values.idPic[0].originFileObj) {
        formDataToSend.append("0", values.idPic[0].originFileObj.toString());
      }
      if (values.Psport && values.Psport[0] && values.Psport[0].originFileObj) {
        formDataToSend.append("1", values.Psport[0].originFileObj.toString());
      }
      if (
        values.OtherPic &&
        values.OtherPic[0] &&
        values.OtherPic[0].originFileObj
      ) {
        formDataToSend.append("2", values.OtherPic[0].originFileObj.toString());
      }
      if (
        values.tradeLic &&
        values.tradeLic[0] &&
        values.tradeLic[0].originFileObj
      ) {
        formDataToSend.append("3", values.tradeLic[0].originFileObj.toString());
      }
      const res = await POST_API(path, formDataToSend, headers);
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
    <Form form={form} onFinish={onSubmit} className="w-full h-full p-4">
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
            label: `${item.code} (+${item.phone})`,
          }))}
          style={{ width: "30%" }}
        />
        <Input
          style={{ width: "70%" }}
          name="whatsapp"
          value={whatsapp}
          onKeyPress={(e) => {
            const charCode = e.which || e.keyCode;
            const charStr = String.fromCharCode(charCode);

            // Check if the character is a digit
            if (!/^[0-9]$/.test(charStr)) {
              e.preventDefault();
              return;
            }

            // Check if the first character is not zero
            if (e.target.value.length === 0 && charStr === "0") {
              e.preventDefault();
              setErrorMessage("Number cannot start with 0");
              return;
            }

            setErrorMessage(""); // Clear error message if input is valid
          }}
          onChange={onChange}
          placeholder="Number"
          className="input-style"
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Input.Group>
      <label>
        Address
        <Input
          value={Address}
          name="Address"
          onChange={onChange}
          className="w-full mb-2"
        />
      </label>
      <Form.Item
        name="idPic"
        label="ID"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please upload the ID!" }]}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="tradeLic"
        label="Trade License"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please upload the ID!" }]}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="Psport"
        label="PASSPORT"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Please upload the passport!" }]}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="OtherPic"
        label="OTHER"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload beforeUpload={() => false} listType="picture">
          <Button icon={<UploadOutlined />}>upload</Button>
        </Upload>
      </Form.Item>
      <Button htmlType="submit" className="m-5 button-bar float-right">
        Save
      </Button>
    </Form>
  );
};

export default AddCorporate;
