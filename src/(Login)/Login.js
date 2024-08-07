import { Button, Checkbox, Input, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { POST_API } from "../(AuthLayout)/components/API/PostAPI";
import { Link, json, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";

const Login = () => {
  const router = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({ rememberMe: false });
  const { uname, pswd, rememberMe } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      router("/Dashboard");
    } else {
      localStorage.clear("isAuthenticated");
    }
    const savedCredentials = localStorage.getItem("credentials");
    if (savedCredentials) {
      const { uname, pswd } = JSON.parse(savedCredentials);
      setFormData((prev) => ({ ...prev, uname, pswd }));
    }
  }, [isAuthenticated]);

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
      if (res?.data?.login?.message === "success") {
        message.success(res.data.login?.message);
        router("/Dashboard");
        if (rememberMe) {
          localStorage.setItem("credentials", JSON.stringify({ uname, pswd }));
        } else {
          localStorage.removeItem("credentials");
        }
        setIsAuthenticated(localStorage.setItem("isAuthenticated", "success"));
      } else message.error(res?.data?.login?.message);
    } catch (error) {
      message.error("Failed");
    }
  };

  return (
    <div
      style={{ backgroundImage: "url(/background.png)" }}
      className="h-screen flex justify-center items-center overflow-hidden"
    >
      <form
        onSubmit={onSubmit}
        className="w-[600px] h-[500px] bg-white py-10 px-[120px] rounded-3xl"
      >
        <h1 className="logo-title ">HotelsOffline</h1>
        <p className="text-black font-semibold">Welcome back</p>
        <h1 className="text-3xl text-blue-800 mb-3">Login to your account</h1>
        <label>Email</label>
        <Input
          onChange={onChange}
          name="uname"
          value={uname}
          className="mb-2 h-10"
          type="text"
          required
        />
        <label htmlFor="password">Password</label>
        <Input.Password
          size="small"
          onChange={onChange}
          name="pswd"
          value={pswd}
          className="mb-3"
          type="password"
          required
        />
        <div className="flex mb-6 items-center justify-between">
          <Checkbox
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, rememberMe: e.target.checked }))
            }
            className="flex"
          >
            Remember me
          </Checkbox>
          <Link className="text-blue-600 mb-3 underline font-bold" to="/">
            Forgot password?
          </Link>
        </div>
        <Button
          htmlType="submit"
          className="w-full mb-2 bg-blue-600 text-white text-lg h-10 font-semibold"
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
