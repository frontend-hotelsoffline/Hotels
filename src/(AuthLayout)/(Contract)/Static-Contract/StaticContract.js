import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import {
  columns,
  markupColumns,
  distributionColumns,
  cancellationsColumns,
  supplementsColumns,
  offersColumns,
  measlColumns,
  roomSetupColums,
} from "./contractTableHead";
import TextArea from "antd/es/input/TextArea";
import GetAllHotels from "../../components/Helper/GetAllHotels";
import GetAllContracts from "../GetAllContracts";
import { formatDate } from "../../components/Helper/FormatDate";
import { handleKeyPress } from "../../components/Helper/ValidateInputNumber";
import GetAllPricingMarkUp from "../../components/Helper/GetAllPricingMarkUp";
import GetAllDMCs from "../../components/Helper/GetAllDMCs";
import {
  countryList,
  currencyList,
} from "../../components/Helper/ListOfAllCountries";
import GetAllCorporates from "../../components/Helper/GetAllCorporate";
import GetAllUsers from "../../components/Helper/GetAllUsers";
import RoomSetup from "./RoomSetup";
import AvailabilityCalendar from "./AvailabilityCalender";
import AddRegion from "./AddRegion";
import RegionsForCountries from "../../components/Helper/RegionsForCountries";
import GetAllDMCsOfHotel from "../../components/Helper/GetDMCsOfAHotel";
import GetHotelByID from "../../components/Helper/GetHotelByID";
import { useLocation } from "react-router-dom";

