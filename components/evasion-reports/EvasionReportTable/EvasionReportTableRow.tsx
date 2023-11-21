import { EvasionReport } from "@/models/EvasionReports";
import { Link, Td, Text, Tr } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface Props {
  report: EvasionReport;
}

export const EvasionReportTableRow: React.FC<Props> = ({ report }) => {
  const { user, community, removerId, remover } = report;
  return (
    <Tr transition={"ease-in-out 0.2s"} _hover={{ bgColor: "gray.200" }}>
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
      <Td color={"secondary.500"}>
        {remover ? (
          <Link
            color="secondary.500"
            _hover={{
              color: "secondary.600",
              textDecoration: "underline",
            }}
            as={NextLink}
            href={`/comunidades/${community.id}`}
          >
            {remover.name} {remover.lastName[0]}
          </Link>
        ) : (
          <Text>-</Text>
        )}
      </Td>
    </Tr>
  );
};
