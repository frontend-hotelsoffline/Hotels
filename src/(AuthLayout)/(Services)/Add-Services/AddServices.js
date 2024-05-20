"use client";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  Select,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useNavigate } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../components/Helper/FormatDate";
const formData2 = new FormData();
const timestamp = new Date().toLocaleDateString();
const minDate = new Date(timestamp);

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const AddServices = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const router = useNavigate();
  const [activeItem, setActiveItem] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    from_date: null,
    to_date: null,
    location: null,
    country: null,
    city: null,
    description: null,
    social_media_link: null,
    youtube_link: null,
    price_per_adult: null,
    price_per_kid: null,
    child_age_from: null,
    child_age_to: null,
    discount: null,
    discount_from: null,
    discount_to: null,
    min_pax_discount: null,
  });
  const {
    name,
    from_date,
    to_date,
    location,
    country,
    city,
    longitude,
    latitude,
    description,
    social_media_link,
    youtube_link,
    price_per_adult,
    price_per_kid,
    child_age_from,
    child_age_to,
    discount,
    discount_from,
    discount_to,
    min_pax_discount,
  } = formData;
  console.log(formData);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const images = fileList.map((item) => item.originFileObj);
    const mutation = `
      mutation($images: [Upload]) {
        addService(
          name: "${name}"
          from: "${from_date}"
          to: "${to_date}"
          locat: "${location}"
          country: "${country}"
          city: "${city}"
          lon: ${longitude}
        lat: ${latitude}
          desc: "${description}"
          SMlink: "${social_media_link}"
          Ylink: "${youtube_link}"
          PPA: ${price_per_adult}
          PPK: ${price_per_kid}
          CAF: ${child_age_from}
          CAT: ${child_age_to}
          dcont: ${discount}
          Dfrom: "${discount_from}"
          Dto: "${discount_to}"
          MPD: ${min_pax_discount}
          images: $images
      ) {
          message
      }
      }
    `;

    const path = "";
    try {
      formData2.delete("operations");
      formData2.delete("map");
      formData2.forEach((value, key) => {
        if (!["operations", "map"].includes(key)) {
          formData2.delete(key);
        }
      });
      let array = [];
      for (let i = 0; i < images.length; i++) {
        array.push(null);
      }
      const operations = JSON.stringify({
        query: mutation,
        variables: {
          images: array,
        },
      });
      formData2.append("operations", operations);
      let stringformap = {};
      for (let i = 0; i < images.length; i++) {
        stringformap[i.toString()] = ["variables.images." + i.toString()];
      }
      const map = JSON.stringify(stringformap);
      formData2.append("map", map);
      for (let i = 0; i < images.length; i++) {
        formData2.append(i.toString(), images[i]);
      }

      const res = await POST_API(path, formData2, headers);
      if (res.data.addService?.message === "success") {
        message.success("Services has been Added Successfully");
        router("/Services");
      } else {
        message(res.data.addService?.message);
      }
    } catch (error) {
      message.error("Failed to Add Services, Please check and try again");
      console.error(error);
    }
  };

  const items = ["Content", "Price"];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  return (
    <section>
      <ul className="list-none tab-btn  flex justify-between my-2 max-w-[120px]">
        {items.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer capitalize ${
              activeItem === index ? "font-bold tab-btn-active" : ""
            }`}
            onClick={() => handleItemClick(index)}
          >
            {item}
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="w-full capitalize">
        {activeItem === 0 ? (
          <div className="flex gap-5 md:gap-10">
            <div className="w-full space-y-3">
              <label className="labelStyle">
                Services
                <Input
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="type Services name here"
                  className="w-full border-black"
                />
              </label>
              <span className="flex gap-3">
                <label className="labelStyle w-full">
                  from date
                  <DatePicker
                    format={formatDate}
                    value={from_date ? dayjs(from_date) : null}
                    disabledDate={(current) =>
                      current && current < new Date(minDate)
                    }
                    className="w-full border-black"
                    placeholder="From Date:"
                    onChange={(value, dateString) => {
                      const dateObject = new Date(
                        dateString ? dateString : null
                      );
                      const isoString = dateObject.toISOString();
                      setFormData((prev) => ({
                        ...prev,
                        from_date: isoString,
                      }));
                    }}
                    suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                  />
                </label>
                <label className="labelStyle w-full">
                  to date
                  <DatePicker
                    format={formatDate}
                    value={to_date ? dayjs(to_date) : null}
                    disabledDate={(current) =>
                      current && current < new Date(from_date)
                    }
                    className="w-full border-black"
                    placeholder="To Date:"
                    onChange={(value, dateString) => {
                      const dateObject = new Date(
                        dateString ? dateString : null
                      );
                      const isoString = dateObject.toISOString();
                      setFormData((prev) => ({ ...prev, to_date: isoString }));
                    }}
                    suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                  />
                </label>
              </span>
              <span className="flex gap-3 w-full">
                <label className="labelStyle w-full">
                  country
                  <Input
                    name="country"
                    value={country}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
                <label className="labelStyle w-full">
                  city
                  <Input
                    name="city"
                    value={city}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
              </span>
              <label className="labelStyle">
                location
                <Input
                  name="location"
                  value={location}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <span className="flex gap-3 w-full">
                <label className="labelStyle w-full">
                  longitude
                  <Input
                    onKeyPress={handleKeyPress}
                    name="longitude"
                    value={longitude}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
                <label className="labelStyle w-full">
                  latitude
                  <Input
                    onKeyPress={handleKeyPress}
                    name="latitude"
                    value={latitude}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
              </span>
            </div>
            <div className="w-full">
              <label className="labelStyle">
                social media link
                <Input
                  name="social_media_link"
                  value={social_media_link}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <label className="labelStyle">
                youtube link
                <Input
                  name="youtube_link"
                  value={youtube_link}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <label className="labelStyle mt-3">
                Description
                <TextArea
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="type description here"
                  className="border-black"
                  style={{ height: 70 }}
                />
              </label>
              <label className="labelStyle">
                Image
                <Upload
                  beforeUpload={() => false}
                  listType="picture-card"
                  fileList={fileList}
                  customRequest={(file, onSuccess) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 8 ? null : (
                    <div>
                      <PlusOutlined />
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </label>
            </div>
          </div>
        ) : activeItem === 1 ? (
          <div className="flex gap-5 md:gap-10">
            <span className="flex flex-col gap-3 w-full">
              <label className="labelStyle">
                price per adult
                <Input
                  onKeyPress={handleKeyPress}
                  name="price_per_adult"
                  value={price_per_adult}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <label className="labelStyle">
                price per child
                <Input
                  onKeyPress={handleKeyPress}
                  name="price_per_kid"
                  value={price_per_kid}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <label className="labelStyle">
                child age from
                <Input
                  onKeyPress={handleKeyPress}
                  name="child_age_from"
                  value={child_age_from}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <label className="labelStyle">
                child age to
                <Input
                  onKeyPress={handleKeyPress}
                  name="child_age_to"
                  value={child_age_to}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
            </span>
            <span className="flex flex-col gap-3 w-full">
              <label className="labelStyle">
                discount
                <Input
                  onKeyPress={handleKeyPress}
                  name="discount"
                  value={discount}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <label className="labelStyle">
                discount from
                <DatePicker
                  format={formatDate}
                  value={discount_from ? dayjs(discount_from) : null}
                  disabledDate={(current) =>
                    current && current < new Date(minDate)
                  }
                  className="w-full border-black"
                  placeholder="discount from:"
                  onChange={(value, dateString) => {
                    const dateObject = new Date(dateString ? dateString : null);
                    const isoString = dateObject.toISOString();
                    setFormData((prev) => ({
                      ...prev,
                      discount_from: isoString,
                    }));
                  }}
                  suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                />
              </label>
              <label className="labelStyle">
                discount to
                <DatePicker
                  format={formatDate}
                  value={discount_to ? dayjs(discount_to) : null}
                  disabledDate={(current) =>
                    current && current < new Date(discount_from)
                  }
                  className="w-full border-black"
                  placeholder="discount to"
                  onChange={(value, dateString) => {
                    const dateObject = new Date(dateString ? dateString : null);
                    const isoString = dateObject.toISOString();
                    setFormData((prev) => ({
                      ...prev,
                      discount_to: isoString,
                    }));
                  }}
                  suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                />
              </label>
              <label className="labelStyle">
                min pax discount
                <Input
                  onKeyPress={handleKeyPress}
                  name="min_pax_discount"
                  value={min_pax_discount}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <Button htmlType="submit" className="m-5 list-btn float-right">
                Save
              </Button>
            </span>
          </div>
        ) : null}
      </form>
    </section>
  );
};

export default AddServices;
