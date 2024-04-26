import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllAmenities = () => {
  const [amenityValue, setamenityValue] = useState([]);

  const getAllAmenity = async () => {
    const GET_ALL = `{
      getAmenities {
        id
        name
      }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.getAmenities)) {
        const dataArray = res.data.getAmenities;
        setamenityValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllAmenity();
  }, []);

  return { amenityValue, getAllAmenity };
};

export default GetAllAmenities;
