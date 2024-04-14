import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllAmenities = () => {
  const [amenityValue, setamenityValue] = useState([]);

  const getAllAmenity = async () => {
    const GET_ALL = `{
      get_all_Amenities {
        id
        name
        description
      }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_Amenities)) {
        const dataArray = res.data.get_all_Amenities;
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
