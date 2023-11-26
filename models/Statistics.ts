import { User } from "./User";

export interface CountStatistics {
  total: number;
}

export interface Statistic {
  id: number;
  count: number;
  createdAt: string;
}

export interface UserStatistics extends Statistic {
  userId: number | null;
  user: User | null;
}
export interface CommunityStatistics extends Statistic {
  userId: number | null;
  user: User | null;
}

export interface MessageStatistics extends Statistic {
  userId: number | null;
  user: User | null;
}

export interface ChartStatistic {
  count: number;
  month: string;
}
