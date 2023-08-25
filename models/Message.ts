import { CommunityChannel } from "./CommunityChannel";
import { User } from "./User";

export interface Message {
  id: number;
  content: string;
  user: User;
  userId: number;
  communityChannel: CommunityChannel;
  communityChannelId: number;
}
