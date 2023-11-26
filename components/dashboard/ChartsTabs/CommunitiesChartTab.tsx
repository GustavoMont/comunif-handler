import React from "react";
import { ChartPanelContainer } from "./ChartPanelContainer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { statisticToChartStatistic } from "@/utils/transform-model";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Box, useToken } from "@chakra-ui/react";
import {
  createCommunityStatistics,
  listCommunityStatistics,
} from "@/services/statistics/community-statistics";
import { useAppToast } from "@/hooks/useAppToast";
import { ListResponse } from "@/models/Api";
import { CommunityStatistics } from "@/models/Statistics";
import { ApiErrorHandler } from "@/utils/ApiError";

export const CommunitiesChartTab = () => {
  const [primary500, secondary50] = useToken("colors", [
    "primary.500",
    "secondary.50",
  ]);
  const { data: statisticsResponse } = useQuery(["community-statistics"], () =>
    listCommunityStatistics()
  );
  const { toastError, toastSuccess } = useAppToast();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createCommunityStatistics, {
    onSuccess(data) {
      toastSuccess({
        title: "Estatísticas geradas com sucesso",
      });
      queryClient.setQueryData<ListResponse<CommunityStatistics>>(
        ["community-statistics"],
        (old) => {
          if (!old) {
            return old;
          }
          return {
            meta: old.meta,
            results: [...old.results, data],
          };
        }
      );
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        title: apiError.title,
        message: apiError.message,
      });
    },
  });

  const statistics = statisticsResponse?.results ?? [];

  const chartStatistics = statistics.map(statisticToChartStatistic);

  return (
    <ChartPanelContainer
      generateNewStats={mutate}
      isGenerating={isLoading}
      title="Comunidades"
    >
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
