import { PasswordField } from "@/components/Form/PasswordField";
import { useAppToast } from "@/hooks/useAppToast";
import { ChangePasswordBody, changePassword } from "@/services/auth-requests";
import { ApiErrorHandler } from "@/utils/ApiError";
import { deleteTokens, getToken } from "@/utils/auth";
import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { NextPageWithLayout } from "../_app";

const ChangePassword: NextPageWithLayout = () => {
  const { toastError, toastSuccess } = useAppToast();
  const router = useRouter();
  const { handleSubmit, register } = useForm<ChangePasswordBody>();
  const onChangePassword = async (data: ChangePasswordBody) => {
    await changePassword(data);
  };
  const { isLoading, mutate } = useMutation(onChangePassword, {
    onSuccess() {
      toastSuccess({
        title: "Senha alterada com sucesso",
      });
      deleteTokens();
      router.push("/login");
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        title: apiError.title,
        message: apiError.message,
      });
    },
  });
  const onSubmit = (data: ChangePasswordBody) => {
    mutate(data);
  };
  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
      border={"Background"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading color={"primary.500"} size={{ base: "sm", md: "lg" }}>
                Redefinir senha
              </Heading>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={{ base: "transparent", sm: "bg-surface" }}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "xl" }}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <PasswordField label="Senha:" {...register("password")} />
                </FormControl>
                <FormControl>
                  <PasswordField
                    label="Confirmar senha:"
                    {...register("confirmPassword")}
                  />
                </FormControl>
              </Stack>
              <Button isLoading={isLoading} type="submit" colorScheme="primary">
                Redefinir senha
              </Button>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const accessToken = getToken(ctx);
  if (accessToken) {
    return {
      props: {},
    };
  }
  return {
    redirect: {
      destination: "/login",
      permanent: true,
    },
  };
};

ChangePassword.getLayout = (page: ReactElement) => {
  return <>{page}</>;
};

export default ChangePassword;
