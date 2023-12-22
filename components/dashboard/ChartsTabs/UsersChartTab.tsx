import React from "react";
import { ChartPanelContainer } from "./ChartPanelContainer";
import {
  createUserStatistics,
  listUserStatistics,
} from "@/services/statistics/user-statistics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { statisticToChartStatistic } from "@/utils/transform-model";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Box, useToken } from "@chakra-ui/react";
import { useAppToast } from "@/hooks/useAppToast";
import { ApiErrorHandler } from "@/utils/ApiError";
import { ListResponse } from "@/models/Api";
import { UserStatistics } from "@/models/Statistics";

export const UsersChartTab = () => {
  const [primary500, secondary50] = useToken("colors", [
    "primary.500",
    "secondary.50",
  ]);
  const { toastError, toastSuccess } = useAppToast();
  const { data: statisticsResponse, isLoading } = useQuery(
    ["user-statistics"],
    () => listUserStatistics()
  );
  const queryClient = useQueryClient();

  const statistics = statisticsResponse?.results ?? [];

  const chartStatistics = statistics.map(statisticToChartStatistic);

  const { mutate, isLoading: isGenerating } = useMutation(
    createUserStatistics,
    {
      onSuccess(data) {
        toastSuccess({
          title: "Estatísticas geradas com sucesso",
        });
        queryClient.setQueryData<ListResponse<UserStatistics>>(
          ["user-statistics"],
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
    }
  );

  return (
    <ChartPanelContainer
      generateNewStats={mutate}
      isGenerating={isGenerating}
      isLoading={isLoading}
      title="Usuários"
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
