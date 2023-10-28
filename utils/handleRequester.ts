import api, { serverSideAPi } from "@/config/api";
import { ctxType } from "@/types/ctx";

export const handleRequester = (ctx: ctxType | null) =>
  ctx ? serverSideAPi(ctx) : api;
