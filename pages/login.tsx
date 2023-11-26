import React, { ReactElement } from "react";
import { PasswordField } from "@/components/Form/PasswordField";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import NextLink from "next/link";
import { NextPageWithLayout } from "./_app";
import { TextInput } from "@/components/Form/TextInput";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { useAppToast } from "@/hooks/useAppToast";

const Login: NextPageWithLayout = () => {
  interface LoginPayload {
    username: string;
    password: string;
  }
  const { handleSubmit, register } = useForm<LoginPayload>();

  const { toastError } = useAppToast();
  const { login } = useAuth();

  const { mutate, isLoading } = useMutation(login, {
    onError() {
      toastError({
        title: "Ocorreu um erro",
        message: "Usuário ou senha incorretos",
      });
    },
  });

  const onSubmit = async (data: LoginPayload) => {
    mutate(data);
  };

  return (
    <>
      <Head>
        <title>Login - Comunif</title>
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
                <Heading size={{ base: "xs", md: "sm" }}>Faça login</Heading>
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
                    <FormLabel htmlFor="email">Username</FormLabel>
                    <TextInput register={register("username")} type="text" />
                  </FormControl>
                  <PasswordField label="Senha:" {...register("password")} />
                </Stack>
                <Link
                  fontSize={"sm"}
                  textAlign={"right"}
                  as={NextLink}
                  href="/confirmar-email"
                  color={"secondary.500"}
                  textDecoration={"underline"}
                >
                  Esqueceu sua senha?
                </Link>
                <HStack justify="space-between">
                  <Checkbox defaultChecked>Lembrar de mim</Checkbox>
                </HStack>
              </Stack>
            </Box>
            <Stack spacing="6">
              <Button
                isLoading={isLoading}
                type="submit"
                variant="solid"
                colorScheme="primary"
              >
                Login
              </Button>
            </Stack>
          </Stack>
        </form>
      </Container>
    </>
  );
};

Login.getLayout = (page: ReactElement) => {
  return <>{page}</>;
};

export default Login;
