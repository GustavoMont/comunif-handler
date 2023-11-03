import { Community } from "./Community";
import { User } from "./User";

export interface EvasionReport {
  id: number;
  communityId: number | null;
  community: Omit<Community, "isMember">;
  userId: number | null;
  user: User;
  removerId: number | null;
  remover: User | null;
}
