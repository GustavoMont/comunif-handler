import { socket } from "@/config/socket";
import { Community } from "@/models/Community";
import { CommunityChannel } from "@/models/CommunityChannel";
import { Box, Divider, Heading, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { LinksList } from "../common/LinksList";
import { Message } from "@/models/Message";

interface CommunityInfoProps {
  community?: Community;
  onSelectChannel(channel: CommunityChannel): void;
  onGetMessages(messages: Message[]): void;
}

export const CommunityInfo: React.FC<CommunityInfoProps> = ({
  community,
  onSelectChannel,
  onGetMessages,
}) => {
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

  return (
    <>
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
        <Heading as={"h2"} color={"primary.500"}>
          {community?.name}
        </Heading>
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
        </VStack>
      </VStack>
    </>
  );
};
