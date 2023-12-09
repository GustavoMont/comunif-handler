import { Community } from "./Community";
import { User } from "./User";

export interface EvasionReport {
  id: number;
  communityId: number;
  community: Omit<Community, "isMember">;
  userId: number;
  user: User;
  removerId: number | null;
  remover: User | null;
  reason: string | null;
  removedAt: string;
}
