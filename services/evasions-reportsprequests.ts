import api from "@/config/api";
import { ListResponse } from "@/models/Api";
import { EvasionReport } from "@/models/EvasionReports";
import { ctxType } from "@/types/ctx";
import { handleRequester } from "@/utils/handleRequester";
import { AxiosResponse } from "axios";

export const listEvasionReports = async (ctx: ctxType | null = null) => {
  const requester = handleRequester(ctx);
  const { data } = await requester.get<ListResponse<EvasionReport>>(
    "/evasion-reports"
  );
  return data;
};

export type CreateEvasionReportBan = Pick<
  EvasionReport,
  "communityId" | "userId"
> & {
  removerId: number;
  reason: string;
};

export const createEvasionReportBan = async (body: CreateEvasionReportBan) => {
  type Response = AxiosResponse<EvasionReport>;
  const { data: evasionReport } = await api.post<
    null,
    Response,
    CreateEvasionReportBan
  >("/evasion-reports/ban", body);
  return evasionReport;
};
