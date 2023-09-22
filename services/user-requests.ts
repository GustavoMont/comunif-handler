import api, { serverSideAPi } from "@/config/api";
import { ListResponse } from "@/models/Api";
import { User } from "@/models/User";
import { ctxType } from "@/types/ctx";

export interface ListUserFilters {
  role?: string;
  page?: number;
  take?: number;
}

export const listUsers = async (
  filters?: ListUserFilters,
  ctx: ctxType | null = null
) => {
  const requester = ctx ? serverSideAPi(ctx) : api;
  const { data: result } = await requester.get<ListResponse<User>>(`/users`, {
    params: filters,
  });
  return result;
};

export const getUser = async (id: number, ctx: ctxType | null = null) => {
  const requester = ctx ? serverSideAPi(ctx) : api;
  const { data: user } = await requester.get<User>(`/users/${id}/`);
  return user;
};

export type UpdateUser = Omit<User, "email" | "avatar" | "id">;

export const updateUser = async (id: number, body: UpdateUser) => {
  const { data: user } = await api.patch<User>(`/users/${id}`, body);
  return user;
};

export type UpdateUserAvatar = {
  avatar?: FileList;
};

export const updateUserAvatar = async (
  id: number,
  { avatar }: UpdateUserAvatar
) => {
  const formData = new FormData();
  const newAvatar = avatar?.item(0);
  if (newAvatar) {
    formData.append("avatar", newAvatar);
  }
  const { data: user } = await api.patch<User>(
    `/users/${id}/avatar`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return user;
};
