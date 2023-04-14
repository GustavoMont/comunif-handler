import React from "react";
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
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  interface LoginPayload {
    username: string;
    password: string;
  }
  const { handleSubmit, register } = useForm<LoginPayload>();
  const toast = useToast();
  const { login } = useAuth();
  const onSubmit = async (data: LoginPayload) => {
    try {
      console.log(login);

      await login(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message);

      toast({
        colorScheme: "red",
        title: "Ocorreu um erro",
        description: "Usuário ou senha incorretos",
        duration: 3000,
      });
    }
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
              <Heading size={{ base: "xs", md: "sm" }}>
                Log in to your account
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
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...register("username")} type="text" />
                </FormControl>
                <PasswordField {...register("password")} />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
              </HStack>
            </Stack>
          </Box>
          <Stack spacing="6">
            <Button type="submit" variant="solid" backgroundColor={"primary"}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
}
