import { Button, Flex, Heading, Stack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { FiPlus } from "react-icons/fi";

interface Props {
  title: string;
  generateNewStats(...params: unknown[]): void;
  isGenerating?: boolean;
}

export const ChartPanelContainer: React.FC<PropsWithChildren<Props>> = ({
  title,
  children,
  generateNewStats,
  isGenerating,
}) => {
  return (
    <Stack w={"min-content"} overflowX={"auto"} spacing={5}>
      <Heading as={"h4"} color={"secondary.500"} fontSize={"2xl"}>
        {title}
      </Heading>
      <Flex direction={"column"}>
        {children}
        <Button
          onClick={generateNewStats}
          alignSelf={"end"}
          colorScheme="primary"
          leftIcon={<FiPlus />}
          isLoading={isGenerating}
        >
          Nova estatística
        </Button>
      </Flex>
    </Stack>
  );
};
