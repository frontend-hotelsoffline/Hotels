import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const RegionsForCountries = () => {
  const [regionCountries, setRegionsCountries] = useState([]);

  const getRegionsWithCountries = async () => {
    const GET_ALL = `{
      getRGNS {
        id
        rgn
        countries {
            id
            RGNid
            country
        }
    }
    
    }`;
    const query = GET_ALL;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });
      console.log(res);
      if (Array.isArray(res.data.getRGNS)) {
        const dataArray = res.data.getRGNS.map((item) => ({
          region: item.rgn,
          countries: item.countries.map((country) => country.country),
        }));
        setRegionsCountries(dataArray);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getRegionsWithCountries();
  }, []);

  return { regionCountries, getRegionsWithCountries };
};

export default RegionsForCountries;
