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

interface CommunityInfoProps {
  community?: Community;
  onSelectChannel(channel: CommunityChannel): void;
  onGetMessages(messages: Message[]): void;
  members?: ListResponse<User>;
}

export const CommunityInfo: React.FC<CommunityInfoProps> = ({
  community,
  onSelectChannel,
  onGetMessages,
  members,
}) => {
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
      <VStack flex={1} alignItems={"start"}>
        <HStack>
          <Heading as={"h2"} color={"primary.500"}>
            {community?.name}
          </Heading>
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
        <Text color={isActive ? "primary.700" : "red.500"}>
          Comunidade {isActive ? "" : "não"} ativa
        </Text>
        <Divider borderColor={"primary.300"} />
        <VStack alignItems={"start"}>
          <Heading as={"h4"} fontSize={"lg"} color={"secondary.400"}>
            Canais de comunicação
          </Heading>
          {channels && (
            <LinksList
              name={"name"}
              keyName="id"
              source={channels.map(({ channelType }) => channelType)}
              hrefs={channels.map((channel) => ({
                onClick() {
                  connectChannel(channel);
                },
              }))}
            />
          )}

          <Text color={"secondary.300"}>
            Total de <strong>{channelsLength}</strong>{" "}
            {channelsLength === 1 ? "Canal" : "Canais"} de comunicação
          </Text>
          <Divider borderColor={"primary.300"} w={"full"} />
          {community ? (
            <MembersList
              community={community}
              members={members?.results}
              total={members?.meta.total}
            />
          ) : null}
        </VStack>
      </VStack>
    </>
  );
};
