"use client";
import {
  Button,
  DatePicker,
  Input,
  InputNumber,
  Popover,
  Rate,
  Select,
  Slider,
  message,
} from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { POST_API } from "../components/API/PostAPI";
import { date_to_pass } from "../components/Helper/FrontendTimezone";
import dayjs from "dayjs";
import { countryList } from "../components/Helper/ListOfAllCountries";
import GetAllPlacesOfInterest from "../components/Helper/GetAllPlacesOfInterest";
import GetAllRoomView from "../components/Helper/GetAllRoomView";
import GetAllDMCs from "../components/Helper/GetAllDMCs";
import { formatDate } from "../components/Helper/FormatDate";

const timestamp = new Date().toLocaleDateString();
const minDate = new Date(timestamp);
const ButtonGroup = Button.Group;

const SearchCard = ({ imageUrl, facility, price, description }) => (
  <div className="flex bg-[#e9e9e9] w-full my-2">
    <img
      className="rounded-md"
      width={300}
      height={300}
      src={imageUrl}
      alt={imageUrl}
    />
    <div className="p-5 w-full min-w-[150px]">
      <h1 className="text-lg">{facility}</h1>
      <p className="text-sm">{description}</p>
      <p className="text-md">Price: AED {price}</p>
    </div>
  </div>
);

