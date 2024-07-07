import GetAllCorporates from "../(AuthLayout)/components/Helper/GetAllCorporate";
import GetAllDMCs from "../(AuthLayout)/components/Helper/GetAllDMCs";
import GetAllHotels from "../(AuthLayout)/components/Helper/GetAllHotels";
import GetAllPricingMarkUp from "../(AuthLayout)/components/Helper/GetAllPricingMarkUp";
import { countryList } from "../(AuthLayout)/components/Helper/ListOfAllCountries";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { POST_API } from "../(AuthLayout)/components/API/PostAPI";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { useEffect } from "react";
import GetAllUsers from "../(AuthLayout)/components/Helper/GetAllUsers";
import { UploadOutlined } from "@ant-design/icons";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const router = useNavigate();
  const { DMCsValue } = GetAllDMCs();
  const { hotelValue } = GetAllHotels();
  const { CorporatesValue } = GetAllCorporates();
  const { MarkUpValue } = GetAllPricingMarkUp();
  const { accManager } = GetAllUsers();
  const [errorMessage, setErrorMessage] = useState("");
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
    phoneCode,
    email,
    s_markup_id_if_acc_mngr,
    b_markup_id_if_acc_mngr,
    pswd,
    ulevel,
    comp_id,
    country,
    confirmpswd,
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
  const handleFileChange = (info, fieldName) => {
    if (info.file.status === "done") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: info.file.originFileObj,
      }));
    }
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
      phone: "${phoneCode || ""}${phone || ""}"
      email: "${email || ""}"
      b_markup_id_if_agent: ${buying_markup_id_if_agent_or_traveller || 0}
      s_markup_id_if_acc_mngr: ${s_markup_id_if_acc_mngr || 0}
      b_markup_id_if_acc_mngr: ${b_markup_id_if_acc_mngr || 0}
      a_mngrIdifAgent: ${a_mngrIdifAgent || 0}
      dPckgMarkupid_if_acc_mngr: ${dPckgMarkupid_if_acc_mngr || 0}
      country: "${country}"
      Address: ${Address}, 
      idPic: ${idPic}, 
      Psport: ${Psport}, 
      OtherPic: ${OtherPic}
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
          <span>
            {" "}
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
          <div className="flex items-center gap-2 justify-between">
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
        <span className="flex justify-between gap-2">
          <label htmlFor="password">
            Password
            <Input.Password
              size="small"
              value={pswd}
              name="pswd"
              onChange={onChange}
              className="w-full"
              type="password"
            />
          </label>
          <label htmlFor="password">
            confirm Password
            <Input.Password
              size="small"
              value={confirmpswd}
              name="confirmpswd"
              onChange={onChange}
              className="w-full"
              type="password"
            />
          </label>
        </span>
        <label>
          Address
          <Input
            value={Address}
            name="Address"
            onChange={onChange}
            className="w-full"
          />
        </label>
        <Form className="flex justify-between">
          <Form.Item label="ID">
            <Upload
              beforeUpload={() => false} // Prevent automatic upload
              onChange={(info) => handleFileChange(info, "idPic")}
            >
              <UploadOutlined />
            </Upload>
          </Form.Item>
          <Form.Item label="PASSPORT">
            <Upload
              beforeUpload={() => false}
              onChange={(info) => handleFileChange(info, "Psport")}
            >
              <UploadOutlined />
            </Upload>
          </Form.Item>
          <Form.Item label="OTHER">
            <Upload
              beforeUpload={() => false}
              onChange={(info) => handleFileChange(info, "OtherPic")}
            >
              <UploadOutlined />
            </Upload>
          </Form.Item>
        </Form>

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
