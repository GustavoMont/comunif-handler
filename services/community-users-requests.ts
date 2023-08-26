import api, { serverSideAPi } from "@/config/api";
import { ListResponse } from "@/models/Api";
import { User } from "@/models/User";
import { ctxType } from "@/types/ctx";

export const listCommunityMembers = async (
  communityId: number,
  ctx: ctxType | null = null
) => {
  const requester = ctx ? serverSideAPi(ctx) : api;
  const { data } = await requester.get<ListResponse<User>>(
    `community-users/${communityId}/members`
  );
  return data;
};
