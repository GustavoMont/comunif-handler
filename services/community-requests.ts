import api, { serverSideAPi } from "@/config/api";
import { ListResponse, QueryParams } from "@/models/Api";
import { Community } from "@/models/Community";
import { ctxType } from "@/types/ctx";
import { AxiosResponse } from "axios";
import toSnakeCase from "decamelize-keys";

type communitiesList = ListResponse<Community>;

export interface CommunityQueryParams extends QueryParams {
  isActive?: boolean;
}

const toQueryParams = <T>(obj: T): string => {
  const queryObject = toSnakeCase(obj as never);
  const query = Object.entries(queryObject).reduce((prev, [key, value], i) => {
    if (typeof value === "undefined") {
      return "";
    }
    const query = `${key}=${value}`;
    return i === 0 || prev[0] !== "?" ? `?${query}` : `${prev}&${query}`;
  }, "");
  return query;
};

type listCommunities = (
  filters: CommunityQueryParams,
  ctx?: ctxType | null
) => Promise<ListResponse<Community>>;
export const listCommunities: listCommunities = async (filters, ctx = null) => {
  const queries = toQueryParams<CommunityQueryParams>(filters);
  const route = `/communities${queries}`;
  let response: AxiosResponse<communitiesList>;
  if (ctx) {
    response = await serverSideAPi(ctx).get<communitiesList>(route);
  } else {
    response = await api.get<communitiesList>(route);
  }
  const { data: communitiesList } = response;
  return communitiesList;
};

type updateCommunity = (id: number, body: FormData) => Promise<Community>;
export const updateCommunity: updateCommunity = async (id, body) => {
  const { data: community } = await api.patch<Community>(
    `/communities/${id}`,
    body,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    }
  );
  return community;
};

type createCommunity = (body: FormData) => Promise<void>;

export const createCommunity: createCommunity = async (body) => {
  await api.post<Community>(`/communities`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
};
