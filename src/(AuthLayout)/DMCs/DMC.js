import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import { GET_API } from "../components/API/GetAPI";
import AddDMCs from "./AddDMCs";
import PopUpContract from "./PopUpContract";
import PopUpHotel from "./PopUpHotel";
import { EditIcon } from "../components/Customized/EditIcon";

const DMCs = () => {
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
  const filteredData = dataSource.filter((item) => {
    return item.name.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getDMCs = async () => {
    const GET_ALL = `{
        get_all_dmcs {
            id
            name
            status
            email
            account_manager {
              id
              uname
          }
          hotels_of_the_dmc {
            id
            hotel {
                id
                name
                hotel_status
            }
        }
          Live_static_contracts {
              id
              name
              status
          }
          Live_dynamic_contracts {
              id
              name
              status
          }
            default_markup {
              id
              createdAt
              name
              markup
          }
        }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        const tableArray = res.data.get_all_dmcs.map((item) => ({
          key: item.id || "",
          id: item.id || "",
          name: item.name || "",
          status: item.status || "",
          email: item.email || "",
          hotels_of_the_dmc: item.hotels_of_the_dmc || "",
          account_manager: item.account_manager.uname || "",
          Live_static_contracts: item.Live_static_contracts || [],
          Live_dynamic_contracts: item.Live_dynamic_contracts || [],
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
      title: "hotels",
      dataIndex: "number_hotels",
      key: "number_hotels",
      render: (text, record) => (
        <ul>
          {record?.hotels_of_the_dmc?.length > 0 ? (
            <span className="w-full flex justify-center">
              <Button onClick={() => showTable("dmcs")} className="hotel-btn">
                {record?.hotels_of_the_dmc?.length || ""}
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
      render: (text, record) => (
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
        <Button
          onClick={() => showTable("hotels")}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add DMCs
        </Button>
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
        pagination={false}
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