const Search = () => {
  const { placeOfInterestValue } = GetAllPlacesOfInterest();
  const { DMCsValue } = GetAllDMCs();
  const { roomViewValue, getAllRoomV } = GetAllRoomView();
  const [adultCount, setadultCount] = useState(0);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    youtube_link: "",
  });
  const {
    city_hotel,
    checkin,
    checkout,
    meal,
    children,
    rooms,
    nationality,
    id_of_place_of_intrst,
    view_id,
    dmc_id,
  } = formData;

  const filteredPlaceOfInterest = placeOfInterestValue
    ?.filter((item) => item.country === nationality)
    .map((item) => ({
      value: item.id ? item.id : "",
      label: item.name ? item.name : "",
    }));

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //fecth search Data
  const fecthSearchData = async () => {
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
          search_hotels(
              city_hotel: "${city_hotel}"
              checkin: "${checkin || 0}"
              checkout: "${checkout || 0}"
              adults: ${adultCount}
              children: ${childrenCount}
              rooms: ${roomsCount}
              nationality: "${nationality || ""}"
              frontend_timezone_to_cal_date_range: "${date_to_pass}"
          ) {
              hotel_id
              cheapest_cancellable_rooms {
                  contract_id
                  room_id
                  grouped_data {
                      id
                      createdAt
                      from_date
                      to_date
                      sgl
                      dbl
                      twn
                      trl
                      qud
                      unit
                      min_stay
                      max_stay
                  }
              }
              cheapest_non_canclbl_rooms {
                  contract_id
                  room_id
                  grouped_data {
                      id
                      createdAt
                      from_date
                      to_date
                      sgl
                      dbl
                      twn
                      trl
                      qud
                      unit
                      min_stay
                      max_stay
                  }
              }
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
      console.log(res);
      if (res) {
      }
    } catch (error) {
      message.error("Failed");
      console.error(error);
    }
  };

  const increase = (category) => {
    if (category == "adult") setadultCount(adultCount + 1);
    else if (category == "children")
      setChildrenCount(childrenCount < 10 ? childrenCount + 1 : childrenCount);
    else if (category == "rooms") setRoomsCount(roomsCount + 1);
  };
  const decrease = (category) => {
    if (category == "adult") setadultCount(adultCount > 0 ? adultCount - 1 : 0);
    else if (category == "children")
      setChildrenCount(childrenCount > 0 ? childrenCount - 1 : 0);
    else if (category == "rooms")
      setRoomsCount(roomsCount > 0 ? roomsCount - 1 : 0);
  };
  const content = () => (
    <div className="w-80 p-4 space-y-2">
      <div className="flex justify-between">
        {adultCount} Adults
        <ButtonGroup>
          <Button onClick={() => decrease("adult")} icon={<MinusOutlined />} />
          <Button onClick={() => increase("adult")} icon={<PlusOutlined />} />
        </ButtonGroup>
      </div>
      <div className="flex justify-between">
        {childrenCount} Children
        <ButtonGroup>
          <Button
            onClick={() => decrease("children")}
            icon={<MinusOutlined />}
          />
          <Button
            onClick={() => increase("children")}
            icon={<PlusOutlined />}
          />
        </ButtonGroup>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {childrenCount > 0 &&
          Array.from({ length: childrenCount }, (_, index) => (
            <div className=" flex gap-1">
              Age: <InputNumber min={0} max={17} />
            </div>
          ))}
      </div>
      <div className="flex justify-between">
        {roomsCount} Rooms
        <ButtonGroup>
          <Button onClick={() => decrease("rooms")} icon={<MinusOutlined />} />
          <Button onClick={() => increase("rooms")} icon={<PlusOutlined />} />
        </ButtonGroup>
      </div>
    </div>
  );
  const { RangePicker } = DatePicker;

  useEffect(() => {
    // fecthSearchData()
  }, []);
  return (
    <section>
      <div className="flex mb-5 filter-section items-center gap-5 px-2 justify-between md:flex-row flex-col">
        <Input
          prefix={<SearchOutlined />}
          className=" border-black inputfildinsearch min-w-[150px] h-[40px]"
          placeholder="Search Here"
          name="city_hotel"
          value={city_hotel}
          onChange={onChange}
        />
        <RangePicker
          format={formatDate}
          value={[
            checkin ? dayjs(checkin) : null,
            checkout ? dayjs(checkout) : null,
          ]}
          placeholder={["Check-In Date", "Check-Out Date"]}
          className="w-full min-w-[270px] border-black inputfildinsearch h-[40px]"
          suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          onChange={(value, dateString) => {
            console.log(dateString[0]);
            const dateObject = new Date(dateString ? dateString[0] : null);
            const dateObject1 = new Date(dateString ? dateString[1] : null);
            const isoString = dateObject.toISOString();
            const isoString1 = dateObject1.toISOString();
            setFormData((prev) => ({
              ...prev,
              checkin: isoString,
              checkout: isoString1,
            }));
          }}
        />
        <Popover placement="bottom" content={content} trigger="click">
          <Button
            icon={<UserOutlined />}
            className="w-full gap-3 capitalize inputfildinsearch h-[40px]"
          >
            <p>{adultCount} adult.</p> <p>{childrenCount} children.</p>{" "}
            <p>{roomsCount} rooms</p>
          </Button>
        </Popover>
        <Select
          value={nationality}
          showSearch
          filterOption={(input, option) =>
            (option?.label?.toLowerCase() ?? "").includes(input?.toLowerCase())
          }
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, nationality: value }))
          }
          options={countryList}
          className="h-[40px] inputfildinsearch w-full"
          placeholder="Country"
        />
        <Button
          onClick={fecthSearchData}
          className="list-btn border-black md:w-auto w-full"
        >
          Search
        </Button>
      </div>
      <div className="flex flex-row">
        <div className="w-80 pr-5">
          <h1 className="title">Filter by:</h1>
          <p className="sub-title">Hotel Stars </p>
          <Rate
            defaultValue={3}
            style={{
              border: "1px black solid",
              padding: "3px 10px",
              width: "100%",
            }}
          />
          <div className="p-1 shadow-sm shadow-black my-3 gap-4">
            <h1 className="sub-title">Price Range</h1>
            Your Budget Per night
            <br />
            AED 50 - AED 2,000
            <Slider min={50} max={2000} />
          </div>
          <h1>Place of interest</h1>
          <Select
            className="w-full mb-2"
            showSearch
            value={id_of_place_of_intrst}
            filterOption={(input, option) =>
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            options={filteredPlaceOfInterest}
            onChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                id_of_place_of_intrst: value,
              }));
            }}
          />
          <h1>Room view</h1>
          <Select
            showSearch
            value={view_id}
            filterOption={(input, option) =>
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            className="input-style w-full"
            options={roomViewValue}
            onChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                view_id: value,
              }));
            }}
          />
          <h1>Meals</h1>
          <Select
            value={meal}
            options={[
              // { value: "N/A", label: "N/A" },
              { value: "ROOM ONLY", label: "ROOM ONLY" },
              { value: "BREAKFAST", label: "BREAKFAST" },
              { value: "HB", label: "HB" },
              { value: "FB", label: "FB" },
              { value: "SOFT ALL INC", label: "SOFT ALL INC" },
              { value: "ALL INC", label: "ALL INC" },
              { value: "ULTRA ALL INC", label: "ULTRA ALL INC" },
            ]}
            onChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                meal: value,
              }));
            }}
            className="w-full border-black"
          />
          <h1>Supplier</h1>
          <Select
            value={dmc_id}
            showSearch
            filterOption={(input, option) =>
              (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
            }
            className="input-style w-full"
            options={DMCsValue.map((item) => ({
              value: item.id ? item.id : "",
              label: item.name ? item.name : "",
            }))}
            onChange={(value) => {
              setFormData((prevData) => ({
                ...prevData,
                dmc_id: value,
              }));
            }}
          />
        </div>
        <div className="w-full">
          {/*will map the results here
         <SearchCard
          facility="Nice Hotel in Dubai"
          description="This is very beautiful and Cheap lajfl aljlfdla lahlfasd l aie"
          price={400}
          imageUrl="/Login.jpeg"
        /> */}
        </div>
      </div>
    </section>
  );
};

export default Search;
