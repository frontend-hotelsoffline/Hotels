import { Button, Form, Input, Select, Upload, message } from "antd";
import React, { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";
import GetAllUsers from "../components/Helper/GetAllUsers";
import { countryList } from "../components/Helper/ListOfAllCountries";
import { POST_API } from "../components/API/PostAPI";

const AddDMCs = ({ getDMCs, handleCancel }) => {
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { accManager } = GetAllUsers();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ name: "", status: "" });
  const {
    name,
    status,
    acc_mnger_id,
    default_markup_id,
    email,
    buying_markup_id,
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
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation ( $idPic: Upload, $Psport: Upload , $OtherPic: Upload) {
        addDMC(
          name: "${name ? name : ""}",
          status: ${status ? status : ""},
          a_mngrId: ${acc_mnger_id},
          SMid: ${default_markup_id}
          BMid: ${buying_markup_id}
          email: "${email}"
      whatsapp: "${whatsappCode || ""}${whatsapp || ""}"
      Address: "${Address}", 
      idPic: $idPic
      tradeLic: $tradeLic
      Psport: $Psport
      OtherPic: $OtherPic
        ) {
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
      if (res) {
        message.success(res.data.addDMC?.message);
        getDMCs();
        handleCancel();
        setFormData({});
      }
    } catch (error) {
      message.error("Failed to Add DMCs, Please check and try again");
      console.error(error);
    }
  };

  return (
    <Form form={form} onFinish={onSubmit} className="w-full h-full p-4">
      <h1 className="title capitalize">add DMCs</h1>
      <label className="labelStyle">DMCs</label>
      <Input
        name="name"
        value={name}
        onChange={onChange}
        placeholder="type DMCs name here"
        className="w-full border-black"
      />
      <label className="labelStyle">status</label>
      <Select
        name="status"
        value={status}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, status: value }))
        }
        options={[
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ]}
        className="border-black w-full"
      />
      <label className="labelStyle">account manager</label>
      <Select
        value={acc_mnger_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, acc_mnger_id: value }))
        }
        options={
          accManager
            ? accManager?.map((item) => ({
                key: item.id,
                label: item.name,
                value: Number(item.id),
              }))
            : ""
        }
        className="border-black w-full"
      />
      <span className="flex justify-between gap-4">
        <label className="labelStyle w-full">
          default selling markup
          <Select
            value={default_markup_id}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, default_markup_id: value }))
            }
            options={
              MarkUpValue
                ? MarkUpValue.map((item) => ({
                    key: item.id,
                    label: item.name,
                    value: Number(item.id),
                  }))
                : ""
            }
            className="border-black w-full"
          />
        </label>
        <label className="labelStyle w-full">
          default buying markup
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
                    value: Number(item.id),
                  }))
                : ""
            }
            className="border-black w-full"
          />
        </label>
      </span>
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
      <label className="labelStyle">email</label>
      <Input
        name="email"
        value={email}
        onChange={onChange}
        type="email"
        className="border-black w-full"
      />
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

export default AddDMCs;
