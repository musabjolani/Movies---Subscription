import axios from "axios";

// axios.interceptors.response.use(null, (error) => {
//   // console.log(error);
//   return Promise.reject(error);
// });

const getAll = (url) => {
  return axios.get(url);
};

const postData = async (url, data) => {
  return await axios.post(url, data);
};

const updateById = async (url, data) => {
  await axios.put(url, data);
};
const deleteById = async (url, id) => {
  await axios.delete(url, id);
};

export { getAll, postData, updateById, deleteById };
