import { User } from "@/models/User";
import {
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { MemberItem } from "./MemberItem";
import { Community } from "@/models/Community";
import { v4 } from "uuid";

interface Props {
  members?: User[];
  total?: number;
  community?: Community;
  isLoading?: boolean;
}

export const MembersList: React.FC<Props> = ({
  members,
  total,
  community,
  isLoading,
}) => {
  const [isLargerThan1160] = useMediaQuery("(min-width: 1160px)");

  return (
    <VStack alignItems={"start"} spacing={"3"}>
      <Heading as={"h4"} fontSize={"lg"} color={"primary.600"}>
        Membros
      </Heading>
      <Grid
        gap={4}
        maxH={"32"}
        p={"2"}
        overflowY={"auto"}
        templateColumns={isLargerThan1160 ? "repeat(5, 1fr)" : "repeat(3, 1fr)"}
      >
        {!members?.length && isLoading
          ? Array.from({ length: 4 }).map(() => (
              <Skeleton key={v4()} w={"12"} h={"12"} rounded={"full"} />
            ))
          : members?.map((member) => (
              <Skeleton key={member.id} isLoaded={!isLoading}>
                <GridItem maxH={"lg"}>
                  <MemberItem community={community} user={member} />
                </GridItem>
              </Skeleton>
            ))}
      </Grid>
      <Text color={"primary.700"}>
        {total} usuários são membros desta comunidade
      </Text>
    </VStack>
  );
};
