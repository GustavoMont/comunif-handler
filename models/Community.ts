import { CommunityChannel } from "./CommunityChannel";

export interface Community {
  id: number;
  name: string;
  subject: string;
  banner: string | null;
  isActive: boolean;
  isMember: boolean;
  communityChannels: CommunityChannel[];
}

export interface UpdateCommunity {
  name?: string;
  isActive?: boolean;
  banner: string | FileList | null;
}

export interface CreateCommunity {
  banner: FileList;
  name: string;
  subject: string;
}
