"use client";
import { Button, Input, Popover, Table, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import { EditIcon } from "../../components/Customized/EditIcon";
import { GET_API } from "../../components/API/GetAPI";
import AddDMCs from "../../DMCs/AddDMCs";
import GetAllUsers from "../../components/Helper/GetAllUsers";

const Rooms = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const record = searchParams.get("record");
  const parsedRecord = record ? JSON.parse(record) : null;

  const [dataSource, setDataSource] = useState([]);
  const { accManager, getAllUsers } = GetAllUsers();
  const [formData, setFormData] = useState({
    id: parsedRecord?.id || "",
  });
  const { id } = formData;

  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [AddDMCPopup, setAddDMCPopup] = useState(false);
  const handleCancel = () => {
    setAddDMCPopup(false);
  };

  const filteredData = dataSource?.filter((a) =>
    a.name?.toLowerCase().includes(nameFilter.toLowerCase())
  );
  const getRooms = async () => {
    setLoading(true);
    const GET_ALL = `{
        get_user_by_id (user_id: ${id}) {
          id
          createdAt
          is_first_login_chng_pswd
          uname
          ulevel
          comp_id
          is_blocked
          country
          is_demo_user
          Commission_if_acc_mngr
          dmcs_if_acc_mngr {
              id
              name
              status
              email
          }
          hotels_if_acc_mngr {
              id
              name
              hotel_status
          }
      }
      }`;
    const query = GET_ALL;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      if (res.data.get_user_by_id) {
        const tableArray = [
          {
            key: res.data.get_user_by_id?.id || "",
            id: res.data.get_user_by_id?.id || "",
            name: res.data.get_user_by_id?.name || "",
            country: res.data.get_user_by_id?.country || "",
            hotel: res.data.get_user_by_id?.hotels_if_acc_mngr?.name || "",
            dmc: res.data.get_user_by_id?.dmcs_if_acc_mngr?.name || "",
          },
        ];
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, [id]);

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
      title: "Hotel",
      dataIndex: "hotel",
      key: "hotel",
      sorter: (a, b) => (a.hotel ? a.hotel.localeCompare(b.hotel) : ""),
    },
    {
      title: "dmc",
      dataIndex: "dmc",
      key: "dmc",
      sorter: (a, b) => (a.dmc ? a.dmc.localeCompare(b.dmc) : ""),
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
                <Button
                  onClick={() => {
                    const recordString = encodeURIComponent(
                      JSON.stringify(record)
                    );
                    router(`/Add-Hotel?record=${recordString}`);
                  }}
                  className="action-btn"
                  icon={<PlusOutlined />}
                >
                  Assign hotel to Account manager
                </Button>
                <Button
                  onClick={() => setAddDMCPopup(true)}
                  className="action-btn"
                  icon={<PlusOutlined />}
                >
                  Assign DMC to Account manager
                </Button>
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
            onChange={(e) => setNameFilter(e.target.value)}
            className="search-bar"
            prefix={<SearchOutlined />}
            placeholder="Search Name"
          />
          <Button className="filter-bar" icon={<BsFilter />}>
            Filter
          </Button>
        </div>
        <div>
          <label className="labelStyle">Account Manager</label>
          <Select
            showSearch
            filterOption={(input, option) =>
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            value={id}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, id: value }))
            }
            options={
              accManager
                ? accManager?.map((item) => ({
                    key: item.id,
                    label: item.uname,
                    value: Number(item.id),
                  }))
                : ""
            }
            className="input-style min-w-[200px]"
          />
          <Modal
            footer={false}
            open={AddDMCPopup}
            onOk={handleCancel}
            onCancel={handleCancel}
          >
            <AddDMCs handleCancel={handleCancel} />
          </Modal>
        </div>
      </div>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        loading={loading}
      />
    </section>
  );
};

export default Rooms;
