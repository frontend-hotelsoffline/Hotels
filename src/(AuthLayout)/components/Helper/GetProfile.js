import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";
import { useNavigate } from "react-router-dom";

const GetProfile = () => {
  const [ProfileValue, setProfileValue] = useState([]);
  const router = useNavigate();

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
      if (res.errors) {
        localStorage.clear("isAuthenticated");
        router("/");
      }
      if (res.data.getMyProfile && !res.errors) {
        const dataArray = res.data.getMyProfile;
        setProfileValue(dataArray);
      } else {
        localStorage.clear("isAuthenticated");
        router("/");
      }
    } catch (error) {
      router("/");
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
