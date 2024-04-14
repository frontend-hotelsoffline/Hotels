import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllUsers = () => {
  const [ListOfUsers, setListOfUsers] = useState([]);
  const [accManager, setAccManager] = useState([]);
  const [userUnderHotel, setUserUnderHotel] = useState([]);
  const [usersUnderDMC, setUsersUnderDMC] = useState([]);
  const [userAgent, setUserAgent] = useState([])

  const getAllUsers = async () => {
    const GET_ALL = `{
      get_all_users {
        id
        createdAt
        is_first_login_chng_pswd
        uname
        ulevel
        comp_id
        is_blocked
        country
        is_demo_user
        Commission_if_acc_mngr
        hotel_if_usr_under_a_hotel {
            id
            name
            hotel_status
        }
        dmc_if_usr_under_a_dmc {
            id
            name
            status
            email
        }
        corporate_if_usr_under_a_crprte {
            id
            name
            status
        }
        dmcs_if_acc_mngr {
            id
            name
            status
            email
        }
        hotels_if_acc_mngr {
            id
            name
            hotel_status
        }
        indirect_static_Live_contracts_if_acc_mnger {
            id
            name
            status
        }
        direct_static_Live_conracts_if_acc_mngr {
            id
            name
            status
        }
        indirect_dynamic_Live_contracts_if_acc_mnger {
            id
            name
            status
        }
        direct_dynamic_Live_conracts_if_acc_mngr {
            id
            name
            currency
            status
        }
    }
    }`;
    const query = GET_ALL;
    const path = "";
    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.get_all_users)) {
        const dataArray = res.data.get_all_users;
        setListOfUsers(dataArray);
        setAccManager(dataArray?.filter((user) => user.ulevel === 2));
        setUserUnderHotel(dataArray?.filter((user) => user.ulevel === 6))
        setUsersUnderDMC(dataArray?.filter((user) => user.ulevel === 4))
        setUserAgent(dataArray?.filter((user) => user.ulevel === 10))
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return { ListOfUsers, getAllUsers, accManager, userUnderHotel, usersUnderDMC, userAgent };
};

export default GetAllUsers;
