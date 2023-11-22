import { ChartsTabs } from "@/components/dashboard/ChartsTabs/ChartsTabs";
import { useAuth } from "@/context/AuthContext";
import { getCommunitiesCount } from "@/services/statistics/community-statistics";
import { getUsersCount } from "@/services/statistics/user-statistics";
import { authCookieKey } from "@/utils/auth";
import {
  Box,
  Heading,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { parseCookies } from "nookies";

export default function Home() {
  const { user } = useAuth();
  const { data: usersCountStats, isLoading: isLoadingUsersCount } = useQuery(
    ["users-count"],
    () => getUsersCount()
  );
  const { data: communitiesCount, isLoading: isLoadingCommunitiesCount } =
    useQuery(["communities-count"], () => getCommunitiesCount());
  return (
    <>
      <Head>
        <title>Bem vindo, {user?.name} - Comunif</title>
      </Head>
      <Stack as={"main"}>
        <Box mb={"4"}>
          <Heading as={"h2"} color={"primary.500"}>
            Olá, {user?.name}
          </Heading>
        </Box>
        <StatGroup>
          <Stat>
            <StatLabel>Usuários ativos</StatLabel>
            {isLoadingUsersCount ? (
              <Spinner colorScheme="primary" />
            ) : (
              <StatNumber color={"primary.400"}>
                {usersCountStats?.total}
              </StatNumber>
            )}
          </Stat>
          <Stat>
            <StatLabel>Comunidades ativas</StatLabel>
            {isLoadingCommunitiesCount ? (
              <Spinner colorScheme="primary" />
            ) : (
              <StatNumber color={"primary.400"}>
                {communitiesCount?.total}
              </StatNumber>
            )}
          </Stat>
        </StatGroup>
        <ChartsTabs />
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { [authCookieKey]: token } = parseCookies(ctx);
  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }
  const queryClient = new QueryClient();
  queryClient.prefetchQuery(["users-count"], () => getUsersCount(ctx));
  queryClient.prefetchQuery(["communities-count"], () =>
    getCommunitiesCount(ctx)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
