import { Box, Input, InputProps, Text } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputProps {
  label?: string;
  register?: UseFormRegisterReturn;
}

export const TextInput: React.FC<Props> = ({
  label,
  register,
  colorScheme,
  ...props
}) => {
  return (
    <Box>
      {label && <Text mb={1}>{label}</Text>}
      <Input
        borderColor={`${colorScheme}.400`}
        focusBorderColor={`${colorScheme}.500`}
        {...props}
        {...register}
      />
    </Box>
  );
};
