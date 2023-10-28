import { ChartStatistic, Statistic } from "@/models/Statistics";
import { add } from "date-fns";
import { format } from "path";
import { getMothName } from "./dates";

export const statisticToChartStatistic = ({
  count,
  createdAt,
}: Statistic): ChartStatistic => ({
  count,
  month: getMothName(createdAt),
});
