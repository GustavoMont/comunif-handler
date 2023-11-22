import { EvasionReportsTable } from "@/components/evasion-reports/EvasionReportTable/EvasionReportsTable";
import { listEvasionReports } from "@/services/evasions-reportsprequests";
import { Heading, Skeleton, Stack } from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";

function EvasionReportsPage() {
  const { data: evasionReportsResponse, isLoading } = useQuery(
    ["evasion-reports"],
    () => listEvasionReports()
  );
  const reports = evasionReportsResponse?.results ?? [];

  return (
    <>
      <Head>
        <title>Relatórios de Evasões - Comunif</title>
      </Head>
      <Stack as={"main"} spacing={"10"}>
        <Heading as={"h2"} color="primary.500">
          Relatórios de Evasões
        </Heading>
        <Skeleton isLoaded={!isLoading}>
          <EvasionReportsTable reports={reports} />
        </Skeleton>
      </Stack>
    </>
  );
}

export default EvasionReportsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  queryClient.prefetchQuery(["evasion-reports"], () => listEvasionReports(ctx));
  return {
    props: {
      data: dehydrate(queryClient),
    },
  };
};
