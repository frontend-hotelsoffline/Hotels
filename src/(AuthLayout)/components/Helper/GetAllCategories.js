import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const useCategories = () => {
  const [categoryValue, setCategoryValue] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  const getAllCategories = async () => {
    const GET_ALL_CATEGORIES = `{
      getCtgories {
        id
        name
      }
    }`;
    const query = GET_ALL_CATEGORIES;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });
      if (Array.isArray(res.data.getCtgories)) {
        const dataArray = res.data.getCtgories.map((item) => ({
          value: item.id ? item.id : "",
          label: item.name ? item.name : "",
        }));
        setCategoryValue(dataArray);
        setCategoryData(res.data.getCtgories);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return { categoryValue, categoryData, getAllCategories };
};

export default useCategories;
