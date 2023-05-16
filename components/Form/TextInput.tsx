import { Box, Input, InputProps, Text } from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputProps {
  label?: string;
  register?: UseFormRegisterReturn;
}

export const TextInput: React.FC<Props> = ({ label, register, ...props }) => {
  return (
    <Box>
      {label && <Text mb={1}>{label}</Text>}
      <Input {...props} {...register} />
    </Box>
  );
};
