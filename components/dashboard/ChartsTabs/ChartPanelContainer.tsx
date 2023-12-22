import { Button, Flex, Heading, Spinner, Stack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { FiPlus } from "react-icons/fi";

interface Props {
  title: string;
  generateNewStats(...params: unknown[]): void;
  isGenerating?: boolean;
  isLoading?: boolean;
}

export const ChartPanelContainer: React.FC<PropsWithChildren<Props>> = ({
  title,
  children,
  generateNewStats,
  isGenerating,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} minH={"sm"} w="sm">
        <Spinner size={"xl"} color="secondary.500" />;
      </Flex>
    );
  }

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
