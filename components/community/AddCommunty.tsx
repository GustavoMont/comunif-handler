import { CreateCommunity } from "@/models/Community";
import { createCommunity } from "@/services/community-requests";
import { Button, Input, Stack, useBoolean } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TextInput } from "../Form/TextInput";
import { AddFormContainer } from "../common/Layout/Form/AddFormContainer";
import { useAppToast } from "@/hooks/useAppToast";
import { ApiErrorHandler } from "@/utils/ApiError";

export const AddCommunity: React.FC = () => {
  const { toastError, toastSuccess } = useAppToast();
  const [isOpened, { toggle, off }] = useBoolean();
  const { register, handleSubmit, reset } = useForm<CreateCommunity>();
  const onSubmit = async ({ banner, name, subject }: CreateCommunity) => {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("subject", subject);
    const file = banner.item(0);
    !!file && formData.set("banner", file);
    await createCommunity(formData);
  };
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(handleSubmit(onSubmit), {
    onSuccess() {
      queryClient.invalidateQueries();
      reset();
      off();
      toastSuccess({
        title: "Comunidade criada com sucesso",
      });
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
    <AddFormContainer
      isOpen={isOpened}
      toggle={toggle}
      buttonText="Cria comunidades"
    >
      <form onSubmit={mutate}>
        <Stack spacing={5}>
          <TextInput label="Nome:" register={register("name")} />
          <TextInput label="Assunto:" register={register("subject")} />
          <Input size="md" type="file" {...register("banner")} />
          <Button isLoading={isLoading} colorScheme="primary" type="submit">
            Criar
          </Button>
        </Stack>
      </form>
    </AddFormContainer>
  );
};
