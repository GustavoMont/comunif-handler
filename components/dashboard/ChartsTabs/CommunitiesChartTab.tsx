import React from "react";
import { ChartPanelContainer } from "./ChartPanelContainer";
import { useQuery } from "@tanstack/react-query";
import { statisticToChartStatistic } from "@/utils/transform-model";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Box, useToken } from "@chakra-ui/react";
import { listCommunityStatistics } from "@/services/statistics/community-statistics";

export const CommunitiesChartTab = () => {
  const [primary500, secondary50] = useToken("colors", [
    "primary.500",
    "secondary.50",
  ]);
  const { data: statisticsResponse } = useQuery(["community-statistics"], () =>
    listCommunityStatistics()
  );
  const statistics = statisticsResponse?.results ?? [];

  const chartStatistics = statistics.map(statisticToChartStatistic);

  return (
    <ChartPanelContainer title="Comunidades">
      <Box>
        <LineChart barGap={4} width={500} height={300} data={chartStatistics}>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid stroke={secondary50} strokeDasharray="5 5" />
          <Line type="monotone" dataKey="count" stroke={primary500} />
        </LineChart>
      </Box>
    </ChartPanelContainer>
  );
};
