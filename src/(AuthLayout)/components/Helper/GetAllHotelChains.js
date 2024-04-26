import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllHotelChains = () => {
  const [hotelChainValue, setroomViewValue] = useState([]);

  const getAllChains = async () => {
    const GET_ALL_CATEGORIES = `{
        get_all_hotel_chains {
            id
            name
        }
    }`;
    const query = GET_ALL_CATEGORIES;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_hotel_chains)) {
        const dataArray = res.data.get_all_hotel_chains.map((item) => ({
          value: item.id ? item.id : "",
          label: item.name ? item.name : "",
        }));
        setroomViewValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllChains();
  }, []);

  return { hotelChainValue, getAllChains };
};

export default GetAllHotelChains;
