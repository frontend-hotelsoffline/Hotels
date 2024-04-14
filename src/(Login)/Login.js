
import { Button, Checkbox, Input, message } from "antd";
import { useState } from "react";
import { POST_API } from "../(AuthLayout)/components/API/PostAPI";
import { Link, useNavigate, } from "react-router-dom";

const Login = () => {
  const router = useNavigate();
  const [formData, setFormData] = useState({});
  const { uname, pswd } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!pswd || !uname) {
      message.error("Please enter username and password");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
  {
    login(uname: "${uname}", pswd: "${pswd}") {
      message
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
      if (res?.data?.loging?.jwt==="success") {
        message.success("Login Successfully");
        localStorage.setItem("isAuthenticated", res?.data?.loging?.jwt)
        console.log(res?.data?.loging?.jwt)
        router("/Dashboard");
      }
      else message.error(res?.data?.loging?.jwt)
    } catch (error) {
      message.error("Failed, Please check and try again");
    }
  };

  return (
    <div className="h-screen flex flex-row overflow-hidden">
      <div className="w-full">
        <img
          className="w-full h-full overflow-hidden"
          width={500}
          height={500}
          alt="login"
          src="/Login.jpeg"
        />
      </div>
      <form onSubmit={onSubmit} className="w-full m-auto p-24">
        <h1 className="logo-title absolute top-2">HotelsOffline</h1>
        <p className="text-black font-semibold">Welcome back</p>
        <h1 className="text-3xl text-blue-800 mb-3">Login to your account</h1>
        <label>Username</label>
        <Input
          onChange={onChange}
          name="uname"
          value={uname}
          className="mb-2 h-10"
          type="text"
        />
        <label htmlFor="password">Password</label>
        <Input.Password
          onChange={onChange}
          name="pswd"
          value={pswd}
          className="mb-3 h-10"
          type="password"
        />
        <div className="flex justify-between">
          <Checkbox className="flex mb-6">Remember me</Checkbox>
          <Link className="text-blue-600 mb-3 underline font-bold" to="/">
            Forgot password?
          </Link>
        </div>
        <Button
          htmlType="submit"
          className="w-full mb-20 bg-blue-600 text-white text-lg h-10 font-semibold"
        >
          Login
        </Button>
        <div className="flex justify-center">
          <p>Don't have an account?</p>
          <Link className=" text-blue-500 underline ml-2" to="/Register">
            Join free today
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
