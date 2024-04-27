import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllFacilities = () => {
  const [facilityValue, setfacilityValue] = useState([]);

  const getFacility = async () => {
    const GET_ALL = `{
      getfacilities {
        id
        name
      }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.getfacilities)) {
        const dataArray = res.data.getfacilities;
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
