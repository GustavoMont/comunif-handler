import { ChartStatistic, Statistic } from "@/models/Statistics";
import { getMothName } from "./dates";

export const statisticToChartStatistic = ({
  count,
  createdAt,
}: Statistic): ChartStatistic => ({
  count,
  month: getMothName(createdAt),
});
