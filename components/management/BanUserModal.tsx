import { useAuth } from "@/context/AuthContext";
import { Community } from "@/models/Community";
import { User } from "@/models/User";
import {
  CreateEvasionReportBan,
  createEvasionReportBan,
} from "@/services/evasions-reportsprequests";
import {
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { TextArea } from "../Form/TextArea";
import { removeUserFromCommunity } from "@/services/community-users-requests";
import { useAppToast } from "@/hooks/useAppToast";
import { ApiErrorHandler } from "@/utils/ApiError";

interface Props {
  isOpen: boolean;
  onClose(): void;
  user: User;
  community: Community;
}

export const BanUserModal: React.FC<Props> = ({
  community,
  isOpen,
  onClose,
  user,
}) => {
  const { user: currentUser } = useAuth();
  const { toastSuccess, toastError } = useAppToast();
  const isCommunityAdmin = currentUser?.id === community.adminId;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEvasionReportBan>({
    defaultValues: {
      communityId: community.id,
      removerId: currentUser?.id,
      userId: user.id,
    },
  });
  const onBanUser = async (data: CreateEvasionReportBan) => {
    await createEvasionReportBan(data);
    await removeUserFromCommunity(data.communityId, data.userId);
  };
  const { mutate: banUser, isLoading } = useMutation(onBanUser, {
    onSuccess() {
      toastSuccess({
        title: "Usuário banido com sucesso",
        message: "O e-mail informando também foi enviado",
      });
      queryClient.invalidateQueries(["community-members", community.id]);
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        title: apiError.title,
        message: apiError.message,
      });
    },
  });
  const onSubmit = (data: CreateEvasionReportBan) => {
    banUser(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignSelf={"center"}>
        <ModalHeader paddingTop={"8"} paddingBottom={"0"} color={"red.500"}>
          Tem certeza que deseja banir o {user.name} da comunidade{" "}
          {community.name}?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingTop={"3"}>
          <Flex flexDirection={"column"} gap={4} marginBottom={"4"}>
            <Text color={"gray.600"} fontWeight={"bold"}>
              O usuário será notificado por e-mail para poder entender os
              motivos do banimento.
            </Text>
            {!isCommunityAdmin ? (
              <>
                <Divider w={"full"} borderColor={"primary.300"} />
                <Text>
                  O administrador da comunidade também será notificado por
                  e-mail
                </Text>
              </>
            ) : null}
            <Divider w={"full"} borderColor={"primary.300"} />
          </Flex>
          <Stack as={"form"} spacing={5} onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              label="Motivo"
              register={register("reason", {
                required: "É necessário informar o motivo",
                minLength: {
                  value: 10,
                  message: "Necessário detalhar um pouco mais",
                },
              })}
              error={errors.reason?.message}
            />
            <Flex gap={"4"} paddingY={"2"}>
              <Button w={"full"} colorScheme="gray" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              {user ? (
                <Button
                  type="submit"
                  isLoading={isLoading}
                  w={"full"}
                  colorScheme="red"
                >
                  Confirmar
                </Button>
              ) : null}
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
