"use client";
import { Button, Input, Modal, Popover, Table } from "antd";
import { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";
import { HiDotsVertical } from "react-icons/hi";
import { GET_API } from "../../components/API/GetAPI";
import { useNavigate, } from "react-router-dom";
import { formatDate } from "../../components/Helper/FormatDate";
import {EditIcon}from "../../components/Customized/EditIcon";

const Contracts = () => {
  const router = useNavigate();
  const [activeItem, setActiveItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const filteredData = dataSource.filter((item) => {
    return (
      item.contract.toLowerCase().includes(nameFilter.toLocaleLowerCase()) &&
      item.status.toLowerCase().includes(statusFilter.toLocaleLowerCase())
    );
  });
  const getContract = async () => {
    const GET_ALL = `{
      get_all_static_n_dynamic_contracts {
        id
        createdAt
        name
        owner_type
        currency
        status
        country
        city
        base_meal
        from_date
        to_date
        child_age_from
        child_age_to
        channel
        hotel_id_external_api
        giata_id 
        price_markup {
          id
          createdAt
          name
          markup
      }
        hotel {
          id
          createdAt
          google_place_id
          name
          country
          city
          street
          latitude
          longtude
          description
          star_rating
          hotel_status
          phone_no
          email
          giataId
      }
    }
    }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });
      if (res.data) {
        const tableArray = res.data.get_all_static_n_dynamic_contracts.map(
          (item) => ({
            key: item.id ? item.id : "",
            id: item.id ? item.id : "",
            country: item.country ? item.country : "",
            city: item.city ? item.city : "",
            contract: item.name ? item.name : "",
            currency: item.currency ? item.currency : "",
            hotel: item.hotel.name || "",
            hotels: item.hotel || "",
            status: item.status ? item.status : "",
            type: item.id.toString().includes("-") ? "Dynamic" : "Static",
            from_date: item.from_date || "",
            to_date: item.to_date || "",
            child_age_from: item.child_age_from || "",
            child_age_to: item.child_age_to || "",
            base_meal: item.base_meal || "",
            duration: item.from_date && (
              <span>
                {formatDate(item.from_date)}
                <br />
                {formatDate(item.to_date)}
              </span>
            ),
            company:
              item.owner_type === 4
                ? "DMC"
                : item.owner_type === 6
                ? "Hotel"
                : item.owner_type === 9
                ? "Corporate"
                : "",
            markup: item.price_markup && (item.price_markup?.markup* 1).toFixed(2) + "%" || "",
          })
        );
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getContract();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "city",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "hotel",
      dataIndex: "hotel",
      key: "hotel",
    },
    {
      title: "contract",
      dataIndex: "contract",
      key: "contract",
    },
    {
      title: "duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (item) => (
        <span
          className={`${
            item == "Renewed"
              ? "text-[#FFC700]"
              : item == "Closed"
              ? "text-[#E40B0B]"
              : item == "Live"
              ? "text-[#008405]"
              : null
          }`}
        >
          {item}
        </span>
      ),
    },
    {
      title: "company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "markup",
      dataIndex: "markup",
      key: "markup",
    },
    {
      title: "action",
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
                    record?.id?.toString().includes("-")
                      ? router(`/Dynamic-Contract?record=${recordString}`)
                      : router(`/Static-Contract?record=${recordString}`);
                  }}
                  className="action-btn"
                >
                  edit
                </Button>
              </div>
            }
          >
            {EditIcon}
          </Popover>
        </span>
      ),
    },
  ];

  const items = ["Live", "Renewal", "Closed"];
  const handleItemClick = (item, index) => {
    setActiveItem(index);
    setStatusFilter(item);
  };
  return (
    <section>
      <div className="flex justify-between mb-2">
        <div className="flex">
          <Input
            className="search-bar"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            prefix={<SearchOutlined />}
            placeholder="Search Name"
          />
          <Button
            onClick={() => {
              setNameFilter("");
              setStatusFilter("");
              setActiveItem("");
            }}
            className="filter-bar"
            icon={<BsFilter />}
          >
            Filter
          </Button>
        </div>
        <Button
          onClick={showModal}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Contract
        </Button>
        <Modal
          className=""
          footer={false}
          open={isModalOpen}
          onOk={handleCancel}
          onCancel={handleCancel}
          style={{
            width: "400px",
            height: "300px",
            display: "flex",
            gap: "30px",
          }}
        >
          <h1 className="m-2 text-2xl font-semibold text-center capitalize">
            Select contract type
          </h1>
          <div className="w-[400px] h-[160px] flex items-center justify-evenly">
            <Button
              onClick={() => router("/Static-Contract")}
              className="contract-modal"
            >
              Static <br /> Contract
            </Button>
            <Button
              onClick={() => router("/Dynamic-Contract")}
              className="contract-modal"
            >
              Dynamic
              <br /> Contract
            </Button>
          </div>
          <Button
            className="list-btn right-5 bottom-2 absolute"
            onClick={handleCancel}
          >
            Close
          </Button>
        </Modal>
      </div>
      <div>
        <ul className="list-none text-[#A6A6A6]  flex justify-between my-2 max-w-[250px]">
          <li
            className={`cursor-pointer ${
              activeItem === "" ? "font-bold underline text-[#000000]" : ""
            }`}
            onClick={() => {
              setNameFilter("");
              setStatusFilter("");
              setActiveItem("");
            }}
          >
            All
          </li>
          {items.map((item, index) => (
            <li
              key={index}
              className={`cursor-pointer capitalize ${
                activeItem === index ? "font-bold underline text-[#000000]" : ""
              }`}
              onClick={() => handleItemClick(item, index)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Table
        size="small"
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        loading={loading}
      />
    </section>
  );
};

export default Contracts;
