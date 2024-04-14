import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllDMCsOfHotel = (hotel_id) => {
  const [DMCsOfHotelValue, setDMCsOfHotelValue] = useState([]);

  const getAllDMC = async () => {
    const GET_ALL = `{
        get_dmcs_of_a_hotel(hotel_id: ${hotel_id}) {
            id
            dmc {
                id
                name
            }
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data.get_dmcs_of_a_hotel) {
        const dataArray = res.data.get_dmcs_of_a_hotel;
        setDMCsOfHotelValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllDMC();
  }, [hotel_id]);

  return { DMCsOfHotelValue };
};

export default GetAllDMCsOfHotel;
