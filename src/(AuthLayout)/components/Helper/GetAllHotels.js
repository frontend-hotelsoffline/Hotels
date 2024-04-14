import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllHotels = () => {
  const [hotelValue, sethotelValue] = useState([]);
  const selectedDate = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  var date_to_pass = selectedDate.toISOString();

  const getAllCategories = async () => {
    const GET_ALL = `{
      get_all_hotels {
        id
        createdAt
        google_place_id
        name
        country
        city
        street
        latitude
        longtude
        description
        star_rating
        hotel_status
        phone_no
        email
        giataId
        Live_dynamic_contracts {
          id
          name
      }
      Live_static_contracts {
          id
          name
          meals_of_contract(frontend_timezone_to_cal_date_range : "${date_to_pass}") {
            id
            room_only_adult
            room_only_child
        }
      }
        rooms {
            id 
            name
            is_SGL
            is_DBL
            is_TWN
            is_TRPL
            is_QUAD
            is_UNIT
            priority
            category {
              id
              name
              description
          }}
    }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_hotels)) {
        const dataArray = res.data.get_all_hotels
        sethotelValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return { hotelValue };
};

export default GetAllHotels;
