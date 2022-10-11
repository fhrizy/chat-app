import axios from "axios";

axios.defaults.baseURL = `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/api`;

export const http_get = (url, auth = false, params = {}) => {
  if (auth)
    axios.defaults.headers.common["Authorization"] =
      JSON.parse(localStorage.getItem("token")) || "";
  return axios.get(url, { params });
};

export const http_post = (url, auth = false, data = {}) => {
  if (auth)
    axios.defaults.headers.common["Authorization"] =
      JSON.parse(localStorage.getItem("token")) || "";
  return axios.post(url, data);
};
