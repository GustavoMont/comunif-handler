import { Community } from "@/models/Community";
import { HStack, Skeleton } from "@chakra-ui/react";
import React from "react";
import { CommunityCarroulselItem } from "./CommunityCarroulselItem";
import { v4 } from "uuid";

interface Props {
  communities: Community[];
  isLoading?: boolean;
}

export const CommunitiesCarroulsel: React.FC<Props> = ({
  communities,
  isLoading,
}) => {
  return (
    <HStack pb={"4"} overflowX={"auto"} spacing={5} as={"ul"}>
      {!communities.length && isLoading
        ? Array.from({ length: 5 }).map(() => (
            <Skeleton
              isLoaded={false}
              w={"12"}
              h={"12"}
              rounded={"full"}
              key={v4()}
            />
          ))
        : communities.map((community) => (
            <CommunityCarroulselItem community={community} key={community.id} />
          ))}
    </HStack>
  );
};
