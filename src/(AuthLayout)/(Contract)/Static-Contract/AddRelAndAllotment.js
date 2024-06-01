import { Button, DatePicker, Input, Select, message } from "antd";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { formatDate } from "../../components/Helper/FormatDate";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const RelAndAllotment = ({
  id,
  categoryData,
  handleCancel,
  getAllContractData,
}) => {
  const timestamp = new Date().toLocaleDateString();
  const minDate = new Date(timestamp);
  const [formData, setFormData] = useState({});
  const { from_date, to_date, category_id, allotment, rel } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        addAnRSC(
          cid: ${id}
          from: "${from_date}"
          to: "${to_date}"
          rId: ${category_id}
          alm: ${allotment}
          rel: ${rel}
      ) {
          message
        }
      }
    `;

    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res.data.addAnRSC?.message === "success") {
        message.success("Successful");
        getAllContractData();
        handleCancel();
        setFormData({});
      } else {
        message.error(res?.data.addAnRSC?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  return (
    <form className="w-full h-full p-4">
      <h1 className="title capitalize mb-5">add rel and allotment</h1>
      <span className="uppercase flex w-full justify-between">
        <DatePicker
          allowClear={false}
          format={formatDate}
          value={from_date ? dayjs(from_date) : null}
          disabledDate={(current) => current && current < minDate}
          placeholder="From Date:"
          onChange={(value, dateString) => {
            const dateObject = new Date(dateString ? dateString : null);
            const isoString = dateObject.toISOString();
            setFormData((prev) => ({ ...prev, from_date: isoString }));
          }}
          suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
        />
        <DatePicker
          allowClear={false}
          format={formatDate}
          value={to_date ? dayjs(to_date) : null}
          disabledDate={(current) => current && current < new Date(from_date)}
          placeholder="To Date:"
          onChange={(value, dateString) => {
            const dateObject = new Date(dateString ? dateString : null);
            const isoString = dateObject.toISOString();
            setFormData((prev) => ({ ...prev, to_date: isoString }));
          }}
          suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
        />
      </span>
      <label className="labelStyle mt-4">Room</label>
      <Select
        value={category_id}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, category_id: value }))
        }
        options={categoryData?.map((item) => ({
          key: item.id,
          value: item.id,
          label: item.name,
        }))}
        className="w-full"
      />
      <label className="labelStyle mt-4">Allotment</label>
      <Input
        name="allotment"
        value={allotment}
        onChange={onChange}
        className="w-full border-black"
      />
      <label className="labelStyle mt-4">Rel</label>
      <Input
        name="rel"
        value={rel}
        onChange={onChange}
        className="w-full border-black"
      />
      <Button onClick={onSubmit} className="m-5 button-bar float-right">
        Save
      </Button>
    </form>
  );
};

export default RelAndAllotment;
