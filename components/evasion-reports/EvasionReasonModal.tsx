import { User } from "@/models/User";
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  reason: string;
  isOpen: boolean;
  onClose(): void;
  user: User;
};

export const EvasionReasonModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reason,
  user,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignSelf={"center"}>
        <ModalCloseButton />
        <ModalHeader>
          <Heading fontSize={"2xl"} color={"primary.500"} as={"h3"}>
            {user.name} {user.lastName}
          </Heading>
        </ModalHeader>
        <ModalBody>
          <Heading fontSize={"lg"} color={"secondary.500"} as={"h4"}>
            Motivo
          </Heading>
          <Text my={"5"}>{reason}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
