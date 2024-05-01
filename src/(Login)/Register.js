import GetAllCorporates from "../(AuthLayout)/components/Helper/GetAllCorporate";
import GetAllDMCs from "../(AuthLayout)/components/Helper/GetAllDMCs";
import GetAllHotels from "../(AuthLayout)/components/Helper/GetAllHotels";
import GetAllPricingMarkUp from "../(AuthLayout)/components/Helper/GetAllPricingMarkUp";
import { countryList } from "../(AuthLayout)/components/Helper/ListOfAllCountries";
import { Button, Checkbox, Input, Select, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POST_API } from "../(AuthLayout)/components/API/PostAPI";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { useEffect } from "react";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useNavigate();
  const { DMCsValue } = GetAllDMCs();
  const { hotelValue } = GetAllHotels();
  const { CorporatesValue } = GetAllCorporates();
  const { MarkUpValue } = GetAllPricingMarkUp();
  useEffect(() => {
    isAuthenticated && router("/Dashboard");
  }, [isAuthenticated]);

  const [formData, setFormData] = useState({
    uname: "",
    pswd: "",
    ulevel: "",
    comp_id: "",
    country: "",
    confirmpswd: "",
  });
  const {
    uname,
    phone,
    email,
    s_markup_id_if_acc_mngr,
    b_markup_id_if_acc_mngr,
    pswd,
    ulevel,
    comp_id,
    country,
    confirmpswd,
    buying_markup_id_if_agent_or_traveller,
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
    addUser(
      name: "${uname}"
      pswd: "${pswd}"
      ulevel: ${ulevel}
      comp_id: ${comp_id || 0}
      phone: "${phone || 0}"
      email: "${email || ""}"
      b_markup_id_if_agent: ${buying_markup_id_if_agent_or_traveller || 0}
      s_markup_id_if_acc_mngr: ${s_markup_id_if_acc_mngr || 0}
      b_markup_id_if_acc_mngr: ${b_markup_id_if_acc_mngr || 0}
      country: "${country}"
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
        if (res?.data?.addUser?.message === "success") {
          message.success(res.data.addUser?.message);
          router("/Dashboard");
          setIsAuthenticated(
            localStorage.setItem("isAuthenticated", "success")
          );
        } else message.error(res?.data?.addUser?.message);
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
      console.error(error);
    }
  };

  return (
    <div
      style={{ backgroundImage: "url(/background.png)" }}
      className="h-screen flex items-center justify-center overflow-hidden"
    >
      <form
        onSubmit={onSubmit}
        className="w-[600px] h-[550px] bg-white overflow-auto rounded-3xl py-2 px-[120px]"
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
        {/* {ulevel ===2 && (
          <label>
            Commission
            <Input
              value={Commission_if_acc_mngr}
              name="Commission_if_acc_mngr"
              onChange={onChange}
              className=""
              type="text"
            />
          </label>
        )} */}
        {ulevel === 10 && (
          <label>
            Buying markup
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
        )}
        {ulevel === 2 && (
          <span className="flex justify-between">
            <label>
              Buying markup
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
              Selling markup
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
        )}
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
        <span className="flex justify-between gap-2">
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
          <label>
            Phone
            <Input
              value={phone}
              name="phone"
              onChange={onChange}
              className=""
              type="phone"
            />
          </label>
        </span>
        <span className="flex justify-between gap-2">
          <label htmlFor="password">
            Password
            <Input.Password
              value={pswd}
              name="pswd"
              onChange={onChange}
              className="w-full border border-black"
              type="password"
            />
          </label>
          <label htmlFor="password">
            confirm Password
            <Input.Password
              value={confirmpswd}
              name="confirmpswd"
              onChange={onChange}
              className="w-full border border-black"
              type="password"
            />
          </label>
        </span>
        <Button
          htmlType="submit"
          className="w-full h-10 bg-blue-600 text-white text-lg mt-2 font-semibold"
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
