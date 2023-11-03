import { ListResponse } from "@/models/Api";
import { EvasionReport } from "@/models/EvasionReports";
import { ctxType } from "@/types/ctx";
import { handleRequester } from "@/utils/handleRequester";

export const listEvasionReports = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data } = await requester.get<ListResponse<EvasionReport>>(
    "/evasion-reports"
  );
  return data;
};
