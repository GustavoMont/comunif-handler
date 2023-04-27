import { ctxType } from "@/types/ctx";
import { parseCookies } from "nookies";

export const authCookieKey = "@comunif_access";

export const getToken = (ctx: ctxType | null = null) => {
  const { [authCookieKey]: token } = parseCookies(ctx);
  return token;
};
