import axios from 'axios';
import { BASE_URL } from './APIURL';

const api = axios.create({
  baseURL: "https://hotelsoffline.com:8080/graphql",
  withCredentials: true,
});

export { api };
