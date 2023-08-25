import { validateRefreshToken } from "@/services/auth-requests";
import { ctxType } from "@/types/ctx";
import {
  deleteTokens,
  getRefreshToken,
  getToken,
  storeTokens,
} from "@/utils/auth";
import axios, { AxiosError } from "axios";
import Router from "next/router";

const url = process.env.NEXT_PUBLIC_API_URL;

const baseURL = `${url}/api/`;

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

const onRequestFail = async (err: AxiosError) => {
  if (err.response?.status === 401) {
    try {
      const refreshToken = getRefreshToken();
      const credentials = await validateRefreshToken(refreshToken ?? "");
      storeTokens(credentials);
    } catch (error) {
      deleteTokens();
      Router.push("/login");
    }
  }
  return Promise.reject(err);
};

api.interceptors.response.use((config) => config, onRequestFail);

export default api;
