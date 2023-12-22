import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Community } from "@/models/Community";
import {
  HStack,
  Heading,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  DehydratedState,
  QueryClient,
  dehydrate,
  useQuery,
} from "@tanstack/react-query";
import CommunityCard from "@/components/community/CommunityCard";
import { ListResponse } from "@/models/Api";

import { ErrorBlock } from "@/components/common/Layout/ErrorBlock";
import { Pagination } from "@/components/common/Layout/Pagination";
import {
  CommunityQueryParams,
  listCommunities,
} from "@/services/community-requests";
import { AddCommunity } from "@/components/community/AddCommunty";
import { ManagementDrawer } from "@/components/common/Management/ManagementDrawer";
import Head from "next/head";
import { v4 } from "uuid";

interface Props {
  communitiesList?: ListResponse<Community>;
  dehydratedState: DehydratedState;
}

const initialQuery: CommunityQueryParams = {
  page: 1,
};

const Comunidades: NextPage<Props> = () => {
  const [filters, setFilters] = useState<CommunityQueryParams>(initialQuery);

  const {
    data: communitiesList,
    isError,
    isLoading,
  } = useQuery(["communities", filters], () => listCommunities(filters), {
    keepPreviousData: true,
    staleTime: 5000,
  });

  const communities = communitiesList?.results;
  const meta = communitiesList?.meta;

  const onNext = () =>
    setFilters(({ page, ...prev }) => ({
      ...prev,
      page: page ? Math.min(page + 1, meta?.pages || 0) : 1,
    }));
  const onPrevious = () =>
    setFilters(({ page, ...prev }) => ({
      ...prev,
      page: page ? Math.max(page - 1, 1) : 1,
    }));

  if (isError) {
    return (
      <>
        <DocumentHeader />

        <ErrorBlock
          message="Ocorreu um erro ao listar as comunidades. Tente mais tarde!!!"
          title="Erro ao listar as comunidades"
        />
      </>
    );
  }

  return (
    <>
      <DocumentHeader />
      <Stack spacing={5}>
        <Heading as={"h2"} color={"primary.500"}>
          Comunidades
          <ManagementDrawer
            options={[{ content: <AddCommunity /> }]}
            title="Comunidades"
          />
        </Heading>
        <HStack spacing={4}>
          <RadioGroup
            defaultValue="all"
            onChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                isActive: value === "all" ? undefined : value === "true",
              }));
            }}
            colorScheme="primary"
          >
            <HStack>
              <Radio value="all">Todas</Radio>
              <Radio value="true">Ativas</Radio>
              <Radio value="false">Inativas</Radio>
            </HStack>
          </RadioGroup>
        </HStack>

        <Pagination
          onNext={onNext}
          onPrevious={onPrevious}
          alignSelf={"center"}
          currentPage={filters?.page || 1}
          pages={meta?.pages || 0}
          isLoading={isLoading}
        />

        <Text color={"primary.500"}>
          Total de{" "}
          {isLoading ? (
            <Skeleton
              as={"span"}
              display={"inline-block"}
              height={"3"}
              w={"3"}
              rounded={"full"}
            />
          ) : (
            <Text as={"span"} fontWeight={"bold"}>
              {meta?.total ?? 0}
            </Text>
          )}{" "}
          comunidades
        </Text>
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 4 }}
          gap={5}
          justifyItems={{ sm: "center", lg: "stretch" }}
        >
          {!communities?.length && isLoading
            ? Array.from({ length: 6 }).map(() => (
                <Skeleton height={"72"} isLoaded={false} key={v4()} />
              ))
            : communities?.map((community) => (
                <Skeleton isLoaded={!isLoading} key={community.id}>
                  <CommunityCard community={community} />
                </Skeleton>
              ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};

const DocumentHeader = () => (
  <Head>
    <title>Comunidades - Comunif</title>
  </Head>
);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery(["communities"], () =>
    listCommunities(initialQuery, ctx)
  );
  try {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      } as Props,
    };
  } catch (error) {
    return {
      props: {
        communitiesList: {},
      } as Props,
    };
  }
};

export default Comunidades;
