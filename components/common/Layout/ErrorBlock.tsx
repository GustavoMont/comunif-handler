import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { FiXCircle } from "react-icons/fi";

interface Props {
  title: string;
  message: string;
}

export const ErrorBlock: React.FC<Props> = ({ message, title }) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={"red.500"}
          rounded={"50px"}
          w={"55px"}
          h={"55px"}
          textAlign="center"
        >
          <FiXCircle size={"40px"} color={"white"} />
        </Flex>
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        {title}
      </Heading>
      <Text color={"gray.500"}>{message}</Text>
    </Box>
  );
};
