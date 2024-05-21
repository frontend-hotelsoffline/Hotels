import { Layout, Select } from "antd";
import Sidebar from "./Sidebar";
import { LuBellDot } from "react-icons/lu";
import HeaderTitle from "./HeaderTitle";
import { HiBars4 } from "react-icons/hi2";
import { useContext, useState } from "react";
import { AuthContext } from "../../../AuthProvider";
const { Header, Content } = Layout;

const MainLayout = ({ children }) => {
  const [closeSidebar, setCloseSidebar] = useState(false);
  const { lightOrDark } = useContext(AuthContext);
  return (
    <Layout
      className={`${
        lightOrDark === "dark" && "dark-mode"
      } w-full overflow-hidden flex flex-row`}
    >
      <div className="max-w-[200px] border-r-[1px] border-gray-200">
        <div className={`${closeSidebar && "hidden"}`}>
          <Sidebar />
        </div>
      </div>
      <div
        className={`${lightOrDark === "dark" && "dark-mode"}
      w-full h-full`}
      >
        <Header
          style={{
            background: lightOrDark === "dark" ? "#151718" : "#FFFFFF",
            color: "#000000",
          }}
          className="w-full p-0 md:px-5 shadow-sm flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <HiBars4
              onClick={() => setCloseSidebar(!closeSidebar)}
              className={`${
                lightOrDark === "dark" && "dark-mode"
              } w-7 h-7 cursor-pointer`}
            />
            <HeaderTitle />
          </div>
          <Select placeholder={<LuBellDot className="h-[17px] w-[15px]" />} />
        </Header>
        <Content
          className="p-0 mt py-2 md:px-5 w-full h-full overflow-auto"
          style={{
            marginTop: "8px",
            minHeight: 280,
            background: lightOrDark === "dark" ? "#151718" : "#FFFFFF",
          }}
        >
          {children}
        </Content>
      </div>
    </Layout>
  );
};

export default MainLayout;
