import { ChannelType } from "./ChannelType";

export interface CommunityChannel {
  id: number;
  communityId: number;
  channelTypeId: number;
  channelType: ChannelType;
}
