import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllDMCs = () => {
  const [DMCsValue, setDMCsValue] = useState([]);

  const getAllDMC = async () => {
    const GET_ALL = `{
        get_all_dmcs {
            id
            name
            status
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_dmcs)) {
        const dataArray = res.data.get_all_dmcs;
        setDMCsValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllDMC();
  }, []);

  return { DMCsValue };
};

export default GetAllDMCs;
