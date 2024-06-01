import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllUsers = () => {
  const [ListOfUsers, setListOfUsers] = useState([]);
  const [accManager, setAccManager] = useState([]);
  const [userUnderHotel, setUserUnderHotel] = useState([]);
  const [usersUnderDMC, setUsersUnderDMC] = useState([]);
  const [userAgent, setUserAgent] = useState([]);
  const [userCoop, setUserCoop] = useState([]);

  const getAllUsers = async () => {
    const GET_ALL = `{
      getUsers {
        id
        CRT
        f_log
        uname
        lev
        country
        cID
        name
        phone
        dmcsIfAccMngr {
          id
          name
          status
      }
      hotlsIfAccMngr {
          id
          name
          HotelBody {
            status
        }
      }
      ILSCifAccMngr {
          id
          name
          status
      }
      DLSCifAccMngr {
          id
          name
          status
      }
    }
    }`;
    const query = GET_ALL;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.getUsers)) {
        const dataArray = res.data.getUsers;
        setListOfUsers(dataArray);
        setAccManager(dataArray?.filter((user) => user.lev === 2));
        setUserUnderHotel(dataArray?.filter((user) => user.lev === 6));
        setUsersUnderDMC(dataArray?.filter((user) => user.lev === 4));
        setUserAgent(dataArray?.filter((user) => user.lev === 10));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return {
    ListOfUsers,
    getAllUsers,
    accManager,
    userUnderHotel,
    usersUnderDMC,
    userAgent,
    userCoop,
  };
};

export default GetAllUsers;
