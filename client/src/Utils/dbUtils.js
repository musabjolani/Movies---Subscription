import axios from "axios";
import { useSelector } from "react-redux";
import store from "../redux/store";
import CINEMA_SERVICE_URL from "../Config/config";

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

export { getAll, postData, updateById, deleteById };
