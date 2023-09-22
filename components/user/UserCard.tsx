import { User } from "@/models/User";
import { listUserCommunities } from "@/services/community-requests";
import {
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  user?: User;
  isLoading?: boolean;
}

export const UserCard: React.FC<Props> = ({ user, isLoading }) => {
  const { data: communities, isInitialLoading: isLoadingCommunities } =
    useQuery(
      ["user-communities", user?.id],
      () => listUserCommunities(user?.id ?? 0),
      {
        enabled: !!user?.id,
      }
    );
  return (
    <Skeleton isLoaded={!isLoading}>
      <Center py={6}>
        <Stack
          borderWidth="1px"
          borderRadius="lg"
          w={"full"}
          height={{ sm: "476px", md: "20rem" }}
          direction={{ base: "column", md: "row" }}
          bg={useColorModeValue("white", "gray.900")}
          boxShadow={"2xl"}
          padding={4}
        >
          <Flex
            borderRadius={"2xl"}
            flex={["", 1]}
            h={"240px"}
            alignSelf={{ base: "stretch", md: "center" }}
            bg="secondary.200"
          >
            <Image
              textAlign={"center"}
              display={"flex"}
              borderRadius={"3xl"}
              objectFit="cover"
              boxSize="100%"
              src={user?.avatar ?? ""}
              alt={`Foto do ${user?.name}`}
            />
          </Flex>
          <Stack
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            p={1}
            pt={2}
          >
            <Heading color={"primary.500"} fontSize={"2xl"} fontFamily={"body"}>
              {user?.name} {user?.lastName}
            </Heading>
            <Text fontWeight={600} color={"secondary.300"} size="sm" mb={4}>
              @{user?.username}
            </Text>
            <Text
              textAlign={"center"}
              color={useColorModeValue("gray.500", "gray.400")}
              px={3}
            >
              {user?.bio ?? "Usuário misterioso, não possui bio (▀̿Ĺ̯▀̿ ̿)"}
            </Text>
            <Skeleton isLoaded={!isLoadingCommunities}>
              <Text color={"gray.600"}>
                Membro de {communities?.length} comunidades
              </Text>
            </Skeleton>
            <Stack
              width={"100%"}
              mt={"2rem"}
              direction={"row"}
              padding={2}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Button
                as={Link}
                href={`/usuarios/${user?.id}`}
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                color={"white"}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                colorScheme="primary"
              >
                Perfil
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    </Skeleton>
  );
};
