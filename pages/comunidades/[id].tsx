import { Chat } from "@/components/chat/Chat";
import { LinksList } from "@/components/common/LinksList";
import { socket } from "@/config/socket";
import { CommunityChannel } from "@/models/CommunityChannel";
import { SendMessagePayload } from "@/models/Form/Chat/SendMessage";
import { Message } from "@/models/Message";
import { getCommunity } from "@/services/community-requests";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  HStack,
  Heading,
  Image,
  ScaleFade,
  SlideFade,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DehydratedState,
  QueryClient,
  dehydrate,
  useQuery,
} from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  dehydratedState?: DehydratedState;
}

const Comunidade: NextPage<Props> = () => {
  const router = useRouter();
  const [selectedChannel, setSelectedChannel] =
    useState<CommunityChannel | null>(null);
  const showChat = !!selectedChannel;
  const [messages, setMessages] = useState<Message[]>([]);
  const communityId = router.query.id;
  const { data: community } = useQuery(["community", communityId], () =>
    getCommunity(Number(communityId))
  );

  const connectChannel = (channel: CommunityChannel) => {
    socket.connect();
    setSelectedChannel(channel);
    const payload = { communityChannelId: channel.id };
    socket.emit("join-channel", payload, (messages: Message[]) => {
      setMessages(messages);
    });
  };

  useEffect(() => {
    const onMessage = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };
    socket.on("message-channel", onMessage);
    return () => {
      socket.off("message-channel", onMessage);
    };
  }, []);
  const onSendMessage = (message: SendMessagePayload) => {
    socket.emit("message-channel", message);
  };
  const channels = community?.communityChannels;
  const channelsLength = channels?.length;

  return (
    <Box as="main" h={"80vh"}>
      <VStack spacing={5} align={"start"} h={"full"}>
        <Breadcrumb separator={">"} color="secondary.200">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="/comunidades">Comunidades</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem color={"secondary.500"} isCurrentPage>
            <BreadcrumbLink href={"#"}>{community?.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack w={"full"} alignItems={"start"} h={"full"} spacing={5}>
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
                {showChat ? "sim" : "não"}
                Total de <strong>{channelsLength}</strong>{" "}
                {channelsLength === 1 ? "Canal" : "Canais"} de comunicação
              </Text>
            </VStack>
          </VStack>
          <Box w={"40%"} maxWidth={"sm"} alignSelf={"stretch"}>
            <SlideFade
              offsetY="20px"
              style={{ width: "100%", height: "100%" }}
              in={showChat}
            >
              {showChat ? (
                <Chat
                  onSendMessage={onSendMessage}
                  targetId={selectedChannel.id ?? 0}
                  chatName={selectedChannel.channelType.name ?? "chat"}
                  onClickOut={() => {
                    socket.disconnect();
                    setSelectedChannel(null);
                  }}
                  messages={messages}
                />
              ) : (
                <></>
              )}
            </SlideFade>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  try {
    const communityId = ctx.params?.id ?? "0";
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(["community", communityId], () =>
      getCommunity(Number(communityId), ctx)
    );
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      } as Props,
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default Comunidade;
