import api from "@/config/api";
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

export type ResetPasswordBody = { email: string };

export const resetPassword = async ({ email }: ResetPasswordBody) => {
  const { data } = await api.post<{ email: string }>("/auth/reset-password", {
    email,
  });
  return data;
};

export interface ConfirmCodeBody {
  code: string;
  email: string;
}

export const confirmCode = async (data: ConfirmCodeBody) => {
  const { data: access } = await api.post<Pick<AuthCookie, "access">>(
    `/auth/reset-password/confirm-code`,
    data
  );
  return access;
};

export interface ChangePasswordBody {
  password: string;
  confirmPassword: string;
}

export const changePassword = async (body: ChangePasswordBody) => {
  await api.patch("/auth/change-password", body);
};
