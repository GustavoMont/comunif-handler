import { ListResponse } from "@/models/Api";
import { CountStatistics, MessageStatistics } from "@/models/Statistics";
import { ctxType } from "@/types/ctx";
import { handleRequester } from "@/utils/handleRequester";

const BASE_URL = "message-statistics";

export const getMessagesCount = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data: usersCount } = await requester.get<CountStatistics>(
    `${BASE_URL}/count`
  );
  return usersCount;
};
export const listMessageStatistics = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data } = await requester.get<ListResponse<MessageStatistics>>(
    BASE_URL
  );
  return data;
};

export const createMessageStatistics = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data } = await requester.post<MessageStatistics>(BASE_URL);
  return data;
};
