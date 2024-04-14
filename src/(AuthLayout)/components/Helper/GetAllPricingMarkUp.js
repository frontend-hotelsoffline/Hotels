import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllPricingMarkUp = () => {
  const [MarkUpValue, setMarkUpValue] = useState([]);

  const getAllPricingMarkup = async () => {
    const GET_ALL = `{
        get_all_pricing_markups {
            id
            createdAt
            name
            markup
        }
    }`;
    const query = GET_ALL;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.get_all_pricing_markups)) {
        const dataArray = res.data.get_all_pricing_markups;
        setMarkUpValue(dataArray);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getAllPricingMarkup();
  }, []);

  return { MarkUpValue };
};

export default GetAllPricingMarkUp;
