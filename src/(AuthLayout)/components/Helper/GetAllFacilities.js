import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllFacilities = () => {
  const [facilityValue, setfacilityValue] = useState([]);

  const getFacility = async () => {
    const GET_ALL = `{
      get_all_Facilities {
        id
        name
        description
      }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_Facilities)) {
        const dataArray = res.data.get_all_Facilities;
        setfacilityValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFacility();
  }, []);

  return { facilityValue, getFacility };
};

export default GetAllFacilities;
