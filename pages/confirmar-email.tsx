import React, { ReactElement } from "react";
import { NextPageWithLayout } from "./_app";
import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { TextInput } from "@/components/Form/TextInput";
import { useForm } from "react-hook-form";
import { ResetPasswordBody, resetPassword } from "@/services/auth-requests";
import { useMutation } from "@tanstack/react-query";
import { storeHashedEmail } from "@/utils/auth";
import { useRouter } from "next/router";
import { ApiErrorHandler } from "@/utils/ApiError";
import { useAppToast } from "@/hooks/useAppToast";
import Head from "next/head";

const ConfirmEmail: NextPageWithLayout = () => {
  const { handleSubmit, register } = useForm<ResetPasswordBody>();
  const onSendEmail = async (data: ResetPasswordBody) => {
    return await resetPassword(data);
  };
  const { toastError } = useAppToast();
  const router = useRouter();
  const goToCode = () => router.push("/redefinir-senha/confirmar-codigo");
  const { mutate, isLoading } = useMutation(onSendEmail, {
    onSuccess(data) {
      storeHashedEmail(data.email);
      goToCode();
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        title: apiError.title,
        message: apiError.message,
      });
    },
  });
  const onSubmit = (data: ResetPasswordBody) => {
    mutate(data);
  };
  return (
    <>
      <Head>
        <title>Confirme seu e-mail</title>
      </Head>
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
                    <TextInput
                      label="E-mail:"
                      register={register("email")}
                      type="text"
                    />
                    <Text color={"secondary.200"} fontSize={"sm"}>
                      Enviaremos um código de recuperação para seu e-mail
                    </Text>
                  </FormControl>
                </Stack>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  colorScheme="primary"
                >
                  Enviar código
                </Button>
                <Button onClick={goToCode}>Já possuo o código</Button>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Container>
    </>
  );
};

ConfirmEmail.getLayout = (page: ReactElement) => {
  return <>{page}</>;
};

export default ConfirmEmail;
