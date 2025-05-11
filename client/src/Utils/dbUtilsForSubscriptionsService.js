import axios from "axios";
import store from "../redux/store";
import { SUBSCRIPTIONS_SERVICE_URL } from "../Config/config";

const excludedRoutes = ["/userDB/login"];

const api = axios.create({
  baseURL: SUBSCRIPTIONS_SERVICE_URL, // Set your API base URL
});

// Add a request interceptor to inject the token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // Get token from Redux store
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config.url; // Get the request URL
    // const unauthReason = error.response.headers["X-Unauth-Reason"];
    try {
      const unauthReason =
        error.response.headers["x-unauth-reason"] ||
        error.response.headers["X-Unauth-Reason"];
      if (
        error.response &&
        error.response.status === 401 &&
        unauthReason === "invalid-token" &&
        !excludedRoutes.includes(requestUrl) // Skip handling if the route is in the excluded list
      ) {
        window.location.href = "/login";
        console.log(
          "Unauthorized due to invalid token, redirecting to login..."
        );
      } else if (
        error.response &&
        error.response.status === 403 &&
        unauthReason === "insufficient-permissions"
      ) {
        console.log("Access denied due to insufficient permissions.");
      }

      console.log("response error", error.response);
      return Promise.reject(error);
    } catch (error) {
      console.error(
        `Error in response interceptor  dbUtilsForSubscriptionsService :${error.message} `
      );
    }
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

export { getAll, postData, updateById, deleteById };
