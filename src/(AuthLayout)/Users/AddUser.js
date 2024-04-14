import { Button, Input, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { countryList } from "../components/Helper/ListOfAllCountries";
import GetAllDMCs from "../components/Helper/GetAllDMCs";
import GetAllHotels from "../components/Helper/GetAllHotels";
import GetAllCorporates from "../components/Helper/GetAllCorporate";
import GetAllPricingMarkUp from "../components/Helper/GetAllPricingMarkUp";

const AddUser = ({ getUser, handleCancel }) => {
  const { DMCsValue } = GetAllDMCs();
  const { hotelValue } = GetAllHotels();
  const { CorporatesValue } = GetAllCorporates();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const [formData, setFormData] = useState({});
  const { uname, pswd, ulevel, comp_id, country, buying_markup_id_if_agent_or_traveller, Commission_if_acc_mngr } = formData;
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
        add_a_new_user(
          uname: "${uname}"
          pswd: "${pswd}"
          ulevel: ${ulevel}
          comp_id: ${comp_id || 0}
          buying_markup_id_if_agent_or_traveller: ${buying_markup_id_if_agent_or_traveller || 0}
          country: "${country}"
        Commission_if_acc_mngr: ${Commission_if_acc_mngr||0}
          is_demo_user: true
      ) {
          id
          createdAt
          is_first_login_chng_pswd
          uname
          ulevel
          comp_id
          is_blocked
          country
          is_demo_user
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
      if (res.data && !res.errors) {
        message.success("User created Successfully");
        handleCancel();
        getUser();
        setFormData({})
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
    }
  };
  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="w-full m-auto px-24 space-y-3 overflow-auto"
      >
        <h1 className="title">Add User</h1>
        <label>
          Account type
          <Select
          value={ulevel}
            className=" w-full"
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, ulevel: value, comp_id: 0 }))
            }
            type="text"
            options={[
              { value: 1, label: "Super Admin" },
              { value: 2, label: "Account manager" },
              { value: 4, label: "users under a dmc" },
              { value: 6, label: "users under a hotel" },
              { value: 9, label: "users under a corporate" },
              { value: 10, label: "Agent" },
            ]}
          />
        </label>
        {ulevel == 4 || ulevel == 6 || ulevel == 9 ? (
          <label>
            Company
            <Select
            value={comp_id}
              className=" w-full"
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, comp_id: value }))
              }
              options={
                ulevel == 4
                  ? DMCsValue.map((item) => ({
                      value: item.id ? item.id : "",
                      label: item.name ? item.name : "",
                    }))
                  : ulevel == 6
                  ? hotelValue.map((item) => ({
                      value: item.id ? item.id : "",
                      label: item.name ? item.name : "",
                    }))
                  : ulevel == 9
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
          value={country}
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
        </label>
        {ulevel==2 && <label>
          Commission
            <Input
              value={Commission_if_acc_mngr}
              name="Commission_if_acc_mngr"
              onChange={onChange}
              className=""
              type="text"
            />
          </label>}
        {ulevel==10 && <label>
          buying markup
              <Select className="w-full"
              value={buying_markup_id_if_agent_or_traveller}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, buying_markup_id_if_agent_or_traveller: value }))
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
            />
          </label>}
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
        <label htmlFor="password">
          Password
          <Input.Password
            value={pswd}
            name="pswd"
            onChange={onChange}
            className=""
            type="password"
          />
        </label>
        <Button htmlType="submit" className="m-5 list-btn float-right">
          Add User
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
