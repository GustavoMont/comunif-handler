import { parseCookies } from "nookies";

export const authCookieKey = "@comunif_access";

export const getToken = () => {
  const { [authCookieKey]: token } = parseCookies();
  return token;
};
