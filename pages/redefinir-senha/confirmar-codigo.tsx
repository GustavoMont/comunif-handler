import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  PinInput,
  PinInputField,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { confirmCode } from "@/services/auth-requests";
import { getHashedEmail, storeTokens } from "@/utils/auth";
import { useRouter } from "next/router";
import { useAppToast } from "@/hooks/useAppToast";
import { ApiErrorHandler } from "@/utils/ApiError";
import Head from "next/head";

const ConfirmCode: NextPageWithLayout = () => {
  const router = useRouter();
  const { toastError } = useAppToast();
  const onSendCode = async (code: string) => {
    const email = getHashedEmail();
    return await confirmCode({
      code,
      email,
    });
  };
  const { isLoading, mutate } = useMutation(onSendCode, {
    onSuccess({ access }) {
      storeTokens({ access });
      router.push("/redefinir-senha");
    },
    onError(error) {
      const apiError = new ApiErrorHandler(error);
      toastError({
        title: apiError.title,
        message: apiError.message,
      });
    },
  });
  const onComplete = (code: string) => {
    mutate(code);
  };

  return (
    <>
      <Head>
        <title>Validar código de segurança</title>
      </Head>
      <Container
        maxW="lg"
        py={{ base: "12", md: "24" }}
        px={{ base: "0", sm: "8" }}
        border={"Background"}
      >
        <form>
          <Stack spacing="8">
            <Stack spacing="6">
              <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
                <Heading color={"primary.500"} size={{ base: "sm", md: "lg" }}>
                  Insira o código de segurança
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
                <Stack spacing="5" mb={"2"}>
                  <FormControl>
                    <FormLabel>Código</FormLabel>
                    <HStack justifyContent={"space-between"}>
                      <PinInput isDisabled={isLoading} onComplete={onComplete}>
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                        <PinInputField />
                      </PinInput>
                    </HStack>
                    <Text mt={"1"} fontSize={"sm"} color={"secondary.300"}>
                      Insira o código que foi enviado no e-mail informado
                      anteriormente
                    </Text>
                  </FormControl>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </form>
      </Container>
    </>
  );
};

ConfirmCode.getLayout = (page: ReactElement) => {
  return <>{page}</>;
};

export default ConfirmCode;
