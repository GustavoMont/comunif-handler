import { Pagination } from "@/components/common/Layout/Pagination";
import { ManagementDrawer } from "@/components/common/Management/ManagementDrawer";
import { AddUser } from "@/components/user/AddUser";
import { UserCard } from "@/components/user/UserCard";
import { ListUserFilters, listUsers } from "@/services/user-requests";
import { Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import React, { useState } from "react";

const defaultFilters: ListUserFilters = {
  page: 1,
};

export default function Usuarios() {
  const [filters, setFilters] = useState<ListUserFilters>(defaultFilters);
  const { data: response, isLoading } = useQuery(["users", filters], () =>
    listUsers(filters)
  );
  const users = response?.results ?? [];
  const meta = response?.meta;

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
    <Stack>
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
      <Pagination
        onNext={onNext}
        onPrevious={onPrevious}
        alignSelf={"center"}
        currentPage={filters?.page || 1}
        pages={meta?.pages || 0}
      />
      <Text color="primary.500">
        Total de{" "}
        <Text as={"span"} fontWeight={"bold"}>
          {meta?.total ?? 0}
        </Text>{" "}
        usuários
      </Text>
      <SimpleGrid
        columns={[1, null, null, null, 2, 3]}
        spacing={5}
        style={{ listStyle: "none" }}
        as={"ul"}
      >
        {users.map((user) => (
          <li key={user.id}>
            <UserCard isLoading={isLoading} user={user} />
          </li>
        ))}
      </SimpleGrid>
    </Stack>
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
