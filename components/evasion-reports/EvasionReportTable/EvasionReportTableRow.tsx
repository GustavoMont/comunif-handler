import { EvasionReport } from "@/models/EvasionReports";
import {
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { format, zonedTimeToUtc } from "date-fns-tz";
import NextLink from "next/link";
import React from "react";
import { HiOutlineEye } from "react-icons/hi";

interface Props {
  report: EvasionReport;
}

export const EvasionReportTableRow: React.FC<Props> = ({ report }) => {
  const { user, community, remover } = report;
  return (
    <Tr
      transition={"ease-in-out 0.2s"}
      _hover={{ bgColor: "gray.200" }}
      position={"relative"}
    >
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
      <Td>
        {format(
          zonedTimeToUtc(report.removedAt, "America/Sao_Paulo"),
          "dd/MM/yyyy"
        )}
      </Td>
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
      <Td>
        {report.reason ? (
          <Popover placement="left-start">
            <PopoverTrigger>
              <IconButton
                color={"primary.700"}
                aria-label="Ver motivo"
                icon={<HiOutlineEye />}
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverHeader>
                <Heading as={"h5"} fontSize={"md"} color={"primary.500"}>
                  {user.name} {user.lastName}
                </Heading>
              </PopoverHeader>
              <PopoverBody py={"2"}>
                <VStack spacing={"2"} alignItems={"start"}>
                  {remover ? (
                    <Text color={"secondary.600"} fontWeight={500}>
                      Segundo {remover.name}:{" "}
                    </Text>
                  ) : null}
                  <Text>{report.reason}</Text>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          "Não informado"
        )}
      </Td>
    </Tr>
  );
};
