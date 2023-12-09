import { Table, TableCaption, TableContainer, Tbody } from "@chakra-ui/react";
import React from "react";
import { EvasionReportTableHeader } from "./EvasionReportTableHeader";
import { EvasionReport } from "@/models/EvasionReports";
import { EvasionReportTableRow } from "./EvasionReportTableRow";

interface Props {
  reports?: EvasionReport[];
}

export const EvasionReportsTable: React.FC<Props> = ({ reports = [] }) => {
  const headers = [
    "Usuário",
    "Comunidade",
    "Foi removido",
    "Removido Por",
    "Motivo",
  ];

  return (
    <TableContainer>
      <Table colorScheme="primary" variant="simple">
        <TableCaption>
          Usuários que saíram ou foram banidos da comunidade
        </TableCaption>
        <EvasionReportTableHeader headers={headers} />
        <Tbody>
          {reports.map((report) => (
            <EvasionReportTableRow report={report} key={report.id} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
