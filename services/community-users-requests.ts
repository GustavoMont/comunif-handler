import api, { serverSideAPi } from "@/config/api";
import { ListResponse } from "@/models/Api";
import { User } from "@/models/User";
import { ctxType } from "@/types/ctx";

const BASE_URL = "community-users";

export const listCommunityMembers = async (
  communityId: number,
  ctx: ctxType | null = null
) => {
  const requester = ctx ? serverSideAPi(ctx) : api;
  const { data } = await requester.get<ListResponse<User>>(
    `${BASE_URL}/${communityId}/members`
  );
  return data;
};

export const removeUserFromCommunity = async (
  communityId: number,
  userId: number
) => {
  await api.delete(`${BASE_URL}/${communityId}/members/${userId}`);
};
