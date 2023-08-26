import { Community } from "@/models/Community";
import { deleteCommunity } from "@/services/community-requests";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose(): void;
  community: Community;
}

export const DeleteCommunityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  community,
}) => {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(deleteCommunity, {
    onSuccess() {
      queryClient.removeQueries(["communities"]);
      toast({
        colorScheme: "green",
        title: "Comunidade excluída com sucesso",
        position: "top",
      });
      router.push("/comunidades");
    },
    onError() {
      toast({
        colorScheme: "red",
        title: "Ocorreu um erro",
        position: "top",
        description: "Não foi possível excluir comunidade",
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignSelf={"center"}>
        <ModalHeader color={"red.500"}>
          Tem certeza que deseja excluir a comunidade?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Os usuários não conseguiram mais acessar essa comunidade nem mandar
            mensagem para essa comunidade.
          </Text>
          <Text fontWeight={"bold"}>A ação não poderá ser desfeita!</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            isLoading={isLoading}
            onClick={() => mutate(community.id)}
            colorScheme="red"
          >
            Excluir
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
