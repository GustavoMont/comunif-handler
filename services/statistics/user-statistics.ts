import { ListResponse } from "@/models/Api";
import { CountStatistics, UserStatistics } from "@/models/Statistics";
import { ctxType } from "@/types/ctx";
import { handleRequester } from "@/utils/handleRequester";

const BASE_URL = "user-statistics";

export const getUsersCount = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data: usersCount } = await requester.get<CountStatistics>(
    `${BASE_URL}/count`
  );
  return usersCount;
};

export const listUserStatistics = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data: userStatistics } = await requester.get<
    ListResponse<UserStatistics>
  >(`${BASE_URL}`);
  return userStatistics;
};
