"use client";
import { Button, Layout, Modal } from "antd";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { HiBars4 } from "react-icons/hi2";
import {
  CloseOutlined,
  BellOutlined,
  CaretDownOutlined,
  DownOutlined,
} from "@ant-design/icons";
import HeaderTitle from "./HeaderTitle";
import { useNavigate } from "react-router-dom";
const { Header, Content } = Layout;

const MainLayout = ({ children, title }) => {
  const router = useNavigate()
  let isAuthenticated
  if (typeof window !== 'undefined') {
    isAuthenticated = localStorage.getItem('isAuthenticated');
  }
  
  useEffect(() => {
    // if (isAuthenticated === 'success') {
    //   router('/Dashboard');
    // } else {
    //   router.replace('/');
    // }
  }, [isAuthenticated]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showProfile = () => setIsOpenProfile(true);
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsOpenProfile(false);
  };
  return (
    <Layout className="w-full overflow-auto">
      <div>
        <Modal
          width={180}
          className="absolute top-20 overflow-hidden "
          style={{ padding: 0 }}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
          closeIcon={false}
          footer={false}
        >
          <CloseOutlined
            className="absolute text-xl right-1 top-4"
            onClick={handleCancel}
          />
          <Sidebar />
        </Modal>
      </div>
      <Layout>
        <Header
          style={{
            background: "#FFFFFF",
            color: "#000000",
          }}
          className="w-full p-0 md:px-12 shadow-xl flex justify-between items-center"
        >
          <h1 className="logo-title">HotelsOffline</h1>
          <div className="md:flex grid grid-cols-2 items-center md:space-x-6 space-x-1">
            <Button
              className="nav-btn"
              onClick={() => router("/Dashboard")}
            >
              Dashboard
            </Button>
            <Button onClick={() => router("/Hotels")} className="nav-btn">
              Hotels
            </Button>
            <Button onClick={() => router("/Rooms")} className="nav-btn">
              Rooms
            </Button>
            <Button
              onClick={() => router("/Contracts")}
              className="nav-btn"
            >
              Contracts
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <BellOutlined className="h-[17px] w-[15px]" />
            <div onClick={showProfile} className="profile-image m-3 cursor-pointer"></div>
            <Modal className="absolute right-2 top-[60px]"
              width={180}
              open={isOpenProfile}
              onOk={handleCancel}
              onCancel={handleCancel}
              closeIcon={false}
              footer={false}
            >
              <h1>Profile Details</h1>
            </Modal>
            <CaretDownOutlined />
          </div>
        </Header>
        <Content
          className="p-0 py-2 md:px-12"
          style={{
            marginTop: "15px",
            minHeight: 280,
            background: "#FFFFFF",
            // padding: "10px 50px",
          }}
        >
          <HiBars4 className="w-8 h-8 cursor-pointer" onClick={showModal} />
          <HeaderTitle />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
