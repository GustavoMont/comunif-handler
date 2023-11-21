import { useAppToast } from "@/hooks/useAppToast";
import { User } from "@/models/User";
import { activateUser } from "@/services/user-requests";
import { ApiErrorHandler } from "@/utils/ApiError";
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
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface Props {
  user?: User;
  isOpen: boolean;
  onClose(): void;
}

export const ActivateUserModal: React.FC<Props> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { toastSuccess, toastError } = useAppToast();
  const queryClient = useQueryClient();

  const { mutate: onActivateUser, isLoading } = useMutation(activateUser, {
    onSuccess() {
      queryClient.removeQueries(["users"]);
      toastSuccess({
        title: "Conta do usuário reativada com sucesso",
      });
      onClose();
      return queryClient.invalidateQueries(["user", user?.id.toString()]);
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        title: apiError.title,
        message: apiError.message,
      });
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignSelf={"center"}>
        <ModalHeader paddingTop={"8"} color={"orange.500"}>
          Tem certeza que deseja ativar a conta do {user?.name} {user?.lastName}
          ?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            O usuário será notificado por e-mail e voltará a ter acesso
            liberado.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          {user ? (
            <Button
              onClick={() => onActivateUser(user.id)}
              isLoading={isLoading}
              colorScheme="yellow"
            >
              Ativar
            </Button>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
