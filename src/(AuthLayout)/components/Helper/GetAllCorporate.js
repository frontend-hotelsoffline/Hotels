import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllCorporates = () => {
  const [CorporatesValue, setCorporatesValue] = useState([]);
  const [loading, setLoading] = useState(false)

  const getAllCorporate = async () => {
    const GET_ALL = `{
        get_all_corporates {
            id
            name
            status
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
        setLoading(true)
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.get_all_corporates)) {
        const dataArray = res.data.get_all_corporates;
        setCorporatesValue(dataArray);
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCorporate();
  }, []);

  return { CorporatesValue, loading, getAllCorporate };
};

export default GetAllCorporates;
