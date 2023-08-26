import { User } from "@/models/User";
import { Avatar, Text, VStack } from "@chakra-ui/react";
import React from "react";

interface Props {
  user: User;
}

export const MemberItem: React.FC<Props> = ({ user }) => {
  return (
    <VStack spacing={"0"} justify={"center"} align={"center"}>
      <Avatar bg={"primary.500"} size={"md"} src={user.avatar || undefined} />
      <Text>{user.name}</Text>
    </VStack>
  );
};
