import { Message as IMessage } from "@/models/Message";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  VStack,
  useToken,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { HiPaperAirplane, HiXCircle } from "react-icons/hi";
import { Message } from "./Message";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { SendMessagePayload } from "@/models/Form/Chat/SendMessage";
import { useInView } from "react-intersection-observer";

interface Props {
  messages: IMessage[];
  chatName: string;
  onClickOut(): void;
  onSendMessage(data: SendMessagePayload): void;
  targetId: number;
  onReachTop(): void;
  isLoadingMoreMessages: boolean;
}

export const Chat: React.FC<Props> = ({
  messages,
  chatName = "chat",
  onClickOut,
  onSendMessage,
  targetId,
  isLoadingMoreMessages,
  onReachTop,
}) => {
  const { user } = useAuth();
  const messageListRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, resetField, watch } =
    useForm<SendMessagePayload>({
      defaultValues: {
        communityChannelId: targetId,
        userId: user?.id,
        content: "",
      },
    });
  const content = watch("content");
  const { ref, inView } = useInView();

  const onSubmit = (data: SendMessagePayload) => {
    resetField("content");
    onSendMessage(data);
  };
  useEffect(() => {
    if (inView) {
      onReachTop();
    }
  }, [inView, onReachTop]);
  // useEffect(() => {
  //   const list = messageListRef.current;
  //   const onScroll = () => {
  //     if (!list) return;
  //     const scrollHeight = list.scrollHeight;
  //     const scrollTop = list.scrollTop;
  //     const shouldRunCallback = scrollTop / scrollHeight <= -0.7;

  //     if (shouldRunCallback && !isLoadingMoreMessages) {
  //       onReachTop();
  //     }
  //   };

  //   if (list) {
  //     list.addEventListener("scroll", onScroll);
  //   }

  //   return () => {
  //     list?.removeEventListener("scroll", onScroll);
  //   };
  // }, [isLoadingMoreMessages, onReachTop]);

  const [white] = useToken("colors", ["white"]);
  return (
    <VStack
      border={"3px solid black"}
      h={"full"}
      borderRadius={"2xl"}
      overflow={"hidden"}
      bg={"white"}
    >
      <HStack p={"5"} w={"full"} bg={"primary.700"}>
        <IconButton
          onClick={onClickOut}
          colorScheme="secondary"
          bg={"transparent"}
          aria-label="Sair do chat"
          icon={<HiXCircle color={white} size={"20"} />}
        />
        <Text color={"white"}>{chatName}</Text>
      </HStack>

      <Flex
        overflowY={"auto"}
        gap={"4"}
        ref={messageListRef}
        flexDirection={"column-reverse"}
        flex={1}
        w={"full"}
        px={"4"}
      >
        {messages.map((message) => (
          <Message message={message} key={message.id} />
        ))}
        <Flex
          ref={ref}
          overflow={"hidden"}
          height={isLoadingMoreMessages ? "-moz-min-content" : 0}
          w={"full"}
          justify={"center"}
        >
          <Spinner size={"lg"} />
        </Flex>
      </Flex>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack w={"full"} spacing={"1"} px={"1"}>
          <Input
            {...register("content", {
              required: "Insira uma mensagem",
            })}
            borderColor={"gray.400"}
            bg={"white"}
            placeholder="Enviar mensagem"
            borderRadius={"md"}
          />
          <IconButton
            disabled={!content}
            type="submit"
            aria-label="Enviar mensagem"
            colorScheme="primary"
            icon={
              <HiPaperAirplane
                style={{ transform: "rotate(90deg)" }}
                color={white}
              />
            }
          />
        </HStack>
      </form>
      <Box h={"14"} bg={"black"} w={"full"} />
    </VStack>
  );
};
