import { ctxType } from "@/types/ctx";
import { destroyCookie, parseCookies, setCookie } from "nookies";

export const authCookieKey = "@comunif_access";
export const refreshCookieKey = "@comunif_refress_token";
type GetToken = (ctx?: ctxType | null) => string;

export const getToken: GetToken = (ctx = null) => {
  const { [authCookieKey]: token } = parseCookies(ctx);
  return token;
};

export const getRefreshToken: GetToken = (ctx = null) => {
  const { [refreshCookieKey]: refreshToken } = parseCookies(ctx);
  return refreshToken;
};

export const deleteTokens = () => {
  destroyCookie(null, authCookieKey);
  destroyCookie(null, refreshCookieKey);
};

interface StoreTokensParams {
  access: string;
  refreshToken: string;
}

export const storeTokens = ({ refreshToken, access }: StoreTokensParams) => {
  setCookie(null, authCookieKey, access, {
    maxAge: 60 * 60 * 1,
  });
  setCookie(null, refreshCookieKey, refreshToken, {
    maxAge: 60 * 60 * 8,
  });
};
