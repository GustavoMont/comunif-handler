import { Community, UpdateCommunity } from "@/models/Community";
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../Form/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommunity } from "@/services/community-requests";

interface Props {
  onClose(): void;
  isOpen: boolean;
  community: Community;
}

export const EditCommunityModal: React.FC<Props> = ({
  isOpen,
  onClose,
  community,
}) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { register, handleSubmit, reset } = useForm<UpdateCommunity>({
    defaultValues: {
      banner: community.banner,
      isActive: community.isActive,
      name: community.name,
    },
  });
  const onSubmit = async (data: UpdateCommunity) => {
    update(data);
  };
  const updateCurrentCommunity = async (data: UpdateCommunity) =>
    updateCommunity(community.id, data);
  const { mutate: update, isLoading } = useMutation(updateCurrentCommunity, {
    onSuccess(data) {
      reset({
        banner: data.banner,
        isActive: data.isActive,
        name: data.name,
      });
      queryClient.removeQueries(["communities"]);
      onClose();
      return queryClient.invalidateQueries([
        "community",
        community.id.toString(),
      ]);
    },
    onError() {
      toast({
        position: "top",
        title: "Ocorreu um erro",
        description: `Não foi editar a comunidade ${community.name}`,
        colorScheme: "red",
      });
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent alignSelf={"center"}>
        <ModalHeader>Editar Comunidade</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Flex flexDirection={"column"} gap={5}>
              <TextInput register={register("name")} label="Nome:" />
              <Flex gap={2}>
                <Checkbox colorScheme="primary" {...register("isActive")}>
                  Ativa
                </Checkbox>
              </Flex>
              <Input
                size="md"
                type="file"
                alignItems={"center"}
                {...register("banner")}
                bg={"primary"}
              />
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading} colorScheme="primary">
              Confirmar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
