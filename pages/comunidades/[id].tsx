import { Chat } from "@/components/chat/Chat";
import { CommunityInfo } from "@/components/community/CommunityInfo";
import { socket } from "@/config/socket";
import { CommunityChannel } from "@/models/CommunityChannel";
import { SendMessagePayload } from "@/models/Form/Chat/SendMessage";
import { Message } from "@/models/Message";
import { getCommunity } from "@/services/community-requests";
import { listCommunityMembers } from "@/services/community-users-requests";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  SlideFade,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  DehydratedState,
  QueryClient,
  dehydrate,
  useQuery,
} from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Props {
  dehydratedState?: DehydratedState;
}

const Comunidade: NextPage<Props> = () => {
  const router = useRouter();
  const [isLargerThan1160] = useMediaQuery("(min-width: 1160px)");
  const [selectedChannel, setSelectedChannel] =
    useState<CommunityChannel | null>(null);
  const showChat = !!selectedChannel;
  const [messages, setMessages] = useState<Message[]>([]);
  const communityId = router.query.id;
  const { data: community } = useQuery(["community", communityId], () =>
    getCommunity(Number(communityId))
  );
  const { data: membersResponse } = useQuery(
    ["community-members", communityId],
    () => listCommunityMembers(Number(communityId))
  );

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

  return (
    <Box as="main">
      <VStack spacing={5} align={"start"} h={"full"}>
        <Breadcrumb separator={">"} color="secondary.200">
          <BreadcrumbItem>
            <Link passHref href="/">
              <BreadcrumbLink as={"p"}>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link passHref href="/comunidades">
              <BreadcrumbLink as={"p"}>Comunidades</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem color={"secondary.500"} isCurrentPage>
            <Link passHref href="">
              <BreadcrumbLink as={"p"}>{community?.name}</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Flex
          flexDirection={isLargerThan1160 ? "row" : "column"}
          w={"full"}
          alignItems={"start"}
          h={"full"}
          gap={5}
        >
          <CommunityInfo
            members={membersResponse}
            onGetMessages={(messages) => setMessages(messages)}
            onSelectChannel={(channel) => setSelectedChannel(channel)}
            community={community}
          />
          <Box
            w={isLargerThan1160 ? "40%" : "75%"}
            h={isLargerThan1160 ? "80vh" : "90vh"}
            top={"45%"}
            left={"50%"}
            maxWidth={"sm"}
            transform={isLargerThan1160 ? undefined : "translate(-50%, -50%)"}
            alignSelf={"stretch"}
            position={isLargerThan1160 ? "static" : "absolute"}
          >
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
        </Flex>
      </VStack>
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  try {
    const communityId = ctx.params?.id ?? "0";
    const queryClient = new QueryClient();
    await Promise.all([
      queryClient.prefetchQuery(["community", communityId], () =>
        getCommunity(Number(communityId), ctx)
      ),
      queryClient.prefetchQuery(["community-members", communityId], () =>
        listCommunityMembers(+communityId, ctx)
      ),
    ]);
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
