import { CreateCommunity } from "@/models/Community";
import { createCommunity } from "@/services/community-requests";
import {
  Box,
  Button,
  Input,
  Stack,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import { TextInput } from "../Form/TextInput";

export const AddCommunity: React.FC = () => {
  const toast = useToast();

  const [formOpened, { toggle, off }] = useBoolean();
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
      toast({
        position: "top",
        title: "Comunidade criada com sucesso",
        colorScheme: "green",
        icon: <FiCheck size={"24"} />,
      });
    },
    onError() {
      toast({
        position: "top",
        title: "Ocorreu um erro",
        description: "Não foi possível criar comunidade",
        colorScheme: "red",
      });
    },
  });
  const size = "16";

  return (
    <Stack spacing={5}>
      <Button
        onClick={toggle}
        leftIcon={formOpened ? <FiX {...{ size }} /> : <FiPlus {...{ size }} />}
        w={"full"}
        colorScheme={formOpened ? "secondary" : "primary"}
      >
        {formOpened ? "Fechar" : "Criar comunidade"}
      </Button>

      {formOpened && (
        <Box>
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
        </Box>
      )}
    </Stack>
  );
};
