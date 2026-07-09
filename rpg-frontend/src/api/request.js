import axios from "axios";

const request = axios.create({
  baseURL: "https://rpggame-production-214e.up.railway.app",
  timeout: 5000
});

request.interceptors.request.use(config => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default request;