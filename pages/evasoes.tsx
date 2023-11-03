import { listEvasionReports } from "@/services/evasions-reportsprequests";
import {
  Heading,
  Link,
  Skeleton,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import React from "react";

function EvasionReportsPage() {
  const { data: evasionReportsResponse, isLoading } = useQuery(
    ["evasion-reports"],
    () => listEvasionReports()
  );
  const reports = evasionReportsResponse?.results ?? [];
  const headers = ["Usuário", "Comunidade", "Foi removido", "Removido Por"];
  return (
    <Stack as={"main"} spacing={"10"}>
      <Heading as={"h2"} color="primary.500">
        Relatórios de Evasões
      </Heading>
      <Skeleton isLoaded={!isLoading}>
        <TableContainer>
          <Table colorScheme="primary" variant="simple">
            <TableCaption>
              Usuários que saíram ou foram banidos da comunidade
            </TableCaption>
            <Thead>
              <Tr>
                {headers.map((text) => (
                  <Th key={text} color={"secondary.400"}>
                    {text}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {reports.map(({ id, user, community, removerId, remover }) => (
                <Tr key={id}>
                  <Td>
                    <Link
                      color="primary.500"
                      _hover={{
                        color: "primary.600",
                        textDecoration: "underline",
                      }}
                      as={NextLink}
                      href={`/usuarios/${user.id}`}
                    >
                      {user.name} {user.lastName}
                    </Link>
                  </Td>
                  <Td>
                    <Link
                      color="secondary.500"
                      _hover={{
                        color: "secondary.600",
                        textDecoration: "underline",
                      }}
                      as={NextLink}
                      href={`/comunidades/${community.id}`}
                    >
                      {community.name}
                    </Link>
                  </Td>
                  <Td>{removerId ? "Sim" : "Não"}</Td>
                  <Td>{remover ? remover.name : "-"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Skeleton>
    </Stack>
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
