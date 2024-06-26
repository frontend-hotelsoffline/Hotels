import { Button, Input, Modal, Popover, Table } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import AddUser from "../Users/AddUser";
import GetAllUsers from "../components/Helper/GetAllUsers";

import PopUpForContract from "./PopUpForContract";
import PopUpForDMC from "./PopUpForDMC";
import PopUpForHotel from "./PopUpForHotel";
import { EditIcon } from "../components/Customized/EditIcon";
import GetProfile from "../components/Helper/GetProfile";

const AccountOwners = () => {
  const { accManager, getAllUsers } = GetAllUsers();
  const { ProfileValue } = GetProfile();
  const [dataSource, setDataSource] = useState([]);
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenContract, setIsModalOpenContract] = useState(false);
  const [isModalOpenDmcs, setIsModalOpenDmcs] = useState(false);
  const [isModalOpenCombine, setIsModalOpenCombine] = useState(false);
  const showTable = (type) => {
    if (type === "hotels") setIsModalOpen(true);
    if (type === "contract") setIsModalOpenContract(true);
    if (type === "dmcs") setIsModalOpenDmcs(true);
    if (type === "combine") setIsModalOpenCombine(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenContract(false);
    setIsModalOpenDmcs(false);
    setIsModalOpenCombine(false);
  };

  const filteredData = dataSource?.filter((item) =>
    item?.name?.toLowerCase().includes(nameFilter.toLowerCase())
  );

  const getAccountOwners = async () => {
    setLoading(true);
    try {
      if (accManager) {
        const tableArray = accManager?.map((item) => ({
          key: item.id ? item.id : "",
          id: item.id ? item.id : "",
          name: item.name ? item.name : "",
          email: item.uname ? (
            <a className="text-blue-700" href={`mailto:${item.uname}`}>
              {item.uname}
            </a>
          ) : (
            ""
          ),
          type: item.ulevel || "",
          country: item.country || "",
          commission: item.infoIfa_mngr?.dPkgMkup?.markup || "",
          buyingcommission: item.infoIfa_mngr?.buyM?.markup || "",
          sellingcommission: item.infoIfa_mngr?.selM?.markup || "",
          hotels: item.hotlsIfAccMngr?.length || 0,
          hotels_if_acc_mngr: item.hotlsIfAccMngr || [],
          dmcs: item.dmcsIfAccMngr?.length || 0,
          dmcs_if_acc_mngr: item.dmcsIfAccMngr || [],
          direct_static_Live_conracts_if_acc_mngr:
            item.direct_static_Live_conracts_if_acc_mngr || [],
          DLSCifAccMngr: item.DLSCifAccMngr || [],
          ILSCifAccMngr: item.ILSCifAccMngr || [],
          indirect_dynamic_Live_contracts_if_acc_mnger:
            item.indirect_dynamic_Live_contracts_if_acc_mnger || [],
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccountOwners();
  }, [accManager]);
  const router = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => (a.country ? a.country.localeCompare(b.country) : ""),
    },
    {
      title: "Account managers",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : ""),
      render: (a, record) => (
        <Button
          className="border-none text-blue-700"
          onClick={() => {
            const recordString = encodeURIComponent(JSON.stringify(record));
            router(
              `/Account-Managers/Details/${record.id}?record=${recordString}`
            );
          }}
        >
          {a}
        </Button>
      ),
    },
    {
      title: "Dynamic Package Commission",
      dataIndex: "commission",
      key: "commission",
      sorter: (a, b) => (a.commission ? a.commission - b.commission : ""),
    },
    {
      title: "buying Commission",
      dataIndex: "buyingcommission",
      key: "buyingcommission",
      sorter: (a, b) =>
        a.buyingcommission ? a.buyingcommission - b.buyingcommission : "",
    },
    {
      title: "selling Commission",
      dataIndex: "sellingcommission",
      key: "sellingcommission",
      sorter: (a, b) =>
        a.sellingcommission ? a.sellingcommission - b.sellingcommission : "",
    },
    {
      title: "DMCS",
      dataIndex: "dmcs",
      key: "dmcs",
      sorter: (a, b) => (a.dmcs ? a.dmcs - b.dmcs : ""),
      render: (text, record) => (
        <ul>
          {record?.dmcs > 0 ? (
            <div>
              <Button onClick={() => showTable("dmcs")} className="hotel-btn">
                {record?.dmcs || ""}
              </Button>
              <Modal
                footer={false}
                open={isModalOpenDmcs}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <PopUpForDMC record={rowData} />
              </Modal>
            </div>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
    },
    {
      title: "hotels",
      dataIndex: "hotels",
      key: "hotels",
      sorter: (a, b) => (a.hotels ? a.hotels - b.hotels : ""),
      render: (text, record) => (
        <ul>
          {record?.hotels > 0 ? (
            <div>
              <Button onClick={() => showTable("hotels")} className="hotel-btn">
                {record?.hotels || ""}
              </Button>
              <Modal
                footer={false}
                open={isModalOpen}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <PopUpForHotel record={rowData} />
              </Modal>
            </div>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
    },
    {
      title: "contracts",
      dataIndex: "contracts",
      key: "contracts",
      render: (text, record) => (
        <ul>
          {record.ILSCifAccMngr?.length +
            record.indirect_dynamic_Live_contracts_if_acc_mnger?.length +
            record.direct_static_Live_conracts_if_acc_mngr?.length +
            record.DLSCifAccMngr?.length >
          0 ? (
            <span className="w-full flex justify-center">
              <Button
                onClick={() => showTable("contract")}
                className="hotel-btn"
              >
                {record.ILSCifAccMngr?.length +
                  record.indirect_dynamic_Live_contracts_if_acc_mnger?.length +
                  record.direct_static_Live_conracts_if_acc_mngr?.length +
                  record.DLSCifAccMngr?.length}
              </Button>
              <Modal
                footer={false}
                open={isModalOpenContract}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <PopUpForContract record={rowData} />
              </Modal>
            </span>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) =>
        ProfileValue.lev !== 4 && (
          <span className="w-full flex justify-center">
            <Popover
              content={
                <div className="flex flex-col gap-3">
                  <Button className="action-btn">Edit</Button>
                </div>
              }
            >
              {EditIcon}
            </Popover>
          </span>
        ),
    },
  ];

  return (
    <section>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Input
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="search-bar"
            prefix={<SearchOutlined />}
            placeholder="Search Name"
          />
          <Button className="filter-bar" icon={<BsFilter />}>
            Filter
          </Button>
        </div>
        {ProfileValue.lev !== 4 && (
          <Button
            onClick={() => showTable("combine")}
            className="button-bar"
            icon={<PlusOutlined />}
          >
            Add Account Manager
          </Button>
        )}
        <Modal
          footer={false}
          open={isModalOpenCombine}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddUser getUser={getAllUsers} ac_m={2} handleCancel={handleCancel} />
        </Modal>
      </div>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
        onRow={(record) => {
          return {
            onClick: () => {
              setRowData(record);
            },
          };
        }}
      />
    </section>
  );
};

export default AccountOwners;
