import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const RegionsForCountries = () => {
  const [regionCountries, setRegionsCountries] = useState([]);
  
  const getRegionsWithCountries = async () => {
    const GET_ALL = `{
        get_all_regions {
            id
            region
            countries_of_region {
                id
                region
                country
            }
        }
    
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.get_all_regions)) {
        const dataArray = res.data.get_all_regions.map(item=>({region: item.region, countries: item.countries_of_region.map(country=>country.country)}))
        setRegionsCountries(dataArray)
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    getRegionsWithCountries();
  }, []);

  return { regionCountries, getRegionsWithCountries };
};

export default RegionsForCountries;
