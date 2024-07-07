import { Button, Input, Upload, Form, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { countryList } from "../components/Helper/ListOfAllCountries";
import GetAllDMCs from "../components/Helper/GetAllDMCs";
import GetAllHotels from "../components/Helper/GetAllHotels";
import GetAllCorporates from "../components/Helper/GetAllCorporate";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";
import GetAllUsers from "../components/Helper/GetAllUsers";
import { UploadOutlined } from "@ant-design/icons";

const AddUser = ({ getUser, ac_m, handleCancel }) => {
  const { DMCsValue } = GetAllDMCs();
  const { hotelValue } = GetAllHotels();
  const { CorporatesValue } = GetAllCorporates();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { accManager } = GetAllUsers();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ ulevel: ac_m || "" });
  const {
    uname,
    phone,
    phoneCode,
    email,
    s_markup_id_if_acc_mngr,
    b_markup_id_if_acc_mngr,
    pswd,
    ulevel,
    comp_id,
    country,
    buying_markup_id_if_agent_or_traveller,
    a_mngrIdifAgent,
    dPckgMarkupid_if_acc_mngr,
    Address,
    idPic,
    Psport,
    OtherPic,
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
  mutation ( $images: [Upload]){
    addUser(
      name: "${uname}"
      pswd: "${pswd}"
      ulevel: ${ulevel}
      comp_id: ${comp_id || 0}
      phone: "${phoneCode || ""}${phone || ""}"
      email: "${email || ""}"
      b_markup_id_if_agent: ${buying_markup_id_if_agent_or_traveller || 0}
      s_markup_id_if_acc_mngr: ${s_markup_id_if_acc_mngr || 0}
      b_markup_id_if_acc_mngr: ${b_markup_id_if_acc_mngr || 0}
      a_mngrIdifAgent: ${a_mngrIdifAgent || 0}
      dPckgMarkupid_if_acc_mngr: ${dPckgMarkupid_if_acc_mngr || 0}
      country: "${country}"
      Address: ${Address}, 
      idPic: $idPic
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
        },
      };

      const map = {
        0: ["variables.idPic"],
        1: ["variables.Psport"],
        2: ["variables.OtherPic"],
      };

      const formDataToSend = new FormData();
      formDataToSend.append("operations", JSON.stringify(operations));
      formDataToSend.append("map", JSON.stringify(map));

      if (values.idPic && values.idPic[0] && values.idPic[0].originFileObj) {
        formDataToSend.append("0", values.idPic[0].originFileObj);
      }
      if (values.Psport && values.Psport[0] && values.Psport[0].originFileObj) {
        formDataToSend.append("1", values.Psport[0].originFileObj);
      }
      if (
        values.OtherPic &&
        values.OtherPic[0] &&
        values.OtherPic[0].originFileObj
      ) {
        formDataToSend.append("2", values.OtherPic[0].originFileObj);
      }

      const res = await POST_API(path, formDataToSend, headers);
      if (res?.data?.addUser?.message === "success") {
        message.success(res.data.addUser?.message);
        setFormData({});
        form.resetFields();
        getUser();
        handleCancel();
      } else message.error(res?.data?.addUser?.message);
    } catch (error) {
      message.error("Failed, Please check and try again");
    }
  };
  return (
    <Form
      form={form}
      onFinish={onSubmit}
      className="w-full m-auto px-24 space-y-3 overflow-auto"
    >
      <h1 className="title">Add User</h1>
      <label>
        Account type
        <Select
          className=" w-full"
          value={ulevel}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, ulevel: value, comp_id: 0 }))
          }
          type="text"
          options={[
            { value: 2, label: "Account manager" },
            { value: 4, label: "dmc" },
            { value: 6, label: "hotel" },
            { value: 9, label: "corporate" },
            { value: 10, label: "Agent" },
          ]}
        />
      </label>
      {ulevel === 4 || ulevel === 6 || ulevel === 9 ? (
        <label>
          Company
          <Select
            className=" w-full"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, comp_id: value }))
            }
            type="text"
            options={
              ulevel === 4
                ? DMCsValue.map((item) => ({
                    value: item.id ? item.id : "",
                    label: item.name ? item.name : "",
                  }))
                : ulevel === 6
                ? hotelValue.map((item) => ({
                    value: item.id ? item.id : "",
                    label: item.name ? item.name : "",
                  }))
                : ulevel === 9
                ? CorporatesValue?.map((item) => ({
                    value: item.id ? item.id : "",
                    label: item.name ? item.name : "",
                  }))
                : null
            }
          />
        </label>
      ) : null}
      <label>
        country
        <Select
          showSearch
          filterOption={(input, option) =>
            (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
          }
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, country: value }))
          }
          options={countryList}
          className="h-[34px] inputfildinsearch"
        />
      </label>
      {ulevel === 10 && (
        <span>
          <label>
            Buying Commission
            <Select
              value={buying_markup_id_if_agent_or_traveller}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  buying_markup_id_if_agent_or_traveller: value,
                }))
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
              className="w-full"
            />
          </label>
          <label>
            Account manager
            <Select
              value={a_mngrIdifAgent}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  a_mngrIdifAgent: value,
                }))
              }
              options={
                accManager
                  ? accManager.map((item) => ({
                      key: item.id,
                      label: item.name,
                      value: item.id,
                    }))
                  : ""
              }
              className="w-full"
            />
          </label>
        </span>
      )}
      {ulevel === 2 && (
        <div>
          <label>
            Dynamic package Commission
            <Select
              value={dPckgMarkupid_if_acc_mngr}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  dPckgMarkupid_if_acc_mngr: value,
                }))
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
              className="w-full"
            />
          </label>
          <span className="flex items-center gap-2 justify-between">
            <label>
              Buying Commission
              <Select
                value={b_markup_id_if_acc_mngr}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    b_markup_id_if_acc_mngr: value,
                  }))
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
                className="w-full"
              />
            </label>
            <label>
              Selling Commission
              <Select
                value={s_markup_id_if_acc_mngr}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    s_markup_id_if_acc_mngr: value,
                  }))
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
                className="w-full"
              />
            </label>
          </span>
        </div>
      )}
      <span className="flex justify-between gap-2">
        <label>
          Username
          <Input
            value={uname}
            name="uname"
            onChange={onChange}
            className=""
            type="text"
          />
        </label>
        <label>
          Email
          <Input
            value={email}
            name="email"
            onChange={onChange}
            className=""
            type="email"
          />
        </label>
      </span>
      <label>
        Phone
        <Input.Group compact>
          <Select
            showSearch
            value={phoneCode}
            filterOption={(input, option) =>
              (option?.label?.toLowerCase() ?? "").includes(
                input?.toLowerCase()
              )
            }
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, phoneCode: value }))
            }
            options={countryList?.map((item) => ({
              value: item.phone,
              label: `${item.code} (+${item.phone})`,
            }))}
            style={{ width: "40%" }}
          />
          <Input
            style={{ width: "60%" }}
            name="phone"
            value={phone}
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
      </label>
      <label htmlFor="password">
        Password
        <Input.Password
          size="small"
          value={pswd}
          name="pswd"
          onChange={onChange}
          className="w-full border border-black"
          type="password"
        />
      </label>
      <label>
        Address
        <Input
          value={Address}
          name="Address"
          onChange={onChange}
          className="w-full"
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
        Add User
      </Button>
    </Form>
  );
};

export default AddUser;
