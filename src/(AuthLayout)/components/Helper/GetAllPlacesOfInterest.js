import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllPlacesOfInterest = () => {
  const [placeOfInterestValue, setPlaceOfInterestValue] = useState([]);

  const getAllPlaces = async () => {
    const GET_ALL_CATEGORIES = `{
        get_all_places_of_interest {
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
      if (Array.isArray(res.data.get_all_places_of_interest)) {
        const dataArray = res.data.get_all_places_of_interest;
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
