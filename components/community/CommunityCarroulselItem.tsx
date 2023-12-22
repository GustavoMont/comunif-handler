import { Community } from "@/models/Community";
import { Avatar, Skeleton, Stack, Text } from "@chakra-ui/react";
import React from "react";

interface Props {
  community: Community;
  isLoading?: boolean;
}

export const CommunityCarroulselItem: React.FC<Props> = ({
  community,
  isLoading,
}) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      <Stack alignItems={"center"} as={"li"}>
        <Avatar src={community.banner ?? ""} name={community.name} />
        <Text>{community.name}</Text>
      </Stack>
    </Skeleton>
  );
};
