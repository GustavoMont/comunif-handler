import { Pagination } from "@/components/common/Layout/Pagination";
import { ManagementDrawer } from "@/components/common/Management/ManagementDrawer";
import { AddUser } from "@/components/user/AddUser";
import { UserCard } from "@/components/user/UserCard";
import { ListUserFilters, listUsers } from "@/services/user-requests";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Radio,
  RadioGroup,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { v4 } from "uuid";

const defaultFilters: ListUserFilters = {
  page: 1,
  isActive: true,
};

export default function Usuarios() {
  const [filters, setFilters] = useState<ListUserFilters>(defaultFilters);
  const { data: response, isLoading } = useQuery(["users", filters], () =>
    listUsers(filters)
  );
  const users = response?.results ?? [];
  const meta = response?.meta;
  type RadioType = "all" | "active" | "deactive";
  const onChangeRadio = (value: RadioType) => {
    let isActive: boolean;
    if (value !== "all") {
      isActive = value === "active";
    }
    setFilters((prev) => ({
      ...prev,
      page: 1,
      isActive,
    }));
  };
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

  return (
    <>
      <Head>
        <title>Usuários - Comunif</title>
      </Head>
      <Stack as={"main"}>
        <Flex gap={2} alignItems={"center"}>
          <Heading color={"primary.500"} as={"h2"}>
            Usuários
          </Heading>
          <ManagementDrawer
            options={[
              {
                content: <AddUser />,
              },
            ]}
            title="Usuários"
          />
        </Flex>
        <Box paddingY={"5"}>
          <RadioGroup
            defaultValue="active"
            onChange={onChangeRadio}
            colorScheme="primary"
          >
            <HStack>
              <Radio value="all">Todos</Radio>
              <Radio value="active">Ativos</Radio>
              <Radio value="deactive">Inativos</Radio>
            </HStack>
          </RadioGroup>
        </Box>
        <Pagination
          onNext={onNext}
          onPrevious={onPrevious}
          alignSelf={"center"}
          currentPage={filters?.page || 1}
          pages={meta?.pages || 0}
          isLoading={isLoading}
        />

        <Text color="primary.500">
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
          usuários
        </Text>
        <SimpleGrid
          columns={[1, null, null, null, 2, 3]}
          spacing={5}
          style={{ listStyle: "none" }}
          as={"ul"}
        >
          {isLoading && !users.length
            ? Array.from({ length: 6 }).map(() => (
                <Skeleton height={"72"} isLoaded={false} key={v4()} />
              ))
            : users.map((user) => (
                <li key={user.id}>
                  <UserCard isLoading={isLoading} user={user} />
                </li>
              ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();
  queryClient.prefetchQuery(["users", defaultFilters], () =>
    listUsers(defaultFilters, ctx)
  );
  try {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};
