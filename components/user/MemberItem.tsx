import { Community } from "@/models/Community";
import { User } from "@/models/User";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
  useBoolean,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { BanUserModal } from "../management/BanUserModal";

interface Props {
  user: User;
  community?: Community;
}

export const MemberItem: React.FC<Props> = ({ user, community }) => {
  const [open, setOpen] = useBoolean();

  if (!community) {
    return (
      <Box>
        <Text>Não foi possível encontrar as informações necessárias</Text>
      </Box>
    );
  }

  return (
    <>
      <BanUserModal
        community={community}
        isOpen={open}
        onClose={setOpen.off}
        user={user}
      />
      <Popover>
        <PopoverTrigger>
          <VStack
            cursor={"pointer"}
            spacing={"0"}
            justify={"center"}
            align={"center"}
          >
            <Avatar
              bg={"primary.500"}
              size={"md"}
              src={user.avatar || undefined}
            />
            <Text>{user.name}</Text>
          </VStack>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Heading as={"h4"} fontSize={"md"} color={"primary.500"}>
              {user.name} {user.lastName}
            </Heading>
          </PopoverHeader>
          <PopoverBody>
            <Flex direction={"column"} gap={4}>
              <Button
                as={Link}
                href={`/usuarios/${user.id}`}
                w={"full"}
                colorScheme="primary"
              >
                Ver Perfil
              </Button>
              <Button onClick={setOpen.on} w={"full"} colorScheme="red">
                Banir da Comunidade
              </Button>
            </Flex>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
