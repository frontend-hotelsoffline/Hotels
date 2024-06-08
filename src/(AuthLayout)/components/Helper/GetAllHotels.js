import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllHotels = () => {
  const [hotelValue, sethotelValue] = useState([]);

  const getAllCategories = async () => {
    const GET_ALL = `{
      getrhotels(page: 1) {
        id
        CRT
        name
        address
        country
        city
        street
        lat
        lon
        categ
        HB {
            c_id
        }
        exp {
            c_id
        }
        jp {
            c_id
        }
        Imgs {
            id
            img_url
        }
        hotlFac {
            id
            hId
            fId
            facs {
                id
                name
            }
        } rooms {
          id
          name
          SGL
          DBL
          TWN
          TRPL
          QUAD
          UNIT
          category {
              id
              name
          }
      }
        HotelBody {
          ac_mngr {
              id
              name
          }
          email
          phone
          desc
          chainId
          status
      }
    }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data?.getrhotels)) {
        const dataArray = res.data?.getrhotels;
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
