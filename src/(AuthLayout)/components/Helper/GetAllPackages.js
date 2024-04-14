import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllPackages = () => {
  const [PackageValue, setPackageValue] = useState([]);

  const getPackages = async () => {
    const GET_ALL = `{
      get_all_packages {
        id
        createdAt
        name
        youtube_link
        sharing_link
        description
        owner_type
        price_if_fixed
        profit_of_seller
        rooms_under_package {
            id
            day
            hotel {
                id
                name
            }
            contract {
                name
                id
            }
            room {
                id
                name
            }
        }
        services_under_package {
            id
            day
            service {
                id
                name
            }
        }
    }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_packages)) {
        const dataArray = res.data.get_all_packages;
        setPackageValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPackages();
  }, []);

  return { PackageValue };
};

export default GetAllPackages;
