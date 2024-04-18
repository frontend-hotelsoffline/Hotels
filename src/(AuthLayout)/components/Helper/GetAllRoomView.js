import { useState, useEffect } from "react";
import { GET_API } from "../API/GetAPI";

const GetAllRoomView = () => {
  const [roomViewValue, setroomViewValue] = useState([]);

  const getAllRoomV = async () => {
    const GET_ALL_CATEGORIES = `{
        get_all_Room_views {
            id
            name
            description
        }
    }`;
    const query = GET_ALL_CATEGORIES;
    const path = "";

    try {
      const res = await GET_API(path, { params: { query } });

      if (Array.isArray(res.data.get_all_Room_views)) {
        const dataArray = res.data.get_all_Room_views.map((item) => ({
          value: item.id ? item.id : "",
          label: item.name ? item.name : "",
        }));
        setroomViewValue(dataArray);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllRoomV();
  }, []);

  return { roomViewValue, getAllRoomV };
};

export default GetAllRoomView;
