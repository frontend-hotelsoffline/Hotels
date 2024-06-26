import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
  Popconfirm,
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
  agentColumns,
  corporateColumns,
  DMCColumns,
  countryColumns,
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
import { useLocation } from "react-router-dom";
import MarkupSC from "./MarkupSC";
import { BiTrash } from "react-icons/bi";
import GetProfile from "../../components/Helper/GetProfile";

const StaticContract = () => {
  const { Option } = Select;
  const { hotelValue } = GetAllHotels();
  const { regionCountries, getRegionsWithCountries } = RegionsForCountries();
  const [Occupancy_and_category_cross, setOccupancy_and_category_cross] =
    useState([]);
  const { userAgent } = GetAllUsers();
  const { ProfileValue } = GetProfile();
  const [categoryData, setCategoryData] = useState([]);
  const [rowData, setRowData] = useState({});
  const { DMCsValue } = GetAllDMCs();
  const { CorporatesValue } = GetAllCorporates();
  const timestamp = new Date().toLocaleDateString();
  const minDate = new Date(timestamp);
  const [activeItem, setActiveItem] = useState(0);
  const [activeItemDist, setActiveItemDist] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [checkedCountries, setCheckedCountries] = useState([]);

  const handleRegionChange = (value) => {
    setSelectedRegion(value);
    const countries =
      regionCountries.find((item) => item.region === value)?.countries || [];
    setSelectedCountries(countries);
    setCheckedCountries([]); // Reset checked countries when the region changes
  };
  const [showRegionPopUp, setShowRegionPopUp] = useState(false);
  const handleCancel = () => {
    setShowRegionPopUp(false);
  };

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
    VAT: parsedRecord?.VAT || "",
  });
  const initialData = {
    is_room: false,
    is_meals: false,
    is_supp: false,
    is_non_refundable: false,
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
    VAT,
  } = formDataHeader;

  const {
    room_id_0_if_All,
    is_non_refundable,
    offer,
    desc,
    minStayOffer,
    ArOrSt,
    ArOrStCanc,
    price_type,
    remark,
    ArOrStSupp,
    room_category_id,
    stay_from,
    stay_to,
    booking_window_from,
    booking_window_to,
    discount_amount,
    discount_rate,
    source_country,
    linkedId,
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
    validity,
    supplement,
    price_adult,
    price_child,
    mandatory,
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

  const handleSelectChange = (value) => {
    setDiscountType(value);
  };

  const onSubmitHeader = async (e) => {
    e.preventDefault();
    if (!name || !currency || !country || !city || !hotel_id || !base_meal)
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
            bMeal: ${base_meal}
            VAT: ${VAT}
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
        message.error(res.data.addSCHead?.message || res.errors[0].message);
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
        rId: item.id,
        sgl: parseFloat(formData.sgl[index]) || -1,
        dbl: parseFloat(formData.dbl[index]) || -1,
        twn: parseFloat(formData.twn[index]) || -1,
        trl: parseFloat(formData.trl[index]) || -1,
        qud: parseFloat(formData.qud[index]) || -1,
        unit: parseFloat(formData.unit[index]) || -1,
        minS: parseFloat(formData.min_stay[index]) || -1,
        maxS: parseFloat(formData.max_stay[index]) || -1,
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
      addPSC(
        cid: ${id_from_contract_id},
        from: "${price_from_date}",
        to: "${price_to_date}",
        rows: ${JSON.stringify(numericPricesArray).replace(
          /"([^"]+)":/g,
          "$1:"
        )}
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
      if (res.data.addPSC?.message === "success") {
        message.success(res.data.addPSC?.message);
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.data?.addPSC?.message || res.errors[0].message);
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
      addMSC(
        cid: ${id_from_contract_id}
         from :"${meals_from_date}",  to:"${meals_to_date}", roA:${room_only_adult},
            caFrom: ${child_age_from}
            caT: ${child_age_to}
          roC:${room_only_child || ""}, bA:${breakfast_adult || ""}, bC:${
      breakfast_child || ""
    }, 
          hbA:${hb_adult || ""},  hbC:${hb_child || ""}, fbA:${
      fb_adult || ""
    }, fbC:${fb_child || ""}, 
          saiA:${soft_all_inc_adult || ""}, saiC:${
      soft_all_inc_child || ""
    }, aiA:${all_inc_adult || ""}, 
          aiC:${all_inc_child || ""}, uaiA:${ultra_all_inc_adult || ""}, uaiC:${
      ultra_all_inc_child || ""
    },
          
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
      if (res.data.addMSC?.message === "success") {
        message.success(res.data.addMSC?.message);
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.data.addMSC?.message);
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
      addOSC(
        cid: ${id_from_contract_id}
           ofr: ${offer}, rId_0_All :${room_category_id},  sfrom: "${offer_stay_from}",  sto: "${offer_stay_to}", 
           bwfrom: "${booking_window_from}",  bwto: "${booking_window_to}",  
           dAOrR : ${discountType === "amount" ? "amnt" : "rate"},  
           disc: ${discountType === "amount" ? discount_amount : discount_rate}
           Scountries: ${JSON.stringify(
             source_country?.length > 0
               ? source_country.map((item) => ({
                   country_0_All: item,
                 }))
               : "Scountries: 0"
           ).replace(
             /"([^"]+)":/g,
             "$1:"
           )},  minStay: ${minStayOffer}, ArOrSt : ${ArOrSt}
           linkId : ${linkedId || ""}, room   : ${is_room}, meals: ${is_meals}, 
          supp: ${is_supp},  order : ${order} desc: "${desc || ""}"
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
      if (res.data.addOSC?.message === "success") {
        message.success(res.data.addOSC?.message);
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.data.addOSC?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };
  const onSubmitSupp = async (e) => {
    e.preventDefault();
    if (!validity || !supplement || !id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      addSSC(
        cid: ${id_from_contract_id}
          vali :${validity}, supp :${supplement}, type : ${supp_type}, rId_0_All:${supp_room_category_id},  
          sfrom:"${stay_from}", sto:"${stay_to}",pAmn: ${price_type}
               PAa :${price_type === "true" ? price_adult : -1}, PCa : ${
      price_type === "true" ? price_child : -1
    },  
          PAr : ${price_type === "false" ? price_adult : -1},  PCr :  ${
      price_type === "false" ? price_child : -1
    },  ArOrSt: ${ArOrStSupp}
        cafrom : ${supp_child_age_from || ""}, cato : ${
      supp_child_age_to || ""
    } mand: ${mandatory}, rmrk: "${remark}"
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
      if (res.data.addSSC?.message === "success") {
        message.success(res.data.addSSC?.addSSC);
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.data.addSSC?.addSSC);
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
      addCSC(
        cid: ${id_from_contract_id}
        cPlcy: "${booking_policy}"  
        rId_0_All:${room_id_0_if_All} 
        from : "${date_from}",  to : "${date_to}",  type : ${type}, 
        cDays  : ${cancellation_days || -1},  cPRte : ${
      cancellation_panelty_rate || -1
    } ArOrSt: ${ArOrStCanc}
          nRef: ${is_non_refundable || false}
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
      if (res.data.addCSC?.message === "success") {
        message.success(res.data.addCSC?.message);
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error(res.data.addCSC?.message);
      }
    } catch (error) {
      message.error("Failed to Add Contract, Please check and try again");
    }
  };

  const DeletRegion = async (rgnId) => {
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      deleteRGNS(id: ${
        regionCountries.find((item) => item.region === rgnId)?.id || ""
      }) {
        message
    }}
  `;
    const path = "";
    try {
      const res = await POST_API(
        path,
        JSON.stringify({ query: mutation }),
        headers
      );
      if (res.data.deleteRGNS?.message === "success") {
        message.success(res.data.deleteRGNS?.message);
        getRegionsWithCountries();
        setSelectedRegion([]);
        setSelectedCountries([]);
        setCheckedCountries([]);
      } else {
        message.error(res.errors[0]?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmit = async () => {
    if (!id_from_contract_id) {
      message.error("Please fill in all required fields.");
      return;
    }
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
    mutation {
      ${
        activeItemDist === 0
          ? "addDisDMCsSC"
          : activeItemDist === 1
          ? "addDisCpsSC"
          : activeItemDist === 2
          ? "addDisAgsSC"
          : activeItemDist === 3
          ? "addDisCSC"
          : null
      }(
        cid: ${id_from_contract_id}          
       ${
         activeItemDist === 3
           ? `countries: ${JSON.stringify(
               checkedCountries?.length > 0
                 ? checkedCountries?.map((item) => ({
                     country_0_All: item,
                   }))
                 : "country_0_All: 0"
             ).replace(/"([^"]+)":/g, "$1:")}`
           : ""
       }       
        ${
          activeItemDist === 0
            ? `dIds: ${JSON.stringify(
                dmc_id_0_if_all?.length > 0
                  ? dmc_id_0_if_all.map((item) => ({
                      id_0_All: item,
                    }))
                  : "id_0_All: 0"
              ).replace(/"([^"]+)":/g, "$1:")}`
            : activeItemDist === 1
            ? `cpIds: ${JSON.stringify(
                corporates_id_0_if_all?.length > 0
                  ? corporates_id_0_if_all?.map((item) => ({
                      id_0_All: item,
                    }))
                  : "id_0_All: 0"
              ).replace(/"([^"]+)":/g, "$1:")}`
            : activeItemDist === 2
            ? `agIds: ${JSON.stringify(
                agent_id_0_if_all?.length > 0
                  ? agent_id_0_if_all?.map((item) => ({
                      id_0_All: item,
                    }))
                  : "id_0_All: 0"
              ).replace(/"([^"]+)":/g, "$1:")}`
            : activeItemDist === 3
            ? `rIds: { id: ${
                regionCountries.find((item) => item.region === selectedRegion)
                  ?.id || ""
              } }`
            : null
        }
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
      if (res.data) {
        message.success("Success");
        getAllContractData();
        setFormData(initialData);
      } else {
        message.error("fail");
      }
    } catch (error) {
      message.error("Failed");
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
  const distributionItems = ["DMCs", "corporate", "agent", "country"];
  const handleItemClick = (index) => {
    setActiveItem(index);
  };
  const handleItemClickDistribution = (index) => {
    setActiveItemDist(index);
  };
  useEffect(() => {
    getRegionsWithCountries();
    const hotelRooms =
      hotelValue.find((item) => item?.id === hotel_id)?.rooms || [];
    // console.log(hotelRooms);

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
      const category_id = category?.id;

      ["SGL", "DBL", "TWN", "TRPL", "QUAD", "UNIT"].forEach((occupancyType) => {
        if (room[occupancyType]) {
          const occupancy = `${occupancyType}`;
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
      category_id: category?.id,
      array_of_occupancies: occupancyAndCategory
        .filter((item) => item?.category_id === category?.id)
        .map((item) => item.occupancy),
    }));

    setOccupancy_and_category_cross(sortedOccupancyData);

    setCategoryData(filteredCategoryData);
  }, [hotel_id, hotelValue, id_from_contract_id, rowData]);

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
            allowClear={false}
            className="w-[120px]"
            format={formatDate}
            value={price_from_date ? dayjs(price_from_date) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              setFormData((prev) => ({ ...prev, price_from_date: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            allowClear={false}
            className="w-[120px]"
            format={formatDate}
            value={price_to_date ? dayjs(price_to_date) : null}
            disabledDate={(current) =>
              current && current < new Date(price_from_date)
            }
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
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
              key={item?.id}
            >
              {item.name}
            </span>
          ))}
        </span>
      ),
      SGL: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("sgl", "SGL")}
        </span>
      ),
      DBL: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("dbl", "DBL")}
        </span>
      ),
      TWN: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("twn", "TWN")}
        </span>
      ),
      TRPL: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("trl", "TRPL")}
        </span>
      ),
      QUAD: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("qud", "QUD")}
        </span>
      ),
      unit: (
        <span className="gap-y-2 flex flex-col">
          {renderInputs_for_occupancy("unit", "UNIT")}
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
            allowClear={false}
            format={formatDate}
            value={meals_from_date ? dayjs(meals_from_date) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            bordered={false}
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              setFormData((prev) => ({ ...prev, meals_from_date: isoString }));
            }}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            allowClear={false}
            format={formatDate}
            value={meals_to_date ? dayjs(meals_to_date) : null}
            disabledDate={(current) =>
              current && current < new Date(meals_from_date)
            }
            placeholder="To Date:"
            bordered={false}
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
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
      childage: (
        <span className="gap-y-2 ">
          <label className="labelStyle">From</label>
          <Input
            className="w-[70px] h-[25px]"
            value={child_age_from}
            name="child_age_from"
            onChange={onChange}
            max={17}
            min={0}
            type="number"
          />
          <label className="labelStyle">To</label>
          <Input
            value={child_age_to}
            name="child_age_to"
            onChange={onChange}
            className="w-[70px] h-[25px]"
            max={17}
            min={0}
            type="number"
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

  const {
    mealsData,
    OffersData,
    supplementsData,
    cancellationData,
    priceData,
    priceMarkupData,
    distAg,
    distCp,
    distDMCs,
    distCnR,
    loading,
    roomSetupData,
    getAllContractData,
    compressData,
    rawPriceData,
    showModalFunction,
  } = GetAllContracts(
    id_from_contract_id,
    rowData,
    hotel_id,
    Occupancy_and_category_cross,
    hotelValue
  );

  const offersDataSource = [
    {
      key: "offersdata",
      timestamp: (
        <span className="whitespace-nowrap">{formatDate(timestamp)}</span>
      ),
      offer: (
        <span>
          <Input
            name="desc"
            value={desc}
            onChange={onChange}
            className="mb-1"
          />
          <Select
            value={offer}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, offer: value }))
            }
            options={[
              { value: "geo_ofr", label: "geo offer" },
              { value: "lst_min", label: "last minute" },
              { value: "n_ref", label: "n ref" },
              { value: "erly_brd", label: "erly brd" },
              { value: "min_night", label: "minimum night" },
            ]}
            className="w-[130px]"
          />
        </span>
      ),
      roomcategory: (
        <Select
          value={room_category_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, room_category_id: value }))
          }
          options={[
            { value: -1, label: "Undefined" },
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
            allowClear={false}
            format={formatDate}
            value={offer_stay_from ? dayjs(offer_stay_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              setFormData((prev) => ({ ...prev, offer_stay_from: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            allowClear={false}
            format={formatDate}
            value={offer_stay_to ? dayjs(offer_stay_to) : null}
            disabledDate={(current) =>
              current && current < new Date(offer_stay_from)
            }
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
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
            allowClear={false}
            format={formatDate}
            value={booking_window_from ? dayjs(booking_window_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              setFormData((prev) => ({
                ...prev,
                booking_window_from: isoString,
              }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            allowClear={false}
            format={formatDate}
            value={booking_window_to ? dayjs(booking_window_to) : null}
            disabledDate={(current) =>
              current && current < new Date(booking_window_from)
            }
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discount_amount: e.target.value,
                  discount_rate: "",
                }))
              }
              onKeyPress={handleKeyPress}
            />
          )}
          {discountType === "percentage" && (
            <Input
              className="w-[100px]"
              value={discount_rate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discount_rate: e.target.value,
                  discount_amount: "",
                }))
              }
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
        <Select
          className="w-[70px]"
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              linkedId: value,
            }))
          }
          options={OffersData?.map((item) => ({
            value: item.id,
            label: item.id,
          }))}
          value={linkedId}
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
          ]}
          className="w-[52px]"
        />
      ),
      ArOrSt: (
        <Select
          value={ArOrSt}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, ArOrSt: value }))
          }
          options={[
            { value: "arri", label: "Arrival" },
            { value: "stay", label: "Stay" },
          ]}
          className="w-[75px]"
        />
      ),
      minStay: (
        <Input
          name="minStayOffer"
          value={minStayOffer}
          className="w-[70px]"
          onKeyPress={handleKeyPress}
          onChange={onChange}
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
      validity: (
        <Select
          value={validity}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, validity: value }))
          }
          options={[
            { value: "per_day", label: "Per day" },
            { value: "per_stay", label: "Per stay" },
            { value: "per_item", label: "per item" },
          ]}
          className="w-[100px] h-[25px]"
        />
      ),
      supplement: (
        <Select
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, supplement: value }))
          }
          options={[
            { value: "s_bed", label: "shared bed" },
            { value: "e_bed", label: "extra bed" },
            { value: "ear_cin", label: "Earl Check-in" },
            { value: " late_cout", label: "Late Check-out" },
            { value: "gala_dinr", label: "Gala Dinner" },
            { value: "wifi", label: "WIFI" },
            { value: "airportT", label: "Airport Transfer" },
            { value: "speedboat", label: "Speed Boat" },
            { value: "seaPlne", label: "Seaplane" },
            { value: "DomFlight", label: " Domestic Flight" },
            { value: "AirCond", label: "Air Condition" },
            { value: "other", label: "Other" },
          ]}
          className="w-[150px] h-[25px]"
        />
      ),
      type: (
        <Select
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, supp_type: value }))
          }
          options={[
            { value: "per_person", label: "Per Person" },
            { value: "per_booking", label: "Per Booking" },
            { value: "per_room", label: "Per Room" },
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
            allowClear={false}
            format={formatDate}
            value={stay_from ? dayjs(stay_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              setFormData((prev) => ({ ...prev, stay_from: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            allowClear={false}
            format={formatDate}
            value={stay_to ? dayjs(stay_to) : null}
            disabledDate={(current) => current && current < new Date(stay_from)}
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              setFormData((prev) => ({ ...prev, stay_to: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
      ),
      price_type: (
        <Select
          value={price_type}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, price_type: value }))
          }
          options={[
            { value: "true", label: "Amount" },
            { value: "false", label: "Rate" },
          ]}
          className="w-[100px] h-[25px]"
        />
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
      mandatory: (
        <Select
          value={mandatory}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, mandatory: value }))
          }
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
          className="w-[75px] h-[25px]"
        />
      ),
      ArOrSt: (
        <Select
          value={ArOrStSupp}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, ArOrStSupp: value }))
          }
          options={[
            { value: "arri", label: "Arrival" },
            { value: "stay", label: "Stay" },
          ]}
          className="w-[75px] h-[25px]"
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
      remark: (
        <TextArea
          style={{ height: 100, minWidth: 150 }}
          value={remark}
          name="remark"
          onChange={onChange}
        />
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
            allowClear={false}
            format={formatDate}
            value={date_from ? dayjs(date_from) : null}
            disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
              console.log(isoString);
              setFormData((prev) => ({ ...prev, date_from: isoString }));
            }}
            bordered={false}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            allowClear={false}
            format={formatDate}
            value={date_to ? dayjs(date_to) : null}
            disabledDate={(current) => current && current < new Date(date_from)}
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const isoString = value
                ? dayjs(value).format("YYYY-MM-DD")
                : null;
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
            { value: "one_night", label: "one night" },
            { value: "full_stay", label: "full stay" },
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
        />
      ),
      ArOrSt: (
        <Select
          value={ArOrStCanc}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, ArOrStCanc: value }))
          }
          options={[
            { value: "arri", label: "Arrival" },
            { value: "stay", label: "Stay" },
          ]}
          className="w-[75px] h-[25px]"
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
      : activeItem === 7
      ? markupColumns
      : null;

  const distColumn =
    activeItemDist === 0
      ? DMCColumns
      : activeItemDist === 1
      ? corporateColumns
      : activeItemDist === 2
      ? agentColumns
      : activeItemDist === 3
      ? countryColumns
      : "";

  const distDataSource =
    activeItemDist === 0
      ? distDMCs
      : activeItemDist === 1
      ? distCp
      : activeItemDist === 2
      ? distAg
      : activeItemDist === 3
      ? distCnR
      : [];

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
    <section className="w-full mb-5 space-y-2 capitalize">
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
                className=" inputfildinsearch-bg w-[170px]"
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
                className=" inputfildinsearch-bg w-[170px]"
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
              className=" inputfildinsearch"
            />
          </label>
          <label className="labelStyle">duration(from-to)</label>
          <span className="flex gap-3">
            <Input
              readOnly
              placeholder="From Date"
              value={from_date ? formatDate(from_date) : ""}
              className="inputfildinsearch  w-[170px]"
            />
            <Input
              readOnly
              placeholder="To Date"
              value={to_date ? formatDate(to_date) : ""}
              className="inputfildinsearch  w-[170px]"
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
              className=" inputfildinsearch"
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
              className=" inputfildinsearch"
              placeholder="Status"
            />
          </label>
          <label className="labelStyle">
            base meal
            <Select
              className=" inputfildinsearch"
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
                { value: "SOFT_ALL_INC", label: "SOFT ALL INC" },
                { value: "ALL_INC", label: "ALL INC" },
                { value: "ULTRA_ALL_INC", label: "ULTRA ALL INC" },
              ]}
            />
          </label>
          <label className="labelStyle">
            contract ID
            <Input
              className="inputfildinsearch"
              onKeyPress={handleKeyPress}
              placeholder="Contract ID"
              value={id_from_contract_id}
              name="id_from_contract_id"
              onChange={onChange}
              readOnly
            />
          </label>
        </span>
      </div>
      <div className="w-full flex justify-between items-end">
        <label className="labelStyle">
          VAT
          <Input
            className="inputfildinsearch w-[170px]"
            onKeyPress={handleKeyPress}
            value={VAT}
            name="VAT"
            onChange={onChange}
          />
        </label>
        {id_from_contract_id || ProfileValue.lev === 1 ? null : (
          <Button onClick={onSubmitHeader} className="button-bar">
            Save
          </Button>
        )}
      </div>
      <div>
        <ul className="list-none tab-btn  flex justify-between max-w-4xl mt-5">
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
      </div>
      <div className="w-full">
        <div>
          {activeItem === 6 ? (
            <div className="flex gap-5 w-full">
              <ul className="list-none border border-black/20 rounded-3xl text-[#A6A6A6]  flex text-center flex-col max-w-4xl my-6 h-full">
                {distributionItems.map((item, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer capitalize m-6 w-[140px]${
                      activeItemDist === index ? " button-bar" : ""
                    }`}
                    onClick={() => handleItemClickDistribution(index)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="border border-black/20 w-full p-4 rounded-3xl">
                <div className="flex m-2 justify-between rounded-3xl">
                  <span className="flex flex-col">
                    <label className="labelStyle">
                      {activeItemDist === 0
                        ? "Select DMC"
                        : activeItemDist === 1
                        ? "Select Corporate"
                        : activeItemDist === 2
                        ? "Select Agent"
                        : activeItemDist === 3
                        ? "Select Region"
                        : ""}
                    </label>

                    {activeItemDist === 0 && (
                      <Select
                        mode={dmc_id_0_if_all?.includes(0) ? null : "multiple"}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label.toLowerCase() ?? "").includes(
                            input.toLowerCase()
                          )
                        }
                        className="min-w-[130px]"
                        options={[
                          { value: 0, label: "All" },
                          ...DMCsValue.map((item) => ({
                            value: item.id ? item.id : "",
                            label: item.name ? item.name : "",
                          })),
                        ]}
                        onChange={(value) => {
                          const selectedValues = Array.isArray(value)
                            ? value
                            : [value];
                          setFormData((prevData) => ({
                            ...prevData,
                            dmc_id_0_if_all: selectedValues.map(Number),
                          }));
                        }}
                      />
                    )}
                    {activeItemDist === 1 && (
                      <Select
                        mode={
                          corporates_id_0_if_all?.includes(0)
                            ? null
                            : "multiple"
                        }
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label.toLowerCase() ?? "").includes(
                            input.toLowerCase()
                          )
                        }
                        className="min-w-[130px]"
                        options={[
                          { value: 0, label: "All" },
                          ...CorporatesValue?.map((item) => ({
                            value: item.id ? item.id : "",
                            label: item.name ? item.name : "",
                          })),
                        ]}
                        onChange={(value) => {
                          const selectedValues = Array.isArray(value)
                            ? value
                            : [value];
                          setFormData((prevData) => ({
                            ...prevData,
                            corporates_id_0_if_all: selectedValues,
                          }));
                        }}
                      />
                    )}
                    {activeItemDist === 2 && (
                      <Select
                        mode={
                          agent_id_0_if_all?.includes(0) ? null : "multiple"
                        }
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label.toLowerCase() ?? "").includes(
                            input.toLowerCase()
                          )
                        }
                        className="min-w-[130px]"
                        options={[
                          { value: 0, label: "All" },
                          ...userAgent.map((item) => ({
                            value: item.id ? item.id : "",
                            label: item.uname ? item.uname : "",
                          })),
                        ]}
                        onChange={(value) => {
                          const selectedValues = Array.isArray(value)
                            ? value
                            : [value];
                          setFormData((prevData) => ({
                            ...prevData,
                            agent_id_0_if_all: selectedValues,
                          }));
                        }}
                      />
                    )}
                    {activeItemDist === 3 && (
                      <span className="flex gap-5">
                        <Select
                          showSearch
                          filterOption={(input, option) =>
                            (option?.label.toLowerCase() ?? "").includes(
                              input.toLowerCase()
                            )
                          }
                          className="min-w-[130px]"
                          options={regionCountries.map((item, index) => ({
                            key: index,
                            value: item.region,
                            label: item.region,
                          }))}
                          onChange={handleRegionChange}
                          value={selectedRegion}
                        />
                        <Checkbox.Group
                          className="grid grid-cols-2 capitalize "
                          onChange={(value) => {
                            setCheckedCountries(value);
                          }}
                          value={checkedCountries}
                        >
                          {selectedCountries.map((country) => (
                            <Checkbox key={country} value={country}>
                              {country}
                            </Checkbox>
                          ))}
                        </Checkbox.Group>
                        {selectedCountries.length > 0 && (
                          <Popconfirm
                            title={`Delete the ${selectedRegion}`}
                            description={`Are you sure to delete ${selectedRegion}?`}
                            onConfirm={() => DeletRegion(selectedRegion)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <BiTrash className="text-xl cursor-pointer" />
                          </Popconfirm>
                        )}
                      </span>
                    )}
                  </span>
                  <span className="flex flex-col gap-3">
                    <Button className="action-btn" onClick={onSubmit}>
                      {activeItemDist === 0
                        ? " Add DMC"
                        : activeItemDist === 1
                        ? "Add Corporate"
                        : activeItemDist === 2
                        ? "Add Agent"
                        : activeItemDist === 3
                        ? "Add Country"
                        : ""}
                    </Button>

                    {activeItemDist === 3 && (
                      <Button
                        className="action-btn"
                        onClick={() => setShowRegionPopUp(true)}
                      >
                        Add Region
                      </Button>
                    )}
                  </span>
                  <Modal
                    footer={false}
                    open={showRegionPopUp}
                    onOk={handleCancel}
                    onCancel={handleCancel}
                  >
                    <AddRegion
                      getRegionsWithCountries={getRegionsWithCountries}
                      handleCancel={handleCancel}
                    />
                  </Modal>
                </div>
                <Table
                  columns={distColumn}
                  dataSource={distDataSource}
                  loading={loading}
                  onRow={(record) => {
                    return {
                      onClick: () => {
                        setRowData(record);
                      },
                    };
                  }}
                />
              </div>
            </div>
          ) : activeItem === 8 ? (
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
            <span>
              {activeItem === 7 && (
                <MarkupSC
                  id={id_from_contract_id}
                  getAllContractData={getAllContractData}
                />
              )}
              <br />
              {showModalFunction()}
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
            </span>
          )}
        </div>
      </div>
      <div></div>
    </section>
  );
};

export default StaticContract;
