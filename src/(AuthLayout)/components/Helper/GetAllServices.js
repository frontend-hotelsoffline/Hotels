import React, { useEffect, useState } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllServices = () => {
  const [servicesValue, setservicesValue] = useState([]);

  const getAllServices = async () => {
    const GET_ALL = `{
      get_all_services {
        id
        createdAt
        name
        markup_id
        from_date
        to_date
        location
        country
        city
        longitude
        latitude
        description
        social_media_link
        youtube_link
        price_per_adult
        price_per_kid
        child_age_from
        child_age_to
        discount
        discount_from
        discount_to
        min_pax_discount
        owner_type
        Channel
        Mapping_ID
    }
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.get_all_services)) {
        const dataArray = res.data.get_all_services
        setservicesValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  return { servicesValue };
};

export default GetAllServices;
