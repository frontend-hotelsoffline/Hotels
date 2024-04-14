import { Button, DatePicker, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { POST_API } from "../../components/API/PostAPI";
import { formatDate } from "../../components/Helper/FormatDate";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import GetAllHotels from "../../components/Helper/GetAllHotels";

const CalendarDetails = ({
  allotmentData,
  pricesOverride,
  id,
  handleCancel,
  getAllContractData,
  hotel_id
}) => {
  const [formData, setFormData] = useState({});
  const [overrideData, setOverrideData] = useState([]);
  const [catIndex, setCatIndex] = useState(0)
  const [Occupancy_and_category_cross, setOccupancy_and_category_cross] = useState([]);
  const { hotelValue } = GetAllHotels();
  const initialData = {
    from_date: new Date(allotmentData?.clickedDate).toISOString() || null,
    to_date: new Date(allotmentData?.clickedDate).toISOString() || null,
    clickedDate: allotmentData?.clickedDate ?? null,
    category_id: Number(allotmentData?.room?.id) || "",
    allotment:
      allotmentData?.allotment == 0 ? 0 : allotmentData?.allotment || "",
    rel: allotmentData?.rel == 0 ? 0 : allotmentData?.rel || "",
    sgl:
      overrideData?.sgl == 0 ? 0 : overrideData?.sgl > 0 ? overrideData?.sgl : "",
    dbl: overrideData?.dbl == 0 ? 0 : overrideData?.dbl > 0 ? overrideData?.dbl : "",
    unit: overrideData?.unit == 0 ? 0 :overrideData?.unit > 0 ? overrideData?.unit : "",
    qud: overrideData?.quad == 0 ? 0 : overrideData?.quad > 0 ? overrideData?.quad : "",
    trl: overrideData?.trl == 0 ? 0 : overrideData?.trl > 0 ? overrideData?.trl : "",
    twn: overrideData?.twn == 0 ? 0 : overrideData?.twn > 0 ? overrideData?.twn : "",
    min_stay: overrideData?.min_stay == 0 ? 0 : overrideData?.min_stay > 0 ? overrideData?.min_stay : "",
    max_stay: overrideData?.max_stay == 0 ? 0 : overrideData?.max_stay > 0 ? overrideData?.max_stay : "",
  };
 
  const {
    from_date,
    to_date,
    category_id,
    allotment,
    sgl,
    dbl,
    rel,
    unit,
    qud,
    trl,
    twn,
    min_stay,
    max_stay,
  } = formData;

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
        create_a_static_contract_body_allotment_n_rel(
          id_from_contracts: ${id}
          from_date: "${from_date}"
          to_date: "${to_date}"
          room_id: ${category_id}
          allotment: ${allotment}
          rel: ${rel}
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
      if (res && !res.errors) {
        message.success("Successful");
        getAllContractData();
        handleCancel();
        setFormData({});
      } else {
        message.error(res?.errors?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  const onSubmitOverride = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };
    const mutation = `
      mutation {
        create_a_static_contract_body_price_overrids_of_cntct(
          id_from_contracts: ${id}
          from_date: "${from_date}"
          to_date: "${to_date}"
          room_id: ${category_id}
          sgl: ${sgl || 0}
          dbl: ${dbl || 0}
          twn: ${twn || 0}
          trl: ${trl || 0}
          qud: ${qud || 0}
          unit: ${unit || 0}
          min_stay: ${min_stay || 0}
          max_stay: ${max_stay || 0}
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
      if (res && !res.errors) {
        message.success("Successful");
        getAllContractData();
        handleCancel();
        setFormData({});
      } else {
        message.error(res?.errors?.message);
      }
    } catch (error) {
      message.error("Failed");
    }
  };

  useEffect(() => {
    setFormData(initialData);
    let pricesOverrideCategory;

    pricesOverride &&
      category_id &&
      pricesOverride.forEach((item) => {
        console.log(new Date(from_date))
        if (new Date(item.from_date).getDay() == new Date(from_date).getDay()) {
          pricesOverrideCategory = item;
        }else if (new Date(item.from_date) <= new Date(from_date)) {
          pricesOverrideCategory = item;
          
        } else {
          null
        }
      });

    setOverrideData(pricesOverrideCategory);

    
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
        
        ["SGL", "DBL", "TWN", "TRPL", "QUAD", "UNIT"].forEach(occupancyType => {
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
          .filter(item => item.category_id === category.id)
          .map(item => item.occupancy),
        }));
        
        setOccupancy_and_category_cross(sortedOccupancyData);

        const CategoryIndex = filteredCategoryData.findIndex(item => item.id == category_id)
        setCatIndex(CategoryIndex !== -1 ? CategoryIndex : -1);
  
  }, [allotmentData, overrideData, getAllContractData, hotelValue, hotel_id, catIndex, category_id, from_date]);


  return (
    <div className="p-5 relative mb-10">
      <div className="relative">
        <h1 className="title mb-4">Availability Calendar details</h1>
        <span className="uppercase flex w-full justify-between">
          <DatePicker
            format={formatDate}
            value={from_date ? dayjs(from_date) : null}
            // disabledDate={(current) => current && current < minDate}
            placeholder="From Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, from_date: isoString }));
            }}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
          <DatePicker
            format={formatDate}
            value={to_date ? dayjs(to_date) : null}
            // disabledDate={(current) => current && current < new Date(from_date)}
            placeholder="To Date:"
            onChange={(value, dateString) => {
              const dateObject = new Date(dateString ? dateString : null);
              const isoString = dateObject.toISOString();
              setFormData((prev) => ({ ...prev, to_date: isoString }));
            }}
            suffixIcon={<CalendarOutlined style={{ color: "black" }} />}
          />
        </span>
        <label className="labelStyle mt-2">Room</label>
        <Input value={allotmentData?.room?.name} readOnly className="w-full" />
        <span className="flex mt-2 gap-4">
          <label className="labelStyle">
            Allotment
            <Input
              name="allotment"
              value={allotment}
              onChange={onChange}
              className="w-full border-black"
            />
          </label>
          <label className="labelStyle">
            Rel
            <Input
              name="rel"
              value={rel}
              onChange={onChange}
              className="w-full border-black"
            />
          </label>
        </span>
        <Button onClick={onSubmit} className="my-2 list-btn absolute right-0">
          Update
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-14 relative">
        <label className="labelStyle">
          SGL
         { Occupancy_and_category_cross[catIndex]?.array_of_occupancies.includes("is_SGL") ? <Input
            onChange={onChange}
            value={sgl}
            name="sgl" className="w-full"
          /> : <Input readOnly className="bg-[#eee] w-full" />}
        </label>
        <label className="labelStyle">
          TWN
          { Occupancy_and_category_cross[catIndex]?.array_of_occupancies.includes("is_TWN") ?  <Input
            onChange={onChange}
            value={twn}
            name="twn"
            className="w-full"
          />: <Input readOnly className="bg-[#eee] w-full" />}
        </label>
        <label className="labelStyle">
          QUAD
          { Occupancy_and_category_cross[catIndex]?.array_of_occupancies.includes("is_QUAD") ?   <Input
            onChange={onChange}
            value={qud}
            name="qud"
            className="w-full"
          /> : <Input readOnly className="bg-[#eee] w-full" />}
        </label>
        <label className="labelStyle">
          min stay
          <Input
            onChange={onChange}
            value={min_stay}
            name="min_stay"
            className="w-full"
          />
        </label>
        <label className="labelStyle">
          DBL
          { Occupancy_and_category_cross[catIndex]?.array_of_occupancies.includes("is_DBL") ?  <Input
            onChange={onChange}
            value={dbl}
            name="dbl"
            className="w-full"
          />: <Input readOnly className="bg-[#eee] w-full" />}
        </label>
        <label className="labelStyle">
          TRPL
          { Occupancy_and_category_cross[catIndex]?.array_of_occupancies.includes("is_TRPL") ?  <Input
            onChange={onChange}
            value={trl}
            name="trl"
            className="w-full"
          />: <Input readOnly className="bg-[#eee] w-full" />}
        </label>
        <label className="labelStyle">
          unit
          { Occupancy_and_category_cross[catIndex]?.array_of_occupancies.includes("is_UNIT") ?  <Input
            onChange={onChange}
            value={unit}
            name="unit"
            className="w-full"
          />: <Input readOnly className="bg-[#eee] w-full" />}
        </label>
        <label className="labelStyle">
          max stay
          <Input
            onChange={onChange}
            value={max_stay}
            name="max_stay"
            className="w-full"
          />
        </label>
      </div>
      <Button
        onClick={onSubmitOverride}
        className="list-btn absolute right-5 -bottom-8"
      >
        Update
      </Button>
    </div>
  );
};

export default CalendarDetails;
