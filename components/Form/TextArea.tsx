import { Flex, Stack, Text, Textarea, TextareaProps } from "@chakra-ui/react";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends TextareaProps {
  register?: UseFormRegisterReturn;
  label?: string;
  error?: string;
}

export const TextArea: React.FC<Props> = ({
  register,
  label,
  error,
  colorScheme = "primary",
  ...props
}) => {
  return (
    <Stack spacing={"2"}>
      <Flex flexDirection={"column"} gap={"0.5"}>
        {label ? (
          <Text fontWeight={"bold"} color={"gray.600"}>
            {label}
          </Text>
        ) : null}
        <Textarea
          focusBorderColor={`${colorScheme}.500`}
          color={"gray.800"}
          {...props}
          {...register}
        />
      </Flex>
      {error ? (
        <small>
          <Text color={"red.500"}>{error}</Text>
        </small>
      ) : null}
    </Stack>
  );
};
