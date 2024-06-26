import { Button, Input, Modal, Popover, Table } from "antd";
import React, { useEffect, useState } from "react";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { BsFilter } from "react-icons/bs";

import { GET_API } from "../components/API/GetAPI";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../components/Helper/FormatDate";
import { EditIcon } from "../components/Customized/EditIcon";

const Services = () => {
  const router = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const filteredData = dataSource?.filter((item) => {
    return item.services.toLowerCase().includes(nameFilter.toLocaleLowerCase());
  });
  const getServices = async () => {
    const GET_ALL = `{
      getSvs {
        id
        CRT
        name
        desc
        mId
        from
        to
        locat
        country
        fcity
        tcity
        flon
        flat
        tlon
        tlat
        SMLink
        Ylink
        PPA
        PPK
        CAF
        CAT
        dcont
        Dfrom
        Dto
        MPD
        OT
        oC
        oId
        markup {
            id
            CRT
            name
            markup
        }
        images {
            id
            sId
            img_url
        }
    }
  }`;
    const query = GET_ALL;
    const path = "";
    setLoading(true);
    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data) {
        const tableArray = res.data.getSvs?.map((item) => ({
          key: item.id || "",
          id: item.id || "",
          services: item.name || "",
          description: item.desc || "",
          from_date: formatDate(item.from || null) || "",
          to_date: formatDate(item.to || null) || "",
          country: item.country || "",
          city: item.city || "",
          price_per_adult: item.PPA || "",
          price_per_kid: item.PPK || "",
          discount: item.dcont || "",
          child_age_from: item.CAF || "",
          child_age_to: item.CAT || "",
          discount_from: formatDate(item.Dfrom || null) || "",
          discount_to: formatDate(item.Dto || null) || "",
          min_pax_discount: item.MPD || "",
          social_media_link: item.SMLink || "",
          youtube_link: item.Ylink || "",
          longitude: item.longitude || "",
          latitude: item.latitude || "",
        }));
        setDataSource(tableArray);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "services",
      dataIndex: "services",
      key: "services",
      sorter: (a, b) =>
        a.services ? a.services.localeCompare(b.services) : "",
    },
    {
      title: "from date",
      dataIndex: "from_date",
      key: "from_date",
      sorter: (a, b) => a.from_date - b.from_date,
    },
    {
      title: "to date",
      dataIndex: "to_date",
      key: "to_date",
      sorter: (a, b) => a.to_date - b.to_date,
    },

    {
      title: "country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => (a.country ? a.country.localeCompare(b.country) : ""),
    },
    {
      title: "city",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => (a.city ? a.city.localeCompare(b.city) : ""),
    },
    {
      title: "price per adult",
      dataIndex: "price_per_adult",
      key: "price_per_adult",
      sorter: (a, b) =>
        a.price_per_adult ? a.price_per_adult - b.price_per_adult : "",
    },
    {
      title: "price per child",
      dataIndex: "price_per_kid",
      key: "price_per_kid",
      sorter: (a, b) =>
        a.price_per_kid ? a.price_per_kid - b.price_per_kid : "",
    },
    {
      title: "discount",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => (a.discount ? a.discount - b.discount : ""),
    },
    {
      title: "discount from",
      dataIndex: "discount_from",
      key: "discount_from",
      sorter: (a, b) =>
        a.discount_from ? a.discount_from - b.discount_from : "",
    },
    {
      title: "discount to",
      dataIndex: "discount_to",
      key: "discount_to",
      sorter: (a, b) => (a.discount_to ? a.discount_to - b.discount_to : ""),
    },
    {
      title: "min pax discount",
      dataIndex: "min_pax_discount",
      key: "min_pax_discount",
      sorter: (a, b) =>
        a.min_pax_discount ? a.min_pax_discount - b.min_pax_discount : "",
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
                    router(`/Edit-Services?record=${recordString}`);
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
          onClick={() => router("/Add-Services")}
          className="button-bar"
          icon={<PlusOutlined />}
        >
          Add Services
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

export default Services;
