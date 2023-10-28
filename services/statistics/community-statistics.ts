import { ListResponse } from "@/models/Api";
import { CommunityStatistics, CountStatistics } from "@/models/Statistics";
import { ctxType } from "@/types/ctx";
import { handleRequester } from "@/utils/handleRequester";

const BASE_URL = "community-statistics";

export const getCommunitiesCount = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data: usersCount } = await requester.get<CountStatistics>(
    `${BASE_URL}/count`
  );
  return usersCount;
};

export const listCommunityStatistics = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data: userStatistics } = await requester.get<
    ListResponse<CommunityStatistics>
  >(`${BASE_URL}`);
  return userStatistics;
};
