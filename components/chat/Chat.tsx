import { Message as IMessage } from "@/models/Message";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
  useToken,
} from "@chakra-ui/react";
import React from "react";
import { HiPaperAirplane, HiXCircle } from "react-icons/hi";
import { Message } from "./Message";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { SendMessagePayload } from "@/models/Form/Chat/SendMessage";

interface Props {
  messages: IMessage[];
  chatName: string;
  onClickOut(): void;
  onSendMessage(data: SendMessagePayload): void;
  targetId: number;
}

export const Chat: React.FC<Props> = ({
  messages,
  chatName = "chat",
  onClickOut,
  onSendMessage,
  targetId,
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, resetField, watch } =
    useForm<SendMessagePayload>({
      defaultValues: {
        communityChannelId: targetId,
        userId: user?.id,
        content: "",
      },
    });
  const content = watch("content");
  const onSubmit = (data: SendMessagePayload) => {
    resetField("content");
    onSendMessage(data);
  };
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
        overflowY={"scroll"}
        gap={"4"}
        flexDirection={"column-reverse"}
        flex={1}
        w={"full"}
        px={"4"}
      >
        {messages.map((message) => (
          <Message message={message} key={message.id} />
        ))}
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
