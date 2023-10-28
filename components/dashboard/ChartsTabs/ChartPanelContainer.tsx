import { Heading, Stack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";

interface Props {
  title: string;
}

export const ChartPanelContainer: React.FC<PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  return (
    <Stack overflowX={"auto"} spacing={5}>
      <Heading as={"h4"} color={"secondary.500"} fontSize={"2xl"}>
        {title}
      </Heading>
      {children}
    </Stack>
  );
};
