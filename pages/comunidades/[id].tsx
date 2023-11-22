import { Chat } from "@/components/chat/Chat";
import {
  BreadCrumb,
  BreadCrumbLink,
} from "@/components/common/Layout/BreadCrumb";
import { CommunityInfo } from "@/components/community/CommunityInfo";
import { socket } from "@/config/socket";
import { CommunityChannel } from "@/models/CommunityChannel";
import { SendMessagePayload } from "@/models/Form/Chat/SendMessage";
import { Message } from "@/models/Message";
import { getCommunity } from "@/services/community-requests";
import { listCommunityMembers } from "@/services/community-users-requests";
import { listMessagesByChannel } from "@/services/message-requests";
import { Box, Flex, SlideFade, VStack, useMediaQuery } from "@chakra-ui/react";
import {
  DehydratedState,
  QueryClient,
  dehydrate,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["messages", selectedChannel?.id],
    queryFn: ({ pageParam: page = 1 }) =>
      listMessagesByChannel(selectedChannel?.id ?? 0, { page }),
    getNextPageParam({ meta }) {
      return meta.page < meta.pages ? meta.page + 1 : undefined;
    },
    enabled: !!selectedChannel?.id,
  });
  const oldMessages = data?.pages.flatMap((page) => page.results) ?? [];

  const { data: membersResponse } = useQuery(
    ["community-members", Number(communityId)],
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
  const breadCrumbItems: BreadCrumbLink[] = [
    {
      href: "/comunidades",
      name: "Comunidades",
    },
    {
      href: `/comunidades/${community?.id}`,
      name: community?.name ?? "Comunidade",
      isCurrentPage: true,
    },
  ];
  return (
    <>
      <Head>
        <title>
          {selectedChannel ? `${selectedChannel.channelType.name}/` : ""}{" "}
          {community?.name} - Comunif
        </title>
      </Head>
      <Box as="main">
        <VStack spacing={5} align={"start"} h={"full"}>
          <BreadCrumb links={breadCrumbItems} />
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
                    messages={
                      messages
                        ?.filter(
                          (message) =>
                            !oldMessages.some(
                              (oldMessage) => message.id === oldMessage.id
                            )
                        )
                        .concat(oldMessages) ?? []
                    }
                    isLoadingMoreMessages={false}
                    onReachTop={() => fetchNextPage()}
                  />
                ) : (
                  <></>
                )}
              </SlideFade>
            </Box>
          </Flex>
        </VStack>
      </Box>
    </>
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
