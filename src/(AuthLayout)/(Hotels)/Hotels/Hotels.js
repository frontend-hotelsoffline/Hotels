import { Button, Input, Modal, Popover, Table } from "antd";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import TablePopup from "./TablePopup";
import TablePopUpContract from "./TablePopUpContract";
import TablePopupDmc from "./TablePopupDmc";
import CombineDmcHotel from "../../Account-Managers/CombineDmcHotel";
import { GET_API } from "../../components/API/GetAPI";
import { EditIcon } from "../../components/Customized/EditIcon";

const Hotels = () => {
  const [dataSource, setDataSource] = useState([]);
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenContract, setIsModalOpenContract] = useState(false);
  const [isModalOpenDmcs, setIsModalOpenDmcs] = useState(false);
  const [isModalOpenCombine, setIsModalOpenCombine] = useState(false);
  const showTable = (type) => {
    if (type === "room") {
      setIsModalOpen(true);
    }
    if (type === "contract") {
      setIsModalOpenContract(true);
    }
    if (type === "dmcs") {
      setIsModalOpenDmcs(true);
    }
    if (type === "combine") {
      setIsModalOpenCombine(true);
    }
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
  const getHotels = async () => {
    setLoading(true);

    const GET_ALL_HOTELS = `{
      getrhotels(page: 1) {
        id
        CRT
        name
        address
        country
        city
        street
        lat
        lon
        categ
        rooms {
          id
          name
          category {
              id
              name
              desc
          }
          status
      }
        HB {
            c_id
        }
        exp {
            c_id
        }
        jp {
            c_id
        }
        Imgs {
            id
            img_url
        }
        hotlFac {
            id
            hId
            fId
            facs {
                id
                name
            }
        }
        HotelBody {
          ac_mngr {
              id
              name
          } dmcs {
            id
            name
            status
        }
        LSC {
            id
            name
            status
        }
        DLSC {
            id
            name
            status
        } selM {
          id
          name
          markup
      }
          email
          phone
          desc
          chainId
          status
      }
    }
    }`;
    const query = GET_ALL_HOTELS;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data) {
        setLoading(false);
        const tableArray = res?.data?.getrhotels?.map((item) => ({
          key: item.id ? item.id : "",
          hotelid: item.id ? item.id : "",
          name: item.name ? item.name : "",
          city: item.city ? item.city : "",
          country: item.country ? item.country : "",
          street: item.street ? item.street : "",
          latitude: item.latitude ? item.latitude : "",
          longtude: item.longtude ? item.longtude : "",
          accountmanager: item.HotelBody.ac_mngr?.name || "",
          id_acc_mngr: item.HotelBody.ac_mngr?.id || "",
          image_urls: item?.image_urls || "",
          description: item.HotelBody.desc || "",
          star_rating: item.categ || "",
          hotel_status: item.HotelBody?.status || "",
          phone_no: item.HotelBody?.phone || "",
          email: item.HotelBody?.email || "",
          google_place_id: item.google_place_id || "",
          place_of_intrst: item.place_of_intrst?.id || "",
          hotel_chain: item.hotel_chain?.id || "",
          facilities: item.facilities || "",
          default_markup_id: item?.HotelBody.selM?.id || "",
          giataId: item.giataId || "",
          contracts_static: item.HotelBody?.LSC || "",
          contracts_dynamic: item.HotelBody?.DLSC || "",
          room: item.rooms || "",
          dmcs: item.HotelBody?.dmcs || "",
          all_the_direct_Live_dynamic_contracts:
            item.all_the_direct_Live_dynamic_contracts || "",
          all_the_direct_Live_static_contracts:
            item.all_the_direct_Live_static_contracts || "",
        }));
        setDataSource(tableArray);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getHotels();
  }, []);
  const router = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "hotelid",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Hotels",
      dataIndex: "name",
      key: "Hotels",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : ""),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => (a.country ? a.country.localeCompare(b.country) : ""),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => (a.city ? a.city.localeCompare(b.city) : ""),
    },
    {
      title: "account manager",
      dataIndex: "accountmanager",
      key: "accountmanager",
      sorter: (a, b) =>
        a.accountmanager
          ? a.accountmanager.localeCompare(b.accountmanager)
          : "",
    },
    {
      title: "phone no",
      dataIndex: "phone_no",
      key: "phone_no",
    },
    {
      title: "hotel status",
      dataIndex: "hotel_status",
      key: "hotel_status",
      sorter: (a, b) =>
        a.hotel_status ? a.hotel_status.localeCompare(b.hotel_status) : "",
    },
    {
      title: "contracts",
      dataIndex: "contracts",
      key: "contracts",
      render: (text, record) => (
        <ul>
          {record?.contracts_static?.length +
            record?.contracts_dynamic?.length >
          0 ? (
            <span>
              <Button
                onClick={() => showTable("contract")}
                className="hotel-btn"
              >
                {record?.contracts_static?.length +
                  record?.contracts_dynamic?.length}
              </Button>
              <Modal
                maskStyle={{ opacity: 0.2 }}
                className="popup-style"
                footer={false}
                open={isModalOpenContract}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <TablePopUpContract record={rowData} />
              </Modal>
            </span>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
    },
    {
      title: "rooms",
      dataIndex: "room",
      key: "room",
      sorter: (a, b) => (a.room ? a.room - b.room : ""),
      render: (text, record) => (
        <ul>
          {record?.room?.length > 0 ? (
            <div>
              <Button onClick={() => showTable("room")} className="hotel-btn">
                {record?.room?.length || ""}
              </Button>
              <Modal
                maskStyle={{ opacity: 0.2 }}
                width={800}
                footer={false}
                open={isModalOpen}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <TablePopup record={rowData} />
              </Modal>
            </div>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
    },
    {
      title: "DMCS",
      dataIndex: "dmcs",
      key: "dmcs",
      sorter: (a, b) => (a.dmcs ? a.dmcs - b.dmcs : ""),
      render: (text, record) => (
        <ul>
          {record?.dmcs?.length > 0 ? (
            <div>
              <Button onClick={() => showTable("dmcs")} className="hotel-btn">
                {record?.dmcs?.length || ""}
              </Button>
              <Modal
                maskStyle={{ opacity: 0.2 }}
                width={800}
                footer={false}
                open={isModalOpenDmcs}
                onOk={handleCancel}
                onCancel={handleCancel}
              >
                <TablePopupDmc record={rowData} />
              </Modal>
            </div>
          ) : (
            <Button className="hotel-btn-red">0</Button>
          )}
        </ul>
      ),
    },
    {
      title: "direct",
      dataIndex: "direct",
      key: "direct",
      sorter: (a, b) => (a.direct ? a.direct.localeCompare(b.direct) : ""),
      render: (_, record) =>
        record?.all_the_direct_Live_dynamic_contracts?.length +
          record?.all_the_direct_Live_static_contracts?.length >
        0
          ? "yes"
          : "no",
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
                    router(`/Static-Contract?record=${recordString}`);
                  }}
                  className="action-btn"
                >
                  Add contracts
                </Button>
                <Button
                  onClick={() => showTable("combine")}
                  className="action-btn"
                >
                  Add DMC
                </Button>{" "}
                <Button
                  onClick={() => {
                    const recordString = encodeURIComponent(
                      JSON.stringify(record)
                    );
                    router(`/Add-Room?record=${recordString}`);
                  }}
                  className="action-btn"
                >
                  Add Room
                </Button>
                <Button
                  onClick={() => {
                    const recordString = encodeURIComponent(
                      JSON.stringify(record)
                    );
                    router(`/Edit-Hotel?record=${recordString}`);
                  }}
                  className="action-btn"
                >
                  Edit
                </Button>
              </div>
            }
          >
            {EditIcon}
          </Popover>
          <Modal
            maskStyle={{ opacity: 0.2 }}
            footer={false}
            open={isModalOpenCombine}
            onOk={handleCancel}
            onCancel={handleCancel}
          >
            <CombineDmcHotel record={rowData} handleCancel={handleCancel} />
          </Modal>
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
          onClick={() => router("/Add-Hotel")}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Hotel
        </Button>
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

export default Hotels;
