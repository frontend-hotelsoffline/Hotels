import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetPackageByID = (package_id) => {
  const [PackgeByID, setPackgeByID] = useState([]);

  const fetchPackgeByID = async () => {
    const GET_ALL = `{
        get_package_by_id(id: ${package_id}) {
            id
            createdAt
            name
            youtube_link
            sharing_link
            description
            owner_type
            price_if_fixed
            profit_of_seller
            links_of_images {
                id
                link
            }
            rooms_under_package_grouped_by_date {
                day
                rooms {
                    id
                    day
                    meal 
                    room {
                        id
                        name
                    }
                    contract {
                        id
                        name
                    }
                    hotel {
                        id
                        name
                    }
                }
            }
            services_under_package_grouped_by_date {
                day
                services {
                    id
                    day
                    service {
                        id
                        name
                    }
                }
            }
        }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (res.data.get_package_by_id) {
        const dataArray = res.data.get_package_by_id;
        setPackgeByID(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPackgeByID();
  }, [package_id]);

  return { PackgeByID, fetchPackgeByID };
};

export default GetPackageByID;
