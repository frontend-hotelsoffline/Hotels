import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllPricingMarkUp = () => {
  const [MarkUpValue, setMarkUpValue] = useState([]);

  const getAllPricingMarkup = async () => {
    const GET_ALL = `{
        getmarkups {
            id
            CRT
            name
            markup
        }
    }`;
    const query = GET_ALL;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.getmarkups)) {
        const dataArray = res.data.getmarkups;
        setMarkUpValue(dataArray);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllPricingMarkup();
  }, []);

  return { MarkUpValue };
};

export default GetAllPricingMarkUp;