const StaticContract = () => {
  const { Option } = Select;
  const { hotelValue } = GetAllHotels();
  const { regionCountries, getRegionsWithCountries } = RegionsForCountries();
  const [Occupancy_and_category_cross, setOccupancy_and_category_cross] =
    useState([]);
  const { userAgent } = GetAllUsers();
  const [categoryData, setCategoryData] = useState([]);
  const [rowData, setRowData] = useState({});
  const { DMCsValue } = GetAllDMCs();
  const { CorporatesValue } = GetAllCorporates();
  const timestamp = new Date().toLocaleDateString();
  const minDate = new Date(timestamp);
  const [activeItem, setActiveItem] = useState(0);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [showRegionPopUp, setShowRegionPopUp] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const record = searchParams.get("record");
  const parsedRecord = record ? JSON.parse(record) : null;

  const [formDataHeader, setFormDataHeader] = useState({
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
    base_meal: parsedRecord?.base_meal || "",
  });
  const initialData = {
    is_linked: false,
    is_room: false,
    is_meals: false,
    is_supp: false,
    is_non_refundable: false,
    is_non_refundable_offer: false,
    is_this_created_by_owner: false,
    sgl: Array(categoryData.length).fill(""),
    dbl: Array(categoryData.length).fill(""),
    rel: Array(categoryData.length).fill(""),
    allotment: Array(categoryData.length).fill(""),
    unit: Array(categoryData.length).fill(""),
    qud: Array(categoryData.length).fill(""),
    trl: Array(categoryData.length).fill(""),
    twn: Array(categoryData.length).fill(""),
    min_stay: Array(categoryData.length).fill(""),
    max_stay: Array(categoryData.length).fill(""),
  };
  const [formData, setFormData] = useState(initialData);
  const {
    owner_id,
    owner_type,
    id_from_contract_id,
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
    base_meal,
    is_this_created_by_owner,
  } = formDataHeader;

  const {
    room_id_0_if_All,
    is_non_refundable,
    is_non_refundable_offer,
    price_markup_id,
    user_level,
    user_id_0_if_All_in_level,
    offer,
    room_category_id,
    stay_from,
    stay_to,
    booking_window_from,
    booking_window_to,
    discount_amount,
    discount_rate,
    source_country,
    is_linked,
    is_room,
    is_meals,
    is_supp,
    order,
    ultra_all_inc_adult,
    soft_all_inc_adult,
    all_inc_adult,
    fb_adult,
    hb_adult,
    breakfast_adult,
    room_only_adult,
    ultra_all_inc_child,
    soft_all_inc_child,
    all_inc_child,
    fb_child,
    hb_child,
    breakfast_child,
    room_only_child,
    service,
    supplement,
    price_adult,
    price_child,
    P_in_Half_Double_adult_amount,
    P_in_Half_Double_adult_rate,
    P_in_Half_Double_child_amount,
    P_in_Half_Double_child_rate,
    type,
    cancellation_days,
    cancellation_panelty_rate,
    booking_policy,
    agent_id_0_if_all,
    corporates_id_0_if_all,
    dmc_id_0_if_all,
    price_from_date,
    price_to_date,
    date_from,
    date_to,
    meals_from_date,
    meals_to_date,
    offer_stay_from,
    offer_stay_to,
    supp_type,
    supp_room_category_id,
    supp_child_age_from,
    supp_child_age_to,
  } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFormDataHeader((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // seting type for Select for offer and supplement amount and %
  const [discountType, setDiscountType] = useState("amount");
  const [supplementType, setSupplementType] = useState("");
  const [supplementChildType, setSupplementChildType] = useState("");

  const handleSelectChange = (value) => {
    setDiscountType(value);
  };

  const onSubmitHeader = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !currency ||
      !country ||
      !city ||
      !hotel_id ||
      !child_age_from ||
      !child_age_to ||
      !base_meal
    )
      return;
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
    addSCHead(
            name: "${name}"
            cur: ${currency}
            status: ${status}
            hId: ${hotel_id}
            caFrom: ${child_age_from}
            caT: ${child_age_to}
            bMeal: ${base_meal}
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
      if (res.data.addSCHead?.message === "success") {
        message.success(res.data.addSCHead?.message);
        setFormDataHeader((prev) => ({
          ...prev,
          id_from_contract_id: res?.data?.addSCHead?.id,
        }));
      } else {
        message.error(res.data.addSCHead?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  //////Submitting Prices of a Contract//////////////
  const onSubmitPrice = async (e) => {
    e.preventDefault();
    if (
      !formData.price_from_date ||
      !formData.price_to_date ||
      !id_from_contract_id
    ) {
      message.error("Please fill in all required fields.");
      return;
    }

    const headers = {
      "Content-Type": "application/json",
    };

    const pricesArray = categoryData.map((item, index) => {
      return {
        room_id: item.id,
        sgl: parseFloat(formData.sgl[index]) || -1,
        dbl: parseFloat(formData.dbl[index]) || -1,
        twn: parseFloat(formData.twn[index]) || -1,
        trl: parseFloat(formData.trl[index]) || -1,
        qud: parseFloat(formData.qud[index]) || -1,
        unit: parseFloat(formData.unit[index]) || -1,
        min_stay: parseFloat(formData.min_stay[index]) || -1,
        max_stay: parseFloat(formData.max_stay[index]) || -1,
      };
    });
    const pricesFiltered = pricesArray.filter((entry) =>
      Object.entries(entry)
        .slice(1)
        .some(([, value]) => value !== -1)
    );

    const numericPricesArray = pricesFiltered.map((entry) => {
      return Object.fromEntries(
        Object.entries(entry).map(([key, value]) => [
          key,
          typeof value === "number" ? value : parseFloat(value),
        ])
      );
    });
    const mutation = `
    mutation {
      create_a_static_contract_body_prices_of_contract(
        id_from_contracts: ${id_from_contract_id},
        prices_of_contract: ${JSON.stringify(
          numericPricesArray.map((price) => ({
            from_date: price_from_date,
            to_date: price_to_date,
            array_of_prices_of_all_categories: { ...price },
          }))
        ).replace(/"([^"]+)":/g, "$1:")}
      ) {
        respmessage
      
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
      if (res.data) {
        message.success("Price has been Added Successfully");
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.data?.respmessage);
      }
    } catch (error) {
      message.error("Failed to Add Contract, Please check and try again");
    }
  };

  const onSubmitMeals = async (e) => {
    e.preventDefault();
    if (!id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_static_contract_body_meals_of_contract(
        id_from_contracts: ${id_from_contract_id}
         from_date :"${meals_from_date}",  to_date:"${meals_to_date}", room_only_adult:${room_only_adult},  
          room_only_child:${room_only_child || -1}, breakfast_adult:${
      breakfast_adult || -1
    }, breakfast_child:${breakfast_child || -1}, 
          hb_adult:${hb_adult || -1},  hb_child:${hb_child || -1}, fb_adult:${
      fb_adult || -1
    }, fb_child:${fb_child || -1}, 
          soft_all_inc_adult:${soft_all_inc_adult || -1}, soft_all_inc_child:${
      soft_all_inc_child || -1
    }, all_inc_adult:${all_inc_adult || -1}, 
          all_inc_child:${all_inc_child || -1}, ultra_all_inc_adult:${
      ultra_all_inc_adult || -1
    }, ultra_all_inc_child:${ultra_all_inc_child || -1},
          
        ) {
          respmessage
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
      if (res.data) {
        message.success(
          res.data.create_a_static_contract_body_meals_of_contract?.respmessage
        );
        getAllContractData();
        setFormData(initialData);
      }
    } catch (error) {
      message.error("Failed to Add Contract, Please check and try again");
    }
  };
  const onSubmitOffers = async (e) => {
    e.preventDefault();
    if (!offer || !booking_window_from || !id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_static_contract_body_offers_of_contract(
        id_from_contracts: ${id_from_contract_id}
           offer: "${offer}", room_id :${room_category_id},  stay_from: "${offer_stay_from}",  stay_to: "${offer_stay_to}", 
           booking_window_from: "${booking_window_from}",  booking_window_to: "${booking_window_to}",  
          discount_amount : ${discount_amount || -1},  discount_rate  : ${
      discount_rate || -1
    },  source_country_0_if_All: ${JSON.stringify(
      source_country?.length > 0
        ? source_country.map((item) => ({
            source_country: item,
          }))
        : "source_country_0_if_All: 0"
    ).replace(/"([^"]+)":/g, "$1:")},  
          is_linked : ${is_linked},  is_room   : ${is_room},  is_meals: ${is_meals}, 
           is_supp: ${is_supp}, is_non_refundable: ${is_non_refundable_offer}  order : ${order} 
        ) {
          respmessage
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
      if (res.data.create_a_static_contract_body_offers_of_contract) {
        message.success(
          res.data.create_a_static_contract_body_offers_of_contract?.respmessage
        );
        getAllContractData();
        setFormData(initialData);
      }
    } catch (error) {
      message.error("Failed");
    }
  };
  const onSubmitSupp = async (e) => {
    e.preventDefault();
    if (!service || !supplement || !id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_static_contract_body_supplements_of_contract(
        id_from_contracts: ${id_from_contract_id}
        supplements_of_contract: [
          { service :"${service}", supplement :"${supplement}", type :"${supp_type}", room_id:${supp_room_category_id},  
          stay_from:"${stay_from}", stay_to:"${stay_to}",
               price_adult :${price_adult || -1}, price_child : ${
      price_child || -1
    },  P_in_Half_Double_adult_amount : ${
      P_in_Half_Double_adult_amount || -1
    },  
               P_in_Half_Double_adult_rate : ${
                 P_in_Half_Double_adult_rate || -1
               },  
               P_in_Half_Double_child_amount : ${
                 P_in_Half_Double_child_amount || -1
               }, P_in_Half_Double_child_rate : ${
      P_in_Half_Double_child_rate || -1
    },  
               child_age_from : ${supp_child_age_from || -1}, child_age_to : ${
      supp_child_age_to || -1
    } 
          }]
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
      if (res.data) {
        message.success("Supplement has been Added Successfully");
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed to Add Contract, Please check and try again");
    }
  };
  const onSubmitCancellation = async (e) => {
    e.preventDefault();
    if (
      !cancellation_days ||
      !type ||
      !date_from ||
      !date_to ||
      !cancellation_panelty_rate ||
      !id_from_contract_id
    ) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_static_contract_body_cancellation_of_contract(
        id_from_contracts: ${id_from_contract_id}
        booking_cancellation_policy: "${booking_policy}"  
        room_id_0_if_All:${room_id_0_if_All} 
        cancellation_of_contract: [
          { date_from : "${date_from}",  date_to : "${date_to}",  type : "${type}", 
          cancellation_days  : ${
            cancellation_days || -1
          },  cancellation_panelty_rate : ${cancellation_panelty_rate || -1} 
          is_non_refundable: ${is_non_refundable || false}
        },
      ]
        ) {
          respmessage
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
      if (res.data) {
        message.success(
          res.data.create_a_static_contract_body_cancellation_of_contract
            ?.respmessage
        );
        getAllContractData();
        setFormData(initialData);
      }
    } catch (error) {
      message.error("Failed to Add Contract, Please check and try again");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_static_contract_body_distribution_of_contract(
        id_from_contracts: ${id_from_contract_id}          
        countrie_names_for_distribution_of_contract: ${JSON.stringify(
          selectedCountries?.length > 0
            ? selectedCountries?.map((item) => ({
                country_All_if_all: item,
              }))
            : "country_All_if_all: 0"
        ).replace(/"([^"]+)":/g, "$1:")}        
        dmc_ids_for_distribution_of_contract: ${JSON.stringify(
          dmc_id_0_if_all?.length > 0
            ? dmc_id_0_if_all.map((item) => ({
                dmc_id_0_if_all: item,
              }))
            : "dmc_id_0_if_all: 0"
        ).replace(/"([^"]+)":/g, "$1:")}
        corporate_ids_for_distribution_of_contract: ${JSON.stringify(
          corporates_id_0_if_all?.length > 0
            ? corporates_id_0_if_all?.map((item) => ({
                corporates_id_0_if_all: item,
              }))
            : "corporates_id_0_if_all: 0"
        ).replace(/"([^"]+)":/g, "$1:")}
        agent_ids_for_distribution_of_contract: ${JSON.stringify(
          agent_id_0_if_all?.length > 0
            ? agent_id_0_if_all?.map((item) => ({
                agent_id_0_if_all: item,
              }))
            : "agent_id_0_if_all: 0"
        ).replace(/"([^"]+)":/g, "$1:")}
    ) {
        id
        createdAt
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
      if (res.data) {
        message.success("Successful");
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmitMarkup = async (e) => {
    e.preventDefault();
    if (!price_markup_id || !id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      create_a_static_contract_body_buyer_markup(
        id_from_contracts: ${id_from_contract_id}
        user_level: ${user_level}
        user_ids: ${JSON.stringify(
          user_id_0_if_All_in_level.map((item) => ({
            user_id_0_if_All_in_level: Number(item),
          }))
        ).replace(/"([^"]+)":/g, "$1:")}
        buyer_markup: ${price_markup_id}
    ) {
        id
    }}
  `;

    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res.data && !res.errors) {
        message.success("Successful");
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.errors[0].message);
      }
    } catch (error) {
      message.error("Failed, Please check and try again");
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
    "Availability",
  ];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };

  const { DMCsOfHotelValue } = GetAllDMCsOfHotel(hotel_id);
  const { HotelByIDValue } = GetHotelByID(hotel_id);
  useEffect(() => {
    getRegionsWithCountries();
    const hotelRooms =
      hotelValue.find((item) => item.id === hotel_id)?.rooms || [];

    // Use Set to keep track of unique category names
    const uniqueCategoryNames = new Set();

    // Filter out duplicates and update categoryData
    const filteredCategoryData = hotelRooms.filter((item) => {
      if (!uniqueCategoryNames.has(item?.name)) {
        uniqueCategoryNames.add(item?.name);
        return true;
      }
      return false;
    });

    const occupancyAndCategory = hotelRooms.reduce((acc, room) => {
      const { category } = room;
      const category_id = category.id;

      ["SGL", "DBL", "TWN", "TRPL", "QUAD", "UNIT"].forEach((occupancyType) => {
        if (room[`is_${occupancyType}`]) {
          const occupancy = `is_${occupancyType}`;
          const occupancyObj = { category_id, occupancy };
          if (!uniqueCategoryNames.has(JSON.stringify(occupancyObj))) {
            uniqueCategoryNames.add(JSON.stringify(occupancyObj));
            acc.push(occupancyObj);
          }
        }
      });

      return acc;
    }, []);

    const sortedOccupancyData = filteredCategoryData.map(({ category }) => ({
      category_id: category.id,
      array_of_occupancies: occupancyAndCategory
        .filter((item) => item.category_id === category.id)
        .map((item) => item.occupancy),
    }));

    setOccupancy_and_category_cross(sortedOccupancyData);

    setCategoryData(filteredCategoryData);
  }, [hotel_id, hotelValue, id_from_contract_id]);

  const onChangePrice = (e, dataIndex, index) => {
    const newValues = [...formData[dataIndex]];
    newValues[index] = e.target.value;
    setFormData((prev) => ({ ...prev, [dataIndex]: newValues }));
  };

  const renderInputs = (dataIndex, occupancy) => {
    return (
      categoryData.length > 0 &&
      Array.from({ length: categoryData.length }, (_, index) => (
        <div key={index} className="flex justify-center">
          {" "}
          <Input
            key={index}
            onChange={(e) => onChangePrice(e, dataIndex, index)}
            className="borderedRow active"
            onKeyPress={handleKeyPress}
            value={formData[dataIndex][index]}
            min={0}
          />
        </div>
      ))
    );
  };

  const renderInputs_for_occupancy = (dataIndex, occupancy) => {
    return (
      categoryData.length > 0 &&
      Array.from({ length: categoryData.length }, (_, index) => (
        <div className="w-full text-center flex justify-center" key={index}>
          {Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
            occupancy
          ) && (
            <Input
              key={index}
              onChange={(e) => onChangePrice(e, dataIndex, index)}
              className="borderedRow active"
              onKeyPress={handleKeyPress}
              value={formData[dataIndex][index]}
              min={0}
            />
          )}

          {!Occupancy_and_category_cross[index]?.array_of_occupancies.includes(
            occupancy
          ) && <Input readOnly className="borderedRow inactive" />}
        </div>
      ))
    );
  };

  const dataSource = [
    {
      key: "priceData",
      timestamp: (
        <span className="whitespace-nowrap">{formatDate(timestamp)}</span>
      ),
      date: (
        <span className="uppercase flex flex-col justify-center">
          <DatePicker
            className="w-[120px]"
            format={formatDate}
            value={price_from_date ? dayjs(price_from_date) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, price_from_date: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            className="w-[120px]"
            format={formatDate}
            value={price_to_date ? dayjs(price_to_date) : null}
            disabledDate={(current) =>
              current && current < new Date(price_from_date)
            }
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, price_to_date: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      category: (
        <span className="w-full">
          {categoryData.map((item) => (
            <span
              className="flex mb-2 text-start h-[25px] items-center justify-center whitespace-nowrap"
              key={item.id}
            >
              {item.name}
            </span>
          ))}
        </span>
      ),
      SGL: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("sgl", "is_SGL")}
        </span>
      ),
      DBL: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("dbl", "is_DBL")}
        </span>
      ),
      TWN: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("twn", "is_TWN")}
        </span>
      ),
      TRPL: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("trl", "is_TRPL")}
        </span>
      ),
      QUAD: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("qud", "is_QUD")}
        </span>
      ),
      unit: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("unit", "is_UNIT")}
        </span>
      ),
      minstay: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs("min_stay")}
        </span>
      ),
      maxstay: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs("max_stay")}
        </span>
      ),
      allotment: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs("allotment")}
        </span>
      ),
      rel: <span className="gap-y-2 flex flex-col">{renderInputs("rel")}</span>,
      action: (
        <Button onClick={onSubmitPrice} className="save-btn">
          Save
        </Button>
      ),
    },
  ];

  const mealsDataSource = [
    {
      key: "mealsDataSource",
      timestamp: (
        <span className="whitespace-nowrap">{formatDate(timestamp)}</span>
      ),
      date: (
        <span className="w-[120px] uppercase flex flex-col">
          <DatePicker
            format={formatDate}
            value={meals_from_date ? dayjs(meals_from_date) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            bordered={false}
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, meals_from_date: isoString }));
            }}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            format={formatDate}
            value={meals_to_date ? dayjs(meals_to_date) : null}
            disabledDate={(current) =>
              current && current < new Date(meals_from_date)
            }
            placeholder="To Date:"
            bordered={false}
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, meals_to_date: isoString }));
            }}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      roomonly: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={room_only_adult}
            name="room_only_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={room_only_child}
            name="room_only_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      breakfast: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={breakfast_adult}
            name="breakfast_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={breakfast_child}
            name="breakfast_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      hb: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={hb_adult}
            name="hb_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={hb_child}
            name="hb_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      fb: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={fb_adult}
            name="fb_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={fb_child}
            name="fb_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      softallinc: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={soft_all_inc_adult}
            name="soft_all_inc_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={soft_all_inc_child}
            name="soft_all_inc_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      allinc: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={all_inc_adult}
            name="all_inc_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={all_inc_child}
            name="all_inc_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      ultraallinc: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={ultra_all_inc_adult}
            name="ultra_all_inc_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={ultra_all_inc_child}
            name="ultra_all_inc_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      action: (
        <Button onClick={onSubmitMeals} className="save-btn">
          Save
        </Button>
      ),
    },
  ];

  const offersDataSource = [
    {
      key: "offersdata",
      timestamp: (
        <span className="whitespace-nowrap">{formatDate(timestamp)}</span>
      ),
      offer: (
        <Input
          value={offer}
          name="offer"
          onChange={onChange}
          className="w-[200px]"
        />
      ),
      roomcategory: (
        <Select
          value={room_category_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, room_category_id: value }))
          }
          options={[
            { value: 0, label: "All rooms" },
            ...categoryData.map((item) => ({
              key: item.id,
              value: item.id,
              label: item.name,
            })),
          ]}
          className="w-[140px]"
        />
      ),
      stay: (
        <span className="w-[110px] uppercase flex flex-col">
          <DatePicker
            format={formatDate}
            value={offer_stay_from ? dayjs(offer_stay_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, offer_stay_from: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            format={formatDate}
            value={offer_stay_to ? dayjs(offer_stay_to) : null}
            disabledDate={(current) =>
              current && current < new Date(offer_stay_from)
            }
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, offer_stay_to: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      bookingwindow: (
        <span className="w-[110px] uppercase flex flex-col">
          <DatePicker
            format={formatDate}
            value={booking_window_from ? dayjs(booking_window_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({
                ...prev,
                booking_window_from: isoString,
              }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            format={formatDate}
            value={booking_window_to ? dayjs(booking_window_to) : null}
            disabledDate={(current) =>
              current && current < new Date(booking_window_from)
            }
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({
                ...prev,
                booking_window_to: isoString,
              }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      discount: (
        <span>
          <Select
            value={discountType}
            onChange={handleSelectChange}
            className="w-[100px] mb-1"
          >
            <Option value="amount">Amount</Option>
            <Option value="percentage">%</Option>
          </Select>
          {discountType === "amount" && (
            <Input
              className="w-[100px]"
              value={discount_amount}
              name="discount_amount"
              onChange={onChange}
              onKeyPress={handleKeyPress}
            />
          )}
          {discountType === "percentage" && (
            <Input
              className="w-[100px]"
              value={discount_rate}
              name="discount_rate"
              onChange={onChange}
              onKeyPress={handleKeyPress}
            />
          )}
        </span>
      ),
      source: (
        <Select
          value={source_country}
          mode={source_country?.includes(0) ? null : "multiple"}
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          onChange={(value) => {
            const selectedValues = Array.isArray(value) ? value : [value];
            setFormData((prev) => ({
              ...prev,
              source_country: selectedValues,
            }));
          }}
          options={[{ value: 0, label: "All" }, ...countryList]}
          className="w-[200px] h-[70px]"
        />
      ),
      linked: (
        <Checkbox
          value={is_linked}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              is_linked: value.target.checked,
            }))
          }
          className="float-right"
        />
      ),
      room: (
        <Checkbox
          value={is_room}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, is_room: value.target.checked }))
          }
          className="float-right"
        />
      ),
      meals: (
        <Checkbox
          value={is_meals}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, is_meals: value.target.checked }))
          }
          className="float-right"
        />
      ),
      supp: (
        <Checkbox
          value={is_supp}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, is_supp: value.target.checked }))
          }
          className="float-right"
        />
      ),
      order: (
        <Select
          value={order}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, order: value }))
          }
          options={[
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
          ]}
          className="w-[52px]"
        />
      ),
      nonrefundable: (
        <Checkbox
          value={is_non_refundable_offer}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              is_non_refundable_offer: value.target.checked,
            }))
          }
        />
      ),
      action: (
        <Button onClick={onSubmitOffers} className="save-btn">
          Save
        </Button>
      ),
    },
  ];
  const supplementsDataSource = [
    {
      key: "suppledat",
      timestamp: (
        <span className="whitespace-nowrap">{formatDate(timestamp)}</span>
      ),
      service: (
        <Input
          value={service}
          name="service"
          onChange={onChange}
          className="w-[130px] h-[25px]"
          type="text"
        />
      ),
      supplement: (
        <Select
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, supplement: value }))
          }
          options={[
            { value: "Per day", label: "Per day" },
            { value: "Per stay", label: "Per stay" },
          ]}
          className="w-[100px] h-[25px]"
        />
      ),
      type: (
        <Select
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, supp_type: value }))
          }
          options={[
            { value: "Per Person", label: "Per Person" },
            { value: "Per Booking", label: "Per Booking" },
            { value: "Per Room", label: "Per Room" },
          ]}
          className="w-[100px] h-[25px]"
        />
      ),
      roomcategory: (
        <Select
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, supp_room_category_id: value }))
          }
          options={[
            { value: 0, label: "All Room" },
            ...categoryData.map((item) => ({
              key: item.id,
              value: item.id,
              label: item.name,
            })),
          ]}
          className="w-[140px] h-[25px]"
        />
      ),
      stay: (
        <span className="w-[120px] uppercase flex flex-col">
          <DatePicker
            format={formatDate}
            value={stay_from ? dayjs(stay_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, stay_from: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            format={formatDate}
            value={stay_to ? dayjs(stay_to) : null}
            disabledDate={(current) => current && current < new Date(stay_from)}
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, stay_to: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      price: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> adult</label>
          <Input
            value={price_adult}
            name="price_adult"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> child</label>
          <Input
            value={price_child}
            name="price_child"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      supplementbased: (
        //   <span className="items-center text-center">
        //   <label className="labelStyle mt-2">Adult</label>
        //   <Select
        //   value={supplementType}
        //   onChange={(value)=>setSupplementType(value)}
        //   className="w-[100px] h-[25px]"
        // >
        //   <Option value="amountForSupplement">Amount</Option>
        //   <Option value="percentageForSupplement">%</Option>
        // </Select>
        //       {supplementType === "amountForSupplement" &&  <Input
        //           value={P_in_Half_Double_adult_amount}
        //           name="P_in_Half_Double_adult_amount"
        //           onChange={onChange}
        //           className="w-[70px] h-[25px]"
        //           onKeyPress={handleKeyPress}
        //         />}
        //       {supplementType === "percentageForSupplement" && <Input
        //           value={P_in_Half_Double_adult_rate}
        //           name="P_in_Half_Double_adult_rate"
        //           onChange={onChange}
        //           className="w-[70px] h-[25px]"
        //           onKeyPress={handleKeyPress}
        //         />}
        //     <label className="labelStyle mt-2"> child</label>
        //     <span>
        //     <Select
        //   value={supplementChildType}
        //   onChange={(value)=>{setSupplementChildType(value)}}
        //   className="w-[100px] h-[25px]"
        // >
        //   <Option value="amountForSupplementChild">Amount</Option>
        //   <Option value="percentageForSupplementChild">%</Option>
        // </Select>
        //       {supplementChildType === "amountForSupplementChild" && <Input
        //           value={P_in_Half_Double_child_amount}
        //           name="P_in_Half_Double_child_amount"
        //           onChange={onChange}
        //           className="w-[70px] h-[25px]"
        //           onKeyPress={handleKeyPress}
        //         />}

        //        {supplementChildType === "percentageForSupplementChild" && <Input
        //           value={P_in_Half_Double_child_rate}
        //           name="P_in_Half_Double_child_rate"
        //           onChange={onChange}
        //           className="w-[70px] h-[25px]"
        //           onKeyPress={handleKeyPress}
        //         />}
        //     </span>
        //   </span>
        <Input
          value={P_in_Half_Double_adult_rate}
          name="P_in_Half_Double_adult_rate"
          onChange={onChange}
          className="w-[70px] h-[25px]"
          onKeyPress={handleKeyPress}
        />
      ),
      childage: (
        <span className="gap-y-2 ">
          <label className="labelStyle"> From</label>
          <Input
            value={supp_child_age_from}
            name="supp_child_age_from"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
          <label className="labelStyle"> To</label>
          <Input
            value={supp_child_age_to}
            name="supp_child_age_to"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            onKeyPress={handleKeyPress}
          />
        </span>
      ),
      action: (
        <Button onClick={onSubmitSupp} className="save-btn">
          Save
        </Button>
      ),
    },
  ];
  const cancellationsDataSource = [
    {
      key: "cancellationdata",
      timestamp: (
        <span className="whitespace-nowrap">{formatDate(timestamp)}</span>
      ),
      date: (
        <span className="w-[120px] uppercase flex flex-col">
          <DatePicker
            format={formatDate}
            value={date_from ? dayjs(date_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, date_from: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            format={formatDate}
            value={date_to ? dayjs(date_to) : null}
            disabledDate={(current) => current && current < new Date(date_from)}
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, date_to: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      type: (
        <Select
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
          options={[
            { value: "first night", label: "first night" },
            { value: "full stay", label: "full stay" },
          ]}
          className="w-[100px] h-[25px]"
          onKeyPress={handleKeyPress}
        />
      ),
      cancellationdays: (
        <Input
          value={cancellation_days}
          name="cancellation_days"
          onChange={onChange}
          className="w-[100px] h-[25px]"
          onKeyPress={handleKeyPress}
        />
      ),
      penaltyrate: (
        <Input
          value={cancellation_panelty_rate}
          name="cancellation_panelty_rate"
          onChange={onChange}
          className="w-[100px] h-[25px]"
          onKeyPress={handleKeyPress}
        />
      ),
      room: (
        <Select
          value={room_id_0_if_All}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, room_id_0_if_All: value }))
          }
          options={[
            { value: 0, label: "All Rooms" },
            ...categoryData.map((item) => ({
              value: item.id,
              label: item.name,
            })),
          ]}
          className="w-[140px] h-[25px]"
        />
      ),
      bookingpolicy: (
        <TextArea
          value={booking_policy}
          name="booking_policy"
          onChange={onChange}
        />
      ),
      refundable: (
        <Checkbox
          value={is_non_refundable}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              is_non_refundable: value.target.checked,
            }))
          }
        />
      ),
      action: (
        <Button onClick={onSubmitCancellation} className="save-btn">
          Save
        </Button>
      ),
    },
  ];

  const defaultRegions = [
    { region: "All", countries: [] },
    {
      region: "GCC",
      countries: [
        "Bahrain",
        "Kuwait",
        "Oman",
        "Qatar",
        "Saudi Arabia",
        "United Arab Emirates",
      ],
    },
  ];

  // Remove duplicate entries based on the "region" property
  const uniqueRegionCountries = regionCountries.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.region === item.region)
  );

  const regions = [...defaultRegions, ...uniqueRegionCountries];

  const handleCountryChange = (country) => {
    setSelectedCountries([...selectedCountries, country]);
  };

  const onCheckAllChange = (e, countries) => {
    setSelectedCountries(e.target.checked ? countries : []);
  };

  const handleCancel = () => {
    setShowRegionPopUp(false);
  };

  const distributionDataSource = [
    {
      key: "distribudat",
      chooseacountry: (
        <div className="h-[400px] overflow-y-auto w-full">
          <Modal
            footer={false}
            open={showRegionPopUp}
            onOk={handleCancel}
            onCancel={handleCancel}
          >
            <AddRegion handleCancel={handleCancel} />
          </Modal>
          {regions.map((list) => (
            <div className="mb-4 flex flex-col" key={list.region}>
              <Checkbox
                className="calendar-head"
                onChange={(e) => onCheckAllChange(e, list.countries)}
                checked={selectedCountries.length === list.countries.length}
              >
                {list.region}
              </Checkbox>
              <div className="grid grid-cols-4 items-start gap-2 text-start">
                {Array.isArray(list.countries) &&
                  list.countries.map((country) => (
                    <div className="w-full whitespace-nowrap" key={country}>
                      <Checkbox
                        className="sub-title"
                        checked={selectedCountries.includes(country)} // Check if country is selected
                        onChange={() => handleCountryChange(country)}
                      >
                        {country}
                      </Checkbox>
                    </div>
                  ))}
              </div>
              <i className="bg-black w-full h-[2px] my-1" />
            </div>
          ))}
        </div>
      ),
      dmc_id: (
        <Select
          mode={dmc_id_0_if_all?.includes(0) ? null : "multiple"}
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          className="h-[70px] w-[150px]"
          options={[
            { value: 0, label: "All" },
            ...DMCsValue.map((item) => ({
              value: item.id ? item.id : "",
              label: item.name ? item.name : "",
            })),
          ]}
          onChange={(value) => {
            const selectedValues = Array.isArray(value) ? value : [value];
            setFormData((prevData) => ({
              ...prevData,
              dmc_id_0_if_all: selectedValues.map(Number),
            }));
          }}
        />
      ),
      corporates_id: (
        <Select
          mode={corporates_id_0_if_all?.includes(0) ? null : "multiple"}
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          className="h-[70px] w-[150px]"
          options={[
            { value: 0, label: "All" },
            ...CorporatesValue?.map((item) => ({
              value: item.id ? item.id : "",
              label: item.name ? item.name : "",
            })),
          ]}
          onChange={(value) => {
            const selectedValues = Array.isArray(value) ? value : [value];
            setFormData((prevData) => ({
              ...prevData,
              corporates_id_0_if_all: selectedValues,
            }));
          }}
        />
      ),
      agent_id: (
        <Select
          mode={agent_id_0_if_all?.includes(0) ? null : "multiple"}
          showSearch
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          className="h-[70px] w-[150px]"
          options={[
            { value: 0, label: "All" },
            ...userAgent.map((item) => ({
              value: item.id ? item.id : "",
              label: item.uname ? item.uname : "",
            })),
          ]}
          onChange={(value) => {
            const selectedValues = Array.isArray(value) ? value : [value];
            setFormData((prevData) => ({
              ...prevData,
              agent_id_0_if_all: selectedValues,
            }));
          }}
        />
      ),
      action: (
        <Button onClick={onSubmit} className="save-btn">
          Save
        </Button>
      ),
    },
  ];
  const { MarkUpValue } = GetAllPricingMarkUp();
  const markupDataSource = [
    {
      key: "markupDataSourz",
      userLevel: (
        <Select
          className="inputfildinsearch"
          value={user_level}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              user_level: value,
              user_id_0_if_All_in_level: 0,
            }))
          }
          options={[
            { value: 4, label: "DMC" },
            { value: 6, label: "Hotel" },
          ]}
        />
      ),
      userid: (
        <Select
          mode={
            Array.isArray(user_id_0_if_All_in_level) &&
            user_id_0_if_All_in_level.includes(0)
              ? null
              : "multiple"
          }
          value={user_id_0_if_All_in_level}
          className="w-[200px] capitalize font-normal"
          onChange={(value) => {
            const selectedValues = Array.isArray(value) ? value : [value];
            setFormData((prev) => ({
              ...prev,
              user_id_0_if_All_in_level: selectedValues,
            }));
          }}
          options={[
            { value: 0, label: "All" },
            ...(user_level === 4
              ? DMCsOfHotelValue.dmc?.map((item) => ({
                  value: item.id ? item.id : "",
                  label: item.name ? item.name : "",
                })) || []
              : user_level === 6
              ? HotelByIDValue.users_under_hotel?.map((item) => ({
                  value: item.id ? item.id : "",
                  label: item.uname ? item.uname : "",
                }))
              : []),
          ]}
        />
      ),
      markup: (
        <Select
          value={price_markup_id}
          className="w-[200px] capitalize font-normal"
          onChange={(value) => {
            setFormData((prev) => ({ ...prev, price_markup_id: value }));
          }}
          options={
            MarkUpValue
              ? MarkUpValue.map((item) => ({
                  key: item.id,
                  label: item.name,
                  value: Number(item.id),
                }))
              : ""
          }
        />
      ),
      timestamp: formatDate(timestamp),
      action: (
        <Button onClick={onSubmitMarkup} className="save-btn">
          Save
        </Button>
      ),
    },
  ];
  const {
    mealsData,
    OffersData,
    supplementsData,
    cancellationData,
    priceData,
    priceMarkupData,
    distributionData,
    loading,
    roomSetupData,
    getAllContractData,
    compressData,
    rawPriceData,
  } = GetAllContracts(
    id_from_contract_id,
    rowData,
    hotel_id,
    Occupancy_and_category_cross,
    hotelValue
  );
  const { roomSetupDataSource } = RoomSetup({
    categoryData,
    hotel_id,
    id_from_contract_id,
    getAllContractData,
  });

  const columnsData =
    activeItem === 0
      ? columns
      : activeItem === 1
      ? measlColumns
      : activeItem === 2
      ? offersColumns
      : activeItem === 3
      ? supplementsColumns
      : activeItem === 4
      ? roomSetupColums
      : activeItem === 5
      ? cancellationsColumns
      : activeItem === 6
      ? distributionColumns
      : activeItem === 7
      ? markupColumns
      : null;

  const firstTableData =
    activeItem === 0
      ? dataSource
      : activeItem === 1
      ? mealsDataSource
      : activeItem === 2
      ? offersDataSource
      : activeItem === 3
      ? supplementsDataSource
      : activeItem === 4
      ? roomSetupDataSource
      : activeItem === 5
      ? cancellationsDataSource
      : activeItem === 6
      ? distributionDataSource
      : activeItem === 7
      ? markupDataSource
      : null;

  const secondTableData =
    activeItem === 0
      ? priceData
      : activeItem === 1
      ? mealsData
      : activeItem === 2
      ? OffersData
      : activeItem === 3
      ? supplementsData
      : activeItem === 4
      ? roomSetupData
      : activeItem === 5
      ? cancellationData
      : activeItem === 6
      ? distributionData
      : activeItem === 7
      ? priceMarkupData
      : null;

  // Check if firstTableData is iterable, if not, provide a default value (an empty array in this case)
  const combinedDataSource = [
    ...(firstTableData && Symbol.iterator in Object(firstTableData)
      ? firstTableData
      : []),
    ...(secondTableData && Symbol.iterator in Object(secondTableData)
      ? secondTableData
      : []),
  ];

  return (
    <section className="w-full h-[700px] space-y-2 capitalize">
      <div className="w-full md:flex justify-between">
        <span className="flex flex-col">
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
              setFormDataHeader((prevData) => ({
                ...prevData,
                hotel_id: value,
                country: correspondingCountry,
                city: correspondingCity,
              }));
            }}
          />
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
                  setFormDataHeader((prevData) => ({
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
                  setFormDataHeader((prevData) => ({
                    ...prevData,
                    city: value,
                    country: correspondingCountry,
                  }));
                }}
              />
            </label>
          </span>
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
            <Input
              readOnly
              placeholder="From Date"
              value={from_date ? formatDate(from_date) : ""}
              className="inputfildinsearch h-[34px] w-[170px]"
            />
            <Input
              readOnly
              placeholder="To Date"
              value={to_date ? formatDate(to_date) : ""}
              className="inputfildinsearch h-[34px] w-[170px]"
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
                setFormDataHeader((prev) => ({ ...prev, currency: value }))
              }
              options={currencyList}
              className="h-[34px] inputfildinsearch"
              placeholder="Currency"
            />
          </label>
          <label className="labelStyle">
            Status
            <Select
              value={status}
              onChange={(value) =>
                setFormDataHeader((prev) => ({ ...prev, status: value }))
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
      <div className="w-full md:flex justify-between">
        <span className="flex gap-4">
          <label className="labelStyle">
            base meal
            <Select
              className="h-[34px] inputfildinsearch w-[170px]"
              placeholder="base meal"
              value={base_meal}
              onChange={(value) =>
                setFormDataHeader((prev) => ({ ...prev, base_meal: value }))
              }
              options={[
                // { value: "N/A", label: "N/A" },
                { value: "ROOM_ONLY", label: "ROOM ONLY" },
                { value: "BREAKFAST", label: "BREAKFAST" },
                { value: "HB", label: "HB" },
                { value: "FB", label: "FB" },
                { value: "SOFT ALL INC", label: "SOFT ALL INC" },
                { value: "ALL INC", label: "ALL INC" },
                { value: "ULTRA ALL INC", label: "ULTRA ALL INC" },
              ]}
            />
          </label>
          <label className="labelStyle">
            contract ID
            <Input
              className="h-[34px] inputfildinsearch w-[160px]"
              onKeyPress={handleKeyPress}
              placeholder="Contract ID"
              value={id_from_contract_id}
              name="id_from_contract_id"
              onChange={onChange}
              readOnly
            />
          </label>
        </span>
        <span className="flex w-[500px] items-end">
          {id_from_contract_id ? null : (
            <Button onClick={onSubmitHeader} className="list-btn">
              Save
            </Button>
          )}
        </span>
      </div>
      <div>
        <ul className="list-none text-[#A6A6A6]  flex justify-between max-w-4xl my-6">
          {items.map((item, index) => (
            <li
              key={index}
              className={`cursor-pointer capitalize ${
                activeItem === index ? "font-bold underline text-[#000000]" : ""
              }`}
              onClick={() => handleItemClick(index)}
            >
              {item}
            </li>
          ))}
          {/* <li
            className={`cursor-pointer ${
              activeItem === "" ? "font-bold underline text-[#000000]" : ""
            }`}
            onClick={() => {
              setActiveItem("");
            }}
          >
            Availability
          </li> */}
          {activeItem === 6 && (
            <Button
              className="action-btn absolute right-20"
              onClick={() => setShowRegionPopUp(true)}
            >
              Add Region
            </Button>
          )}
        </ul>
      </div>
      <div className="w-full">
        <div>
          {activeItem === 8 ? (
            <AvailabilityCalendar
              record={rawPriceData}
              compressData={compressData}
              loading={loading}
              getAllContractData={getAllContractData}
              id={id_from_contract_id}
              categoryData={categoryData}
              hotel_id={hotel_id}
            />
          ) : (
            <Table
              columns={columnsData}
              dataSource={combinedDataSource}
              loading={loading}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setRowData(record);
                  },
                };
              }}
            />
          )}
        </div>
      </div>
      <div></div>
    </section>
  );
};

export default StaticContract;
