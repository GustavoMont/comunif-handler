import { useAuth } from "@/context/AuthContext";
import { Message as IMessage } from "@/models/Message";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  message: IMessage;
}

export const Message: React.FC<Props> = ({ message }) => {
  const messageUser = message.user;
  const { user } = useAuth();
  const isCurrentUser = user?.id === message.userId;
  return (
    <Flex
      gap={"1.5"}
      direction={"column"}
      alignSelf={isCurrentUser ? "self-end" : "self-start"}
    >
      <Flex gap={"2"} flexDirection={isCurrentUser ? "row-reverse" : "row"}>
        <Avatar
          bg={"primary.500"}
          size={"xs"}
          name={messageUser.name}
          src={messageUser.avatar || ""}
        />
        <Text>
          {messageUser.name} {messageUser.lastName.at(0)}.
        </Text>
      </Flex>
      <Box
        ml={"1"}
        p={"2"}
        borderRadius={isCurrentUser ? "8px 0px 16px 18px" : "0px 4px 4px 16px"}
        bg={"primary.400"}
      >
        <Text>{message.content}</Text>
      </Box>
    </Flex>
  );
};
