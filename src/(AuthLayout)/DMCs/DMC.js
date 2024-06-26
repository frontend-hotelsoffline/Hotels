import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import { GET_API } from "../components/API/GetAPI";
import AddDMCs from "./AddDMCs";
import PopUpContract from "./PopUpContract";
import PopUpHotel from "./PopUpHotel";
import { EditIcon } from "../components/Customized/EditIcon";
import GetProfile from "../components/Helper/GetProfile";

const DMCs = () => {
  const { ProfileValue } = GetProfile();
  const [rowData, setRowData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenContract, setIsModalOpenContract] = useState(false);
  const [isModalOpenDmcs, setIsModalOpenDmcs] = useState(false);
  const showTable = (type) => {
    if (type === "hotels") {
      setIsModalOpen(true);
    }
    if (type === "contract") {
      setIsModalOpenContract(true);
    }
    if (type === "dmcs") {
      setIsModalOpenDmcs(true);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenContract(false);
    setIsModalOpenDmcs(false);
  };
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const filteredData = dataSource?.filter((item) => {
    return item.name.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getDMCs = async () => {
    const GET_ALL = `{
      getDMCs {
        id
        name
        status
        email
        rate
        SM
        BM
        whatsapp
        a_mngr
        ac_mngr {
            id
            name
            hotlsIfAccMngr {
              id
              name
              HotelBody {
                status
            }
          }
          ILSCifAccMngr {
              id
              name
              status
          }
          DLSCifAccMngr {
              id
              name
              status
          }
        }
        buyM {
            markup
            name
            id
        }
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      if (res.data) {
        const tableArray = res.data.getDMCs.map((item) => ({
          key: item.id || "",
          id: item.id || "",
          name: item.name || "",
          status: item.status || "",
          email:
            (item.email && (
              <a className="text-blue-700" href={`mailto:${item.email}`}>
                {item.email}
              </a>
            )) ||
            "",
          whatsapp: item.whatsapp || "",
          hotlsIfAccMngr: item?.ac_mngr?.hotlsIfAccMngr || "",
          account_manager: item?.ac_mngr?.name || "",
          Live_static_contracts: item?.ac_mngr?.ILSCifAccMngr || [],
          Live_dynamic_contracts: item?.ac_mngr?.DLSCifAccMngr || [],
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDMCs();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "DMCs",
      dataIndex: "name",
      key: "DMCs",
      sorter: (a, b) => (a.DMCs ? a.DMCs.localeCompare(b.DMCs) : ""),
    },
    {
      title: "account manager",
      dataIndex: "account_manager",
      key: "account_manager",
      sorter: (a, b) =>
        a.account_manager
          ? a.account_manager.localeCompare(b.account_manager)
          : "",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => (a.email ? a.email.localeCompare(b.email) : ""),
    },
    {
      title: "whatsapp",
      dataIndex: "whatsapp",
      key: "whatsapp",
      sorter: (a, b) =>
        a.whatsapp ? a.whatsapp.localeCompare(b.whatsapp) : "",
    },
    {
      title: "hotels",
      dataIndex: "number_hotels",
      key: "number_hotels",
      render: (text, record) => (
        <ul>
          {record?.hotlsIfAccMngr?.length > 0 ? (
            <span className="w-full flex justify-center">
              <Button onClick={() => showTable("dmcs")} className="hotel-btn">
                {record?.hotlsIfAccMngr?.length || ""}
              </Button>
              <Modal
                footer={false}
                open={isModalOpenDmcs}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <PopUpHotel record={rowData} />
              </Modal>
            </span>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
      sorter: (a, b) =>
        a.number_hotels ? a.number_hotels - b.number_hotels : "",
    },
    {
      title: "contracts",
      dataIndex: "number_contract",
      key: "number_contract",
      render: (text, record) => (
        <ul>
          {record.Live_dynamic_contracts?.length +
            record.Live_static_contracts?.length >
          0 ? (
            <span className="w-full flex justify-center">
              <Button
                onClick={() => showTable("contract")}
                className="hotel-btn"
              >
                {record.Live_dynamic_contracts?.length +
                  record.Live_static_contracts?.length}
              </Button>
              <Modal
                footer={false}
                open={isModalOpenContract}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <PopUpContract record={rowData} />
              </Modal>
            </span>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
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
                  <Button className="action-btn">edit</Button>
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
            onClick={() => showTable("hotels")}
            className="button-bar"
            icon={<PlusOutlined />}
          >
            Add DMCs
          </Button>
        )}
        <Modal
          className=""
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
        >
          <AddDMCs getDMCs={getDMCs} handleCancel={handleCancel} />
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

export default DMCs;
