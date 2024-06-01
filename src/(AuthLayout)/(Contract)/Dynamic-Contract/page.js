import { Button, DatePicker, Input, Select, message } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { POST_API } from "../../components/API/PostAPI";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import { currencyList } from "../../components/Helper/ListOfAllCountries";
import GetAllHotels from "../../components/Helper/GetAllHotels";
import GetAllDMCsOfHotel from "../../components/Helper/GetDMCsOfAHotel";
import GetHotelByID from "../../components/Helper/GetHotelByID";

const DynamicContract = () => {
  const timestamp = new Date().toLocaleDateString();
  const router = useNavigate();
  const { hotelValue } = GetAllHotels();
  const [activeItem, setActiveItem] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const record = searchParams.get("record");
  const parsedRecord = record ? JSON.parse(record) : null;

  const [formData, setFormData] = useState({
    id_from_contract_id: parsedRecord?.id || "",
    city: parsedRecord?.city || "",
    country: parsedRecord?.country || "",
    currency: parsedRecord?.currency || "",
    status: parsedRecord?.status || "",
    hotel_id: parsedRecord?.hotels?.id || parsedRecord?.hotelid || "",
    from_date: parsedRecord?.from_date || null,
    to_date: parsedRecord?.to_date || null,
    child_age_from: parsedRecord?.child_age_from || "",
    child_age_to: parsedRecord?.child_age_to || "",
    name: parsedRecord?.contract || "",
  });

  const {
    is_this_created_by_owner,
    owner_type,
    owner_id,
    name,
    currency,
    status,
    country,
    city,
    hotel_id,
    from_date,
    to_date,
    child_age_from,
    child_age_to,
    channel,
    hotel_id_external_api,
    giata_id,
  } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { DMCsOfHotelValue } = GetAllDMCsOfHotel(hotel_id);
  const { HotelByIDValue } = GetHotelByID(hotel_id);
  const onSubmitHeader = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_dynamic_contract(
            name: "${name}"
            currency: "${currency}"
            status: ${status}
            country: "${country}"
            city: "${city}"
            hotel_id: ${hotel_id}
            from_date: "${from_date}"
            to_date: "${to_date}"
            child_age_from: ${child_age_from}
            child_age_to: ${child_age_to}
            channel: "${channel}"
            hotel_id_external_api: "${hotel_id_external_api}"
            giata_id: "${giata_id}"
            is_this_created_by_owner: ${is_this_created_by_owner}
            owner_type: ${owner_type || 0}
            owner_id: ${owner_id || 0}
            ) {
              id
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

      if (res.data && !res.errors) {
        message.success("Contract has been Added Successfully");
        // setFormData((prev) => ({ ...prev, id_from_contract_id: res.id }));

        console.log(res.id);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed");
      console.error(error);
    }
  };

  const items = [
    "Prices",
    "Meals",
    "Offers",
    "Supplements",
    "Room setup",
    "Cancellations",
    "Distribution",
    "Mark-up",
  ];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  return (
    <section className="w-full space-y-6 capitalize">
      <div className="w-full md:flex justify-between gap-10">
        <span className="flex flex-col">
          <span className="flex gap-2">
            <label className="label-style">
              country
              <Select
                value={country}
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                className="h-[34px] inputfildinsearch-bg w-[170px]"
                options={hotelValue.map((item) => ({
                  key: item.id,
                  value: item.country ? item.country : "",
                  label: item.country ? item.country : "",
                }))}
                onChange={(value) => {
                  // Automatically select the corresponding city based on the selected country
                  const correspondingCity = hotelValue.find(
                    (item) => item.country === value
                  )?.city;
                  setFormData((prevData) => ({
                    ...prevData,
                    country: value,
                    city: correspondingCity,
                  }));
                }}
              />
            </label>
            <label className="label-style">
              city
              <Select
                value={city}
                showSearch
                filterOption={(input, option) =>
                  (option?.label.toLowerCase() ?? "").includes(
                    input.toLowerCase()
                  )
                }
                className="h-[34px] inputfildinsearch-bg w-[170px]"
                options={hotelValue.map((item) => ({
                  key: item.id,
                  value: item.city ? item.city : "",
                  label: item.city ? item.city : "",
                }))}
                onChange={(value) => {
                  // Automatically select the corresponding country based on the selected city
                  const correspondingCountry = hotelValue.find(
                    (item) => item.city === value
                  )?.country;
                  setFormData((prevData) => ({
                    ...prevData,
                    city: value,
                    country: correspondingCountry,
                  }));
                }}
              />
            </label>
          </span>
          <label className="labelStyle">hotel</label>
          <Select
            value={hotel_id}
            showSearch
            filterOption={(input, option) =>
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            className="input-style w-full  inputfildinsearch-bg"
            options={hotelValue.map((item) => ({
              value: item.id ? item.id : "",
              label: item.name ? item.name : "",
            }))}
            onChange={(value) => {
              // Automatically select the corresponding country based on the selected city
              const correspondingCountry = hotelValue.find(
                (item) => item.id === value
              )?.country;
              const correspondingCity = hotelValue.find(
                (item) => item.id === value
              )?.city;
              setFormData((prevData) => ({
                ...prevData,
                hotel_id: value,
                country: correspondingCountry,
                city: correspondingCity,
              }));
            }}
          />
        </span>
        <span>
          <label className="labelStyle">
            contract name
            <Input
              value={name}
              name="name"
              onChange={onChange}
              className="h-[34px] inputfildinsearch"
            />
          </label>
          <label className="labelStyle">duration(from-to)</label>
          <span className="flex gap-3">
            <DatePicker
              allowClear={false}
              placeholder="From"
              className="h-[34px] inputfildinsearch"
              onChange={(value, dateString) => {
                const dateObject = new Date(dateString ? dateString : null);
                const isoString = dateObject.toISOString();
                setFormData((prev) => ({ ...prev, from_date: isoString }));
              }}
              suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
            />
            <DatePicker
              allowClear={false}
              placeholder="To"
              onChange={(value, dateString) => {
                const dateObject = new Date(dateString ? dateString : null);
                const isoString = dateObject.toISOString();
                setFormData((prev) => ({ ...prev, to_date: isoString }));
              }}
              className="h-[34px] inputfildinsearch"
              suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
            />
          </span>
        </span>
        <span className="grid grid-cols-2 gap-x-3 md:w-[30vw]">
          <label className="labelStyle">
            currency
            <Select
              showSearch
              filterOption={(input, option) =>
                (option?.label?.toLowerCase() ?? "").includes(
                  input?.toLowerCase()
                )
              }
              value={currency}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, currency: value }))
              }
              options={currencyList}
              className="h-[34px] inputfildinsearch"
              placeholder="Currency"
            />
          </label>
          <label className="labelStyle">
            Status
            <Select
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
              options={[
                { value: "Live", label: "Live" },
                { value: "Closed", label: "Closed" },
              ]}
              className="h-[34px] inputfildinsearch"
              placeholder="Status"
            />
          </label>
          <label className="labelStyle">
            Child age(from-to)
            <Input
              className="h-[34px] inputfildinsearch"
              onKeyPress={handleKeyPress}
              placeholder="Min Age"
              value={child_age_from}
              name="child_age_from"
              onChange={onChange}
              max={17}
              min={0}
            />
          </label>
          <Input
            value={child_age_to}
            name="child_age_to"
            onChange={onChange}
            className="h-[34px] inputfildinsearch mt-6"
            onKeyPress={handleKeyPress}
            placeholder="Max Age"
            max={17}
            min={0}
          />
        </span>
      </div>
      <div className="flex gap-4 items-end">
        <label className="labelStyle">
          giata id
          <Input
            className="h-[34px] inputfildinsearch"
            placeholder="giata id"
            value={giata_id}
            name="giata_id"
            onChange={onChange}
          />
        </label>
        <label className="labelStyle">
          channel
          <Input
            className="h-[34px] inputfildinsearch"
            placeholder="channel"
            value={channel}
            name="channel"
            onChange={onChange}
          />
        </label>
        <label className="labelStyle">
          hotel_id_external_api
          <Input
            className="h-[34px] inputfildinsearch"
            placeholder="hotel_id_external_api"
            value={hotel_id_external_api}
            name="hotel_id_external_api"
            onChange={onChange}
          />
        </label>
        <span className="flex justify-evenly w-full">
          <label className="labelStyle w-[170px]">
            owner type
            <Select
              className="inputfildinsearch"
              value={owner_type}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  owner_type: value,
                  owner_id: "",
                }))
              }
              options={[
                { value: 4, label: "Users Under DMC" },
                { value: 6, label: "Users Under Hotel" },
              ]}
            />
          </label>
          <label className="labelStyle w-[170px]">
            owner ID
            <Select
              className="inputfildinsearch"
              value={owner_id}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, owner_id: value }))
              }
              options={
                owner_type === 4
                  ? DMCsOfHotelValue.dmc?.map((item) => ({
                      value: item.id ? item.id : "",
                      label: item.name ? item.name : "",
                    }))
                  : owner_type === 6
                  ? HotelByIDValue.users_under_hotel?.map((item) => ({
                      value: item.id ? item.id : "",
                      label: item.uname ? item.uname : "",
                    }))
                  : null
              }
            />
          </label>
          <label className="labelStyle">
            created by owner
            <Select
              className="inputfildinsearch"
              value={is_this_created_by_owner}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  is_this_created_by_owner: value,
                }))
              }
              options={[
                { value: true, label: "true" },
                { value: false, label: "false" },
              ]}
            />
          </label>
        </span>
        <Button onClick={onSubmitHeader} className="list-btn">
          Save
        </Button>
      </div>
      <div>
        <ul className="list-none tab-btn  flex justify-between max-w-4xl my-6">
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
          <li
            className={`cursor-pointer ${
              activeItem === "" ? "font-bold tab-btn-active" : ""
            }`}
            onClick={() => {
              setActiveItem("");
            }}
          >
            Availability
          </li>
        </ul>
      </div>
    </section>
  );
};

export default DynamicContract;
