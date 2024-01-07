import { EvasionReport } from "@/models/EvasionReports";
import {
  IconButton,
  Link,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { format, zonedTimeToUtc } from "date-fns-tz";
import NextLink from "next/link";
import React from "react";
import { HiOutlineEye } from "react-icons/hi";
import { EvasionReasonModal } from "../EvasionReasonModal";

interface Props {
  report: EvasionReport;
}

export const EvasionReportTableRow: React.FC<Props> = ({ report }) => {
  const { user, community, remover } = report;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
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
            <IconButton
              color={"primary.700"}
              aria-label="Ver motivo"
              icon={<HiOutlineEye />}
              onClick={onOpen}
            />
          ) : (
            "Não informado"
          )}
        </Td>
      </Tr>
      <EvasionReasonModal
        user={user}
        isOpen={isOpen}
        onClose={onClose}
        reason={report.reason ?? ""}
      />
    </>
  );
};
