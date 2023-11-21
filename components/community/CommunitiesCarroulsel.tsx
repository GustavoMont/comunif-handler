import { Community } from "@/models/Community";
import { HStack } from "@chakra-ui/react";
import React from "react";
import { CommunityCarroulselItem } from "./CommunityCarroulselItem";

interface Props {
  communities: Community[];
}

export const CommunitiesCarroulsel: React.FC<Props> = ({ communities }) => {
  return (
    <HStack pb={"4"} overflowX={"auto"} spacing={5} as={"ul"}>
      {communities.map((community) => (
        <CommunityCarroulselItem community={community} key={community.id} />
      ))}
    </HStack>
  );
};
