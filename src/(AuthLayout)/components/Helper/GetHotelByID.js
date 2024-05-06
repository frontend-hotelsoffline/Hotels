import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetHotelByID = (hotel_id) => {
  const [HotelByIDValue, setHotelByIDValue] = useState([]);

  const getAllDMC = async () => {
    const GET_ALL = `{
      gethotel(id: ${hotel_id}) {
            id
           name
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data.get_a_hotel_by_id) {
        const dataArray = res.data.get_a_hotel_by_id;
        setHotelByIDValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllDMC();
  }, [hotel_id]);

  return { HotelByIDValue };
};

export default GetHotelByID;
