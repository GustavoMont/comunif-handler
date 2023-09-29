import { Stack, Text } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import React from "react";

interface Props {
  colorScheme?: "primary" | "secondary";
  disabled?: boolean;
  value: Date;
  onChange(value: Date): void;
  label?: string;
}

export const DatePicker: React.FC<Props> = ({
  colorScheme = "primary",
  value,
  disabled,
  onChange,
  label,
}) => {
  return (
    <Stack spacing={4}>
      {label ? <Text>{label}</Text> : null}
      <SingleDatepicker
        disabled={disabled}
        propsConfigs={{
          dayOfMonthBtnProps: {
            defaultBtnProps: {
              _hover: {
                backgroundColor: `${colorScheme}.500`,
              },
            },
            selectedBtnProps: {
              backgroundColor: `${colorScheme}.500`,
            },
          },
          inputProps: {
            borderColor: "gray.500",
            focusBorderColor: "primary.500",
          },
        }}
        date={value}
        onDateChange={onChange}
      />
    </Stack>
  );
};
