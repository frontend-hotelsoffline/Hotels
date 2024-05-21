import { Button, Input, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import { GET_API } from "../../components/API/GetAPI";
import { useNavigate } from "react-router-dom";
import { EditIcon } from "../../components/Customized/EditIcon";

const Rooms = () => {
  const router = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  const filteredData = dataSource?.filter((a) =>
    a.name?.toLowerCase().includes(nameFilter.toLowerCase())
  );
  const getRooms = async () => {
    setLoading(true);
    const GET_ALL_ROOMS = `{
      getRooms {
        id
        name
        size
        units
        SGL
        DBL
        TWN
        TRPL
        QUAD
        UNIT
        desc
        status
        prio
        hId
        catId
        viewId
        tPax
        minA
        maxA
        maxC
        Beds
        sBed
        mcas
        ebeds
        maieb
        hotel {
            id
            name
        }
        images {
            id
            rId
            img_url
        }
        amenities {
            id
            amenity {
                id
                name
                desc
            }
        }
        view {
            id
            name
            desc
        }
        category {
            id
            name
            desc
        }
    }
  }`;
    const query = GET_ALL_ROOMS;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (res.data.getRooms) {
        const tableArray = res?.data.getRooms?.map((item) => ({
          key: item?.id,
          id: item?.id,
          name: item?.name || "",
          hotel: item?.hotel?.name || "",
          hotels: item?.hotel || "",
          no_of_units: item?.no_of_units || "",
          view: item?.view || "",
          priority: item?.prio || "",
          amenities: item?.amenities || "",
          occupancy:
            item.occupancies?.map((item) => (
              <ul>
                <li key={item.occupancy?.id}>{item.occupancy?.name}</li>
              </ul>
            )) || [],
          occupancies: item.occupancies || [],
          room_size: item?.size || "",
          giataId: item?.giataId ? item?.giataId : "",
          room_status: item?.room_status ? item?.room_status : "",
          category: item?.category?.name || "",
          categories: item?.category || "",
          description: item?.description || "",
          room_status: item?.status || "",
          images: item?.images || "",
          is_SGL: item?.is_SGL || "",
          is_DBL: item?.is_DBL || "",
          is_TWN: item?.is_TWN || "",
          is_TRPL: item?.is_TRPL || "",
          is_QUAD: item?.is_QUAD || "",
          is_UNIT: item?.is_UNIT || "",
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Hotel",
      dataIndex: "hotel",
      key: "hotel",
      sorter: (a, b) => (a.hotel ? a.hotel.localeCompare(b.hotel) : ""),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => (a.name ? a.name.localeCompare(b.name) : ""),
    },
    {
      title: "Room Order",
      dataIndex: "priority",
      key: "priority",
      sorter: (a, b) => (a.priority ? a.priority - b.priority : ""),
    },
    {
      title: "room size",
      dataIndex: "room_size",
      key: "room_size",
      sorter: (a, b) => (a.room_size ? a.room_size - b.room_size : ""),
    },
    {
      title: "room status",
      dataIndex: "room_status",
      key: "room_status",
      sorter: (a, b) =>
        a.room_status ? a.room_status.localeCompare(b.room_status) : "",
    },
    {
      title: "giata ID",
      dataIndex: "giataId",
      key: "giataId",
      sorter: (a, b) => (a.giataId ? a.giataId - b.giataId : ""),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) =>
        a.category ? a.category.localeCompare(b.category) : "",
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
                    router(`/Edit-Room?record=${recordString}`);
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
          onClick={() => router("/Add-Room")}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Room
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

export default Rooms;
