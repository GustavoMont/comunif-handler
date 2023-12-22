import { socket } from "@/config/socket";
import { Community } from "@/models/Community";
import { CommunityChannel } from "@/models/CommunityChannel";
import {
  Box,
  Divider,
  HStack,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { LinksList } from "../common/LinksList";
import { Message } from "@/models/Message";
import { User } from "@/models/User";
import { HiPencil, HiTrash } from "react-icons/hi";
import { EditCommunityModal } from "./EditCommunityModal";
import { ListResponse } from "@/models/Api";
import { MembersList } from "../user/MembersList";
import { DeleteCommunityModal } from "./DeleteCommunityModal";
import { v4 } from "uuid";

type MembersInfo = {
  members?: ListResponse<User>;
  isLoading?: boolean;
};

interface CommunityInfoProps {
  community?: Community;
  isLoading?: boolean;
  onSelectChannel(channel: CommunityChannel): void;
  onGetMessages(messages: Message[]): void;
  membersInfo: MembersInfo;
}

export const CommunityInfo: React.FC<CommunityInfoProps> = ({
  community,
  isLoading,
  onSelectChannel,
  onGetMessages,
  membersInfo,
}) => {
  const { isLoading: isLoadingMembers, members } = membersInfo;
  const {
    isOpen: isOpenEditing,
    onOpen: onOpenEditing,
    onClose: onCloseEditing,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const channels = community?.communityChannels;
  const channelsLength = channels?.length;
  const connectChannel = (channel: CommunityChannel) => {
    socket.connect();
    onSelectChannel(channel);
    const payload = { communityChannelId: channel.id };
    socket.emit("join-channel", payload, (messages: Message[]) => {
      onGetMessages(messages);
    });
  };
  const isActive = community?.isActive;

  return (
    <>
      {community ? (
        <>
          <EditCommunityModal
            community={community}
            isOpen={isOpenEditing}
            onClose={onCloseEditing}
          />
          <DeleteCommunityModal
            community={community}
            isOpen={isOpenDelete}
            onClose={onCloseDelete}
          />
        </>
      ) : null}

      <Skeleton isLoaded={!isLoading}>
        <Box>
          <Image
            alignSelf={"flex-start"}
            src={community?.banner ?? ""}
            alt={`Comunidade ${community?.name}`}
            fallbackSrc="https://via.placeholder.com/150"
            boxSize={"sm"}
            objectFit={"contain"}
            borderRadius="lg"
          />
        </Box>
      </Skeleton>
      <VStack flex={1} alignItems={"start"}>
        <HStack>
          <Skeleton isLoaded={!isLoading}>
            <Heading as={"h2"} color={"primary.500"}>
              {community?.name ?? "comunidade"}
            </Heading>
          </Skeleton>
          <IconButton
            onClick={onOpenEditing}
            color={"primary.400"}
            aria-label="Editar"
            icon={<HiPencil />}
          />
          <IconButton
            onClick={onOpenDelete}
            color={"red.500"}
            aria-label="Deletar"
            icon={<HiTrash />}
          />
        </HStack>
        <Skeleton isLoaded={!isLoading}>
          <Text color={isActive ? "primary.700" : "red.500"}>
            Comunidade {isActive ? "" : "não"} ativa
          </Text>
        </Skeleton>
        <Divider borderColor={"primary.300"} />
        <VStack alignItems={"start"}>
          <Heading as={"h4"} fontSize={"lg"} color={"secondary.400"}>
            Canais de comunicação
          </Heading>
          {isLoading ? (
            <Stack spacing={"4"}>
              {Array.from({ length: 4 }).map(() => (
                <Skeleton h={"2"} w={"32"} rounded={"full"} key={v4()} />
              ))}
            </Stack>
          ) : (
            <LinksList
              name={"name"}
              keyName="id"
              source={channels?.map(({ channelType }) => channelType) ?? []}
              hrefs={
                channels?.map((channel) => ({
                  onClick() {
                    connectChannel(channel);
                  },
                })) ?? []
              }
            />
          )}

          <Text color={"secondary.300"}>
            Total de{" "}
            {isLoadingMembers ? (
              <Skeleton
                w={"4"}
                h={"4"}
                rounded={"full"}
                as={"span"}
                display={"inline-block"}
              />
            ) : (
              <strong>{channelsLength}</strong>
            )}{" "}
            {channelsLength === 1 ? "Canal" : "Canais"} de comunicação
          </Text>
          <Divider borderColor={"primary.300"} w={"full"} />

          <MembersList
            isLoading={isLoadingMembers}
            community={community}
            members={members?.results}
            total={members?.meta.total}
          />
        </VStack>
      </VStack>
    </>
  );
};
