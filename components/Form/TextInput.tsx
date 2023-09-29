import { Box, Input, InputProps, Text } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputProps {
  label?: string;
  register?: UseFormRegisterReturn;
}

export const TextInput: React.FC<Props> = ({
  label,
  register,
  colorScheme = "primary",
  ...props
}) => {
  return (
    <Box>
      {label ? (
        <Text fontWeight={"medium"} mb={1}>
          {label}
        </Text>
      ) : null}
      <Input
        borderColor={`gray.500`}
        focusBorderColor={`${colorScheme}.500`}
        {...props}
        {...register}
      />
    </Box>
  );
};
