import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllDynamicAndStaticContracts = () => {
  const [contractsValue, setcontractsValue] = useState([]);
  const selectedDate = new Date();
  selectedDate.setHours(0, 0, 0, 0);
  var date_to_pass = selectedDate.toISOString();

  const getAllContracts = async () => {
    const GET_ALL = `{
        get_all_static_n_dynamic_contracts {
            id
            name
            meals_of_contract ( frontend_timezone_to_cal_date_range : "${date_to_pass}" ) {
              id
          }
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.get_all_static_n_dynamic_contracts)) {
        const dataArray = res.data.get_all_static_n_dynamic_contracts
        setcontractsValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllContracts();
  }, []);

  return { contractsValue };
};

export default GetAllDynamicAndStaticContracts;
