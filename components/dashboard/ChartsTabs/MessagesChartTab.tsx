import React from "react";
import { ChartPanelContainer } from "./ChartPanelContainer";
import { Box, Spinner, useToken } from "@chakra-ui/react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMessageStatistics,
  listMessageStatistics,
} from "@/services/statistics/message-statistics-request";
import { statisticToChartStatistic } from "@/utils/transform-model";
import { useAppToast } from "@/hooks/useAppToast";
import { ListResponse } from "@/models/Api";
import { MessageStatistics } from "@/models/Statistics";
import { ApiErrorHandler } from "@/utils/ApiError";

export const MessagesChartTab = () => {
  const [primary500, secondary50] = useToken("colors", [
    "primary.500",
    "secondary.50",
  ]);
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useAppToast();
  const { data: statisticsResponse, isLoading } = useQuery(
    ["messages-statistics"],
    () => listMessageStatistics()
  );

  const statistics = statisticsResponse?.results ?? [];

  const chartStatistics = statistics.map(statisticToChartStatistic);

  const { mutate, isLoading: isCreating } = useMutation(
    createMessageStatistics,
    {
      onSuccess(data) {
        toastSuccess({
          title: "Estatísticas geradas com sucesso",
        });
        queryClient.setQueryData<ListResponse<MessageStatistics>>(
          ["messages-statistics"],
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
      isGenerating={isCreating}
      title="Mensagens"
    >
      {isLoading ? <Spinner color="primary.500" /> : null}
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
