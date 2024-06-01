import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import { GET_API } from "../../components/API/GetAPI";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "../../components/Customized/EditIcon";

const Packages = () => {
  const router = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModalEdit = () => {
    setIsModalOpenEdit(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEdit(false);
  };
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const filteredData = dataSource?.filter((item) => {
    return item.name.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getPackages = async () => {
    const GET_ALL = `{
      getPckgs {
        id
        CRT
        name
        ulnk
        slnk
        desc
        caFrom
        cato
        curr
        almt
        nonRef
        sProf
        from
        to
        aPric
        cPric
        diMA
        diAm
        disc
        mId
        images {
            id
            img_url
            pId
        }
        rooms {
            id
            room {
                id
                name
            }
            meal
        }
        svs {
            id
            service {
                id
                name
            }
        }
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data) {
        const tableArray = res.data.getPckgs.map((item) => ({
          key: item.id,
          id: item.id,
          name: item.name || "",
          description: item.desc || "",
          ownertype: item.owner_type || "",
          priceiffixed: item.price_if_fixed ? item.price_if_fixed : "",
          profit_of_seller: item.sProf || "",
          sharing_link: item.slnk || "",
          youtube_link: item.ulnk || "",
          images: item.images || [],
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },

    {
      title: "name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : ""),
    },
    {
      title: "owner type",
      dataIndex: "ownertype",
      key: "ownertype",
      sorter: (a, b) =>
        a.ownertype ? a.ownertype.localeCompare(b.ownertype) : "",
    },
    {
      title: "price if fixed",
      dataIndex: "priceiffixed",
      key: "priceiffixed",
      sorter: (a, b) => (a.priceiffixed ? a.priceiffixed - b.priceiffixed : ""),
    },
    {
      title: "profit of seller",
      dataIndex: "profit_of_seller",
      key: "profit_of_seller",
      sorter: (a, b) =>
        a.profit_of_seller ? a.profit_of_seller - b.profit_of_seller : "",
    },
    {
      title: "sharing link",
      dataIndex: "sharing_link",
      key: "sharing_link",
    },
    {
      title: "youtube link",
      dataIndex: "youtube_link",
      key: "youtube_link",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "Description",
      sorter: (a, b) =>
        a.description ? a.description.localeCompare(b.description) : "",
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
                    router(`/Edit-Package?record=${recordString}`);
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
          onClick={() => router("/Add-Package")}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Packages
        </Button>
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

export default Packages;
