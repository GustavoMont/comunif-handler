import api from "@/config/api";
import { ListResponse } from "@/models/Api";
import { Message } from "@/models/Message";

interface Filters {
  page?: number;
  take?: number;
}

export const listMessagesByChannel = async (
  channelId: number,
  filters?: Filters
) => {
  const { data } = await api.get<ListResponse<Message>>(
    `/messages/channel/${channelId}`,
    {
      params: filters,
    }
  );
  return data;
};
