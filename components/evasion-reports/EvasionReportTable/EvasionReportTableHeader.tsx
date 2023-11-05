import { Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";

interface Props {
  headers: string[];
}

export const EvasionReportTableHeader: React.FC<Props> = ({ headers }) => {
  return (
    <Thead>
      <Tr>
        {headers.map((text) => (
          <Th key={text} color={"secondary.400"}>
            {text}
          </Th>
        ))}
      </Tr>
    </Thead>
  );
};
