import axios from "axios";
import { useSelector } from "react-redux";
import store from "../redux/store";
import { CINEMA_SERVICE_URL } from "../Config/config";

const excludedRoutes = ["/userDB/login"];

const api = axios.create({
  baseURL: CINEMA_SERVICE_URL, // Set your API base URL
});

// Add a request interceptor to inject the token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // Get token from Redux store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config.url; // Get the request URL

    if (
      error.response &&
      error.response.statusText === "Unauthorized" &&
      !excludedRoutes.includes(requestUrl) // Skip handling if the route is in the excluded list
    ) {
      window.location.href = "/login";
      console.log("Unauthorized, redirecting to login...");
    }
    return Promise.reject(error);
  }
);

const getAll = async (url) => {
  return await api.get(url);
};

const postData = async (url, data) => {
  return await api.post(url, data);
};

const updateById = async (url, data) => {
  await api.put(url, data);
};
const deleteById = async (url) => {
  await api.delete(url);
};

const getUserDetails = async () => {
  return await api.get("/userDB/getUserDetails");
};

export { getAll, postData, updateById, deleteById, getUserDetails };
