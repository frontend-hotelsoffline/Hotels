
import GetAllCorporates from "../(AuthLayout)/components/Helper/GetAllCorporate";
import GetAllDMCs from "../(AuthLayout)/components/Helper/GetAllDMCs";
import GetAllHotels from "../(AuthLayout)/components/Helper/GetAllHotels";
import GetAllPricingMarkUp from "../(AuthLayout)/components/Helper/GetAllPricingMarkUp";
import { countryList } from "../(AuthLayout)/components/Helper/ListOfAllCountries";
import { Button, Checkbox, Input, Select, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POST_API } from "../(AuthLayout)/components/API/PostAPI";

const Register = () => {
  const router = useNavigate();
  const { DMCsValue } = GetAllDMCs();
  const { hotelValue } = GetAllHotels();
  const { CorporatesValue } = GetAllCorporates();
  const { MarkUpValue } = GetAllPricingMarkUp();

  const [formData, setFormData] = useState({
    uname: "",
    pswd: "",
    ulevel: "",
    comp_id: "",
    country: "",
    confirmpswd: "",
  });
  const { uname, pswd, ulevel, comp_id, country, confirmpswd, buying_markup_id_if_agent_or_traveller,Commission_if_acc_mngr } = formData;
  console.log(formData);
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
    addUser(
      uname: "${uname}"
      pswd: "${pswd}"
      ulevel: ${ulevel}
      comp_id: ${comp_id || 0}
      buying_markup_id_if_agent_or_traveller: ${buying_markup_id_if_agent_or_traveller || 0}
      country: "${country}"
      Commission_if_acc_mngr: ${Commission_if_acc_mngr||0}
      is_demo_user: true
  ) {
      message
  }
  }
`;

    const path = "";
    try {
      if (pswd !== confirmpswd) {
        message.error(
          "Password does not match. Please check your password and try again."
        );
      } else {
        const res = await POST_API(
          path,
          JSON.stringify({ query: mutation }),
          headers
        );
        console.log(res);
        if (res) {
          message.success(res.data.login?.message);
          router("/Dashboard");
        }
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
      console.error(error);
    }
  };

  return (
    <div style={{backgroundImage: "url(/background.png)"}} className="h-screen flex items-center justify-center overflow-hidden">
        <form
          onSubmit={onSubmit}
          className="w-[600px] h-[550px] bg-white space-y-2 overflow-auto rounded-3xl py-5 px-[120px]"
        >
          <h1 className="logo-title">HotelsOffline</h1>
          <h1 className="text-3xl text-blue-800">Create an account</h1>
          <label>
            Account type
            <Select
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
          {ulevel == 4 || ulevel== 6 || ulevel== 9 ? (
            <label>
              Company
              <Select
                className=" w-full"
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, comp_id: value }))
                }
                type="text"
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
              <Select
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
              className="w-full"
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
          <label htmlFor="password">
            confirm Password
            <Input.Password
              value={confirmpswd}
              name="confirmpswd"
              onChange={onChange}
              className=""
              type="password"
            />
          </label>
          <Button
            htmlType="submit"
            className="w-full h-10 bg-blue-600 text-white text-lg font-semibold"
          >
            sign up now
          </Button>
          <div className="flex justify-center ">
            <p>already have an account?</p>
            <Link className=" text-blue-500 underline ml-2" to="/">
              Login
            </Link>
          </div>
        </form>
    </div>
  );
};

export default Register;
