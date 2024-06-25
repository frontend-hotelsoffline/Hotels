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
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { useNavigate } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import { PlusOutlined } from "@ant-design/icons";
import { formatDate } from "../../components/Helper/FormatDate";
import {
  countryList,
  currencyList,
  getAllCitiesOfCountry,
} from "../../components/Helper/ListOfAllCountries";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
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

export default function AddServices() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <AddService />;
}

const AddService = () => {
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
    longitude: 25,
    latitude: 55,
    tlongitude: 55,
    tlatitude: 25,
    nRef: "false",
  });
  const {
    name,
    almt,
    from_date,
    to_date,
    location,
    country,
    city,
    fcity,
    longitude,
    latitude,
    tlongitude,
    tlatitude,
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
    nRef,
    curr,
  } = formData;
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    if (country) {
      const selectedcountry = countryList.find((c) => c.value === country);
      setCityList(getAllCitiesOfCountry(selectedcountry.code));
    } else {
      setCityList([]);
    }
  }, [country, tlongitude, tlatitude, longitude, latitude]);

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
          name: ${name}
          from: "${from_date}"
          to: "${to_date}"
          locat: "${location}"
          country: "${country}"
          tcity: "${city}"
          fcity: "${fcity}"
          flon: ${longitude}
          flat: ${latitude}
          tlon: ${tlongitude}
          tlat: ${tlatitude}
          desc: "${description}"
          SMLink: "${social_media_link}"
          Ylink: "${youtube_link}"
          PPA: ${price_per_adult}
          PPK: ${price_per_kid}
          CAF: ${child_age_from}
          CAT: ${child_age_to}
          dcont: ${discount}
          Dfrom: "${discount_from}"
          Dto: "${discount_to}"
          MPD: ${min_pax_discount}
          nRef: ${nRef}
          curr: ${curr}
          almt: ${almt}
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
        message.success(res.data.addService?.message);
        router("/Services");
      } else {
        message(res.data.addService?.message);
      }
    } catch (error) {
      message.error("Failed to Add Services, Please check and try again");
    }
  };

  const items = ["Content", "Price"];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const handleSelectAddress = (newAddress) => {
    geocodeByAddress(newAddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
      )
      .catch((error) => message.error("Error", error));
  };
  const handleSelectAddressTo = (newAddress) => {
    geocodeByAddress(newAddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setFormData((prev) => ({ ...prev, tlatitude: lat, tlongitude: lng }))
      )
      .catch((error) => message.error("Error", error));
  };

  return (
    <section className="h-full">
      <ul className="list-none tab-btn  flex justify-between my-4 max-w-[180px]">
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
      <form onSubmit={onSubmit} className="w-full h-full capitalize">
        {activeItem === 0 ? (
          <div className="flex gap-5 md:gap-10">
            <div className="w-full space-y-3">
              <label className="labelStyle">
                Services
                <Select
                  value={name}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, name: value }))
                  }
                  options={[
                    { value: "service1", label: "service1" },
                    { value: "service2", label: "service2" },
                  ]}
                  className="w-full"
                />
              </label>
              <span className="flex gap-3">
                <label className="labelStyle w-full">
                  from date
                  <DatePicker
                    allowClear={false}
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
                    allowClear={false}
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
                  <Select
                    showSearch
                    value={country}
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLowerCase()
                      )
                    }
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                    options={countryList}
                    className="w-full"
                  />
                </label>
                <label className="labelStyle w-full">
                  from city
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLowerCase()
                      )
                    }
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, fcity: value }))
                    }
                    onSelect={handleSelectAddress}
                    options={cityList}
                    className="w-full"
                    value={fcity}
                  />
                </label>
                <label className="labelStyle w-full">
                  to city
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLowerCase()
                      )
                    }
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, city: value }))
                    }
                    onSelect={handleSelectAddressTo}
                    options={cityList}
                    className="w-full"
                    value={city}
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
                  From longitude
                  <Input
                    name="longitude"
                    value={longitude}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
                <label className="labelStyle w-full">
                  to longitude
                  <Input
                    name="tlongitude"
                    value={tlongitude}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
              </span>
              <span className="flex gap-3 w-full">
                <label className="labelStyle w-full">
                  From latitude
                  <Input
                    name="latitude"
                    value={latitude}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
                <label className="labelStyle w-full">
                  to latitude
                  <Input
                    name="tlatitude"
                    value={tlatitude}
                    onChange={onChange}
                    placeholder=""
                    className="w-full border-black"
                  />
                </label>
              </span>
              <span className="flex gap-3 w-full">
                <div className="w-full h-[200px] object-contain">
                  <GoogleMap
                    slot="action"
                    center={{ lat: latitude, lng: longitude }}
                    zoom={8}
                    map-id="gmpid"
                    mapContainerClassName="map-container"
                  >
                    <MarkerF
                      position={{ lat: latitude, lng: longitude }}
                    ></MarkerF>
                  </GoogleMap>
                </div>
                <div className="w-full h-[200px] object-contain">
                  <GoogleMap
                    slot="action"
                    center={{ lat: tlatitude, lng: tlongitude }}
                    zoom={8}
                    map-id="gmpid"
                    mapContainerClassName="map-container"
                  >
                    <MarkerF
                      position={{ lat: tlatitude, lng: tlongitude }}
                    ></MarkerF>
                  </GoogleMap>
                </div>
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
            <span className="flex flex-col gap-3 pb-20 w-full h-full relative">
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
              <span className="flex justify-between w-full">
                <label className="labelStyle">
                  discount from
                  <DatePicker
                    allowClear={false}
                    format={formatDate}
                    value={discount_from ? dayjs(discount_from) : null}
                    disabledDate={(current) =>
                      current && current < new Date(minDate)
                    }
                    className="w-full border-black"
                    placeholder="discount from:"
                    onChange={(value, dateString) => {
                      const dateObject = new Date(
                        dateString ? dateString : null
                      );
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
                    allowClear={false}
                    format={formatDate}
                    value={discount_to ? dayjs(discount_to) : null}
                    disabledDate={(current) =>
                      current && current < new Date(discount_from)
                    }
                    className="w-full border-black"
                    placeholder="discount to"
                    onChange={(value, dateString) => {
                      const dateObject = new Date(
                        dateString ? dateString : null
                      );
                      const isoString = dateObject.toISOString();
                      setFormData((prev) => ({
                        ...prev,
                        discount_to: isoString,
                      }));
                    }}
                    suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
                  />
                </label>
              </span>
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
              <label className="labelStyle">
                Allotment
                <Input
                  onKeyPress={handleKeyPress}
                  name="almt"
                  value={almt}
                  onChange={onChange}
                  placeholder=""
                  className="w-full border-black"
                />
              </label>
              <span className="flex justify-between gap-10">
                <label className="labelStyle w-full">
                  currency
                  <Select
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label?.toLowerCase() ?? "").includes(
                        input?.toLowerCase()
                      )
                    }
                    value={curr}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, curr: value }))
                    }
                    options={currencyList}
                    className="w-full"
                  />
                </label>
                <label className="labelStyle w-full">
                  Non refundable
                  <Select
                    value={nRef}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, nRef: value }))
                    }
                    options={[
                      { value: "true", label: "Yes" },
                      { value: "false", label: "No" },
                    ]}
                    className="w-full"
                  />
                </label>
              </span>
              <Button
                htmlType="submit"
                className="button-bar absolute right-0 bottom-0"
              >
                Save
              </Button>
            </span>
          </div>
        ) : null}
      </form>
    </section>
  );
};
