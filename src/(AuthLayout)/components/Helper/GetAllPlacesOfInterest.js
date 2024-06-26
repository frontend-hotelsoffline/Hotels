import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllPlacesOfInterest = () => {
  const [placeOfInterestValue, setPlaceOfInterestValue] = useState([]);

  const getAllPlaces = async () => {
    const GET_ALL_CATEGORIES = `{
        getP_interest {
            id
            name
            country
          }
    }`;
    const query = GET_ALL_CATEGORIES;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });
      // console.log('places',res)
      if (Array.isArray(res.data.getP_interest)) {
        const dataArray = res.data.getP_interest;
        setPlaceOfInterestValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPlaces();
  }, []);

  return { placeOfInterestValue, getAllPlaces };
};

export default GetAllPlacesOfInterest;
