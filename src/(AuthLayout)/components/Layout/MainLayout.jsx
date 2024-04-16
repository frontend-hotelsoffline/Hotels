"use client";
import { Button, Layout, Modal, Select } from "antd";
import Sidebar from "./Sidebar";
import { LuBellDot } from "react-icons/lu";
import HeaderTitle from "./HeaderTitle";
const { Header, Content } = Layout;

const MainLayout = ({ children, title }) => {
  return (
    <Layout className="w-full overflow-auto flex flex-row">
      <div className="w-[200px] border-r-[1px] border-gray-200">
        <Sidebar />
      </div>
      <div className="w-full">
        <Header
          style={{
            background: "#FFFFFF",
            color: "#000000",
          }}
          className="w-full p-0 md:px-5 shadow-sm flex justify-between items-center"
        >
          <HeaderTitle />
          <Select
            placeholder={<LuBellDot className="h-[17px] w-[15px]" />}
          />
        </Header>
        <Content
          className="p-0 py-2 md:px-5 w-full"
          style={{
            marginTop: "15px",
            minHeight: 280,
            background: "#FFFFFF",
            // padding: "10px 50px",
          }}
        >
          {children}
        </Content>
      </div>
    </Layout>
  );
};

export default MainLayout;
