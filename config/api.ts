import { ctxType } from "@/types/ctx";
import { getToken } from "@/utils/auth";
import axios from "axios";

const url = "http://localhost:3000";

const baseURL = `${url}/api`;

export const api = axios.create({
  baseURL,
});

export const serverSideAPi = (ctx: ctxType) => {
  const token = getToken(ctx);
  api.defaults.headers["Authorization"] = `Bearer ${token}`;

  return api;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default api;
