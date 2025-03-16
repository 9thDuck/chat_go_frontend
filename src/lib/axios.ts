import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/v1/",
  withCredentials: true,
});
