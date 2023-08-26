import { User } from "@/models/User";
import {
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { MemberItem } from "./MemberItem";

interface Props {
  members?: User[];
  total?: number;
}

export const MembersList: React.FC<Props> = ({ members, total }) => {
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
        {members?.map((member) => (
          <GridItem key={member.id} maxH={"lg"}>
            <MemberItem user={member} />
          </GridItem>
        ))}
      </Grid>
      <Text color={"primary.700"}>
        {total} usuários são membros desta comunidade
      </Text>
    </VStack>
  );
};
