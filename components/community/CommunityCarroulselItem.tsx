import { Community } from "@/models/Community";
import { Avatar, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  community: Community;
}

export const CommunityCarroulselItem: React.FC<Props> = ({ community }) => {
  return (
    <Stack alignItems={"center"} as={"li"}>
      <Avatar src={community.banner ?? ""} name={community.name} />
      <Text>{community.name}</Text>
    </Stack>
  );
};
