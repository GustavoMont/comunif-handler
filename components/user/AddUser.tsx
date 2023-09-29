import { Button, Select, Stack, useBoolean } from "@chakra-ui/react";
import React from "react";
import { AddFormContainer } from "../common/Layout/Form/AddFormContainer";
import { Controller, useForm } from "react-hook-form";
import { CreateUser, createUser } from "@/services/user-requests";
import { TextInput } from "@/components/Form/TextInput";
import { RoleEnum } from "@/models/User";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorHandler } from "@/utils/ApiError";
import { DatePicker } from "../Form/DatePicker";
import { PasswordField } from "../Form/PasswordField";
import { useAppToast } from "@/hooks/useAppToast";

export const AddUser: React.FC = () => {
  const { register, handleSubmit, reset, control } = useForm<CreateUser>({
    defaultValues: {
      role: "none",
    },
  });
  const [formOpened, { toggle, off }] = useBoolean();
  const { toastError, toastSuccess } = useAppToast();
  const queryClient = useQueryClient();
  const { mutate: onCreate } = useMutation(createUser, {
    onSuccess() {
      toastSuccess({
        title: "Usuário criado com sucesso",
      });
      reset();
      off();
      return queryClient.invalidateQueries(["users"]);
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        message: apiError.message,
        title: apiError.title,
      });
    },
  });
  const onSubmit = (data: CreateUser) => {
    onCreate(data);
  };
  return (
    <AddFormContainer
      isOpen={formOpened}
      toggle={toggle}
      buttonText="Criar usuário"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <TextInput register={register("name")} label="Nome:" />
          <TextInput register={register("lastName")} label="Sobrenome:" />
          <TextInput register={register("username")} label="Username:" />
          <TextInput
            type="email"
            register={register("email")}
            label="E-mail:"
          />
          <Controller
            control={control}
            name="birthday"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label="Data de nascimento:"
                onChange={onChange}
                value={value}
              />
            )}
          />
          <PasswordField {...register("password")} label="Senha:" />
          <PasswordField
            {...register("confirmPassword")}
            label="Confirmar senha:"
          />
          <Select {...register("role")}>
            <option value={"none"} disabled>
              Selecione um cargo
            </option>
            <option value={RoleEnum.user}>usuário</option>
            <option value={RoleEnum.admin}>Administrador</option>
          </Select>
          <Button type="submit" colorScheme="primary">
            Criar usuário
          </Button>
        </Stack>
      </form>
    </AddFormContainer>
  );
};
