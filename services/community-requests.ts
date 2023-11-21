import api, { serverSideAPi } from "@/config/api";
import { ListResponse, QueryParams } from "@/models/Api";
import { Community, UpdateCommunity } from "@/models/Community";
import { ctxType } from "@/types/ctx";
import { handleFormData } from "@/utils/form";
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

export const getCommunity = async (id: number, ctx: ctxType | null = null) => {
  const route = `/communities/${id}`;
  if (ctx) {
    const { data: community } = await serverSideAPi(ctx).get<Community>(route);
    return community;
  }
  const { data: community } = await api.get<Community>(route);
  return community ?? null;
};

type updateCommunity = (
  id: number,
  body: UpdateCommunity
) => Promise<Community>;
export const updateCommunity: updateCommunity = async (id, body) => {
  const multipartForm = new FormData();
  Object.keys(body).forEach((key) => handleFormData(key, body, multipartForm));
  if (typeof body.banner !== "string") {
    const banner = body.banner?.item(0);
    banner && multipartForm.append("banner", banner);
  }
  const { data: community } = await api.patch<Community>(
    `/communities/${id}`,
    multipartForm,
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

export const deleteCommunity = async (communityId: number) => {
  await api.delete(`/communities/${communityId}`);
};

export const listUserCommunities = async (userId: number) => {
  const { data: communities } = await api.get<Community[]>(
    `/communities/users/${userId}`
  );
  return communities;
};
