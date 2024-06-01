import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetProfile = () => {
  const [ProfileValue, setProfileValue] = useState([]);

  const getProfile = async () => {
    const GET_ALL = `{
        getMyProfile {
            id
            CRT
            f_log
            uname
            lev
            country
            cID
            name
            phone
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data.getMyProfile) {
        const dataArray = res.data.getMyProfile;
        setProfileValue(dataArray);
      } else {
        localStorage.clear("isAuthenticated");
      }
    } catch (error) {
      localStorage.clear("isAuthenticated");
    }
  };

  useEffect(() => {
    getProfile();
    if (!ProfileValue) {
      getProfile();
    }
  }, []);

  return { ProfileValue };
};

export default GetProfile;
