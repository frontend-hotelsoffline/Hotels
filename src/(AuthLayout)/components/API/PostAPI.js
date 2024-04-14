import { api } from "./constants";

export const POST_API = async (path, data, headers) => {
  const url = path;
  try {
    const response = await api.post(url, data, {headers /*,withCredentials: true*/});
    return response.data; 
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
