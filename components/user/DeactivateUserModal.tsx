import { useAppToast } from "@/hooks/useAppToast";
import { User } from "@/models/User";
import { DeactivateBody, deactivateUser } from "@/services/user-requests";
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
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";

interface Props {
  isOpen: boolean;
  onClose(): void;
  user?: User;
}

export const DeactivateUserModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { register, handleSubmit } = useForm<DeactivateBody>();
  const { toastSuccess, toastError } = useAppToast();
  const queryClient = useQueryClient();
  const handleDeactivate = async (data: DeactivateBody) => {
    if (user) {
      await deactivateUser(user.id, data);
    }
  };
  const { mutate: onDeactivate, isLoading } = useMutation(handleDeactivate, {
    onSuccess() {
      queryClient.removeQueries(["users"]);
      toastSuccess({
        title: "Conta desativado com sucesso",
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
        <ModalHeader paddingTop={"8"} color={"red.500"}>
          Tem certeza que deseja desativar a conta do {user?.name}{" "}
          {user?.lastName}?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            O usuário será notificado por e-mail e não poderá mais acessar o
            aplicativo nem a plataforma.
          </Text>
          <Stack>
            <label htmlFor="reason">
              <Text>Motivo:</Text>
            </label>
            <Textarea
              id="reason"
              {...register("reason", {
                required: "É obrigatório informar o motivo",
              })}
            />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          {user ? (
            <Button
              isLoading={isLoading}
              onClick={handleSubmit((data) => onDeactivate(data))}
              colorScheme="red"
            >
              Desativar
            </Button>
          ) : null}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
