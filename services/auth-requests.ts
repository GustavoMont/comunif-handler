import { env } from "@/constants/env";
import { AuthCookie } from "@/models/Auth";
import { ctxType } from "@/types/ctx";
import { getToken } from "@/utils/auth";
import axios from "axios";

export const validateRefreshToken = async (
  refreshToken: string,
  ctx: ctxType | null = null
) => {
  const token = getToken(ctx);
  const { data } = await axios.post<AuthCookie>(
    `${env.apiUrl}/api/auth/refresh-token`,
    {
      refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};
