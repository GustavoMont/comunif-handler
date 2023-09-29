import { Box, Button, Collapse, Stack } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import { FiPlus, FiX } from "react-icons/fi";

interface Props {
  buttonText: string;
  toggle(): void;
  isOpen: boolean;
}

export const AddFormContainer: React.FC<PropsWithChildren<Props>> = ({
  children,
  buttonText,
  isOpen,
  toggle,
}) => {
  const size = "16";

  return (
    <Stack spacing={5}>
      <Button
        onClick={toggle}
        leftIcon={isOpen ? <FiX {...{ size }} /> : <FiPlus {...{ size }} />}
        w={"full"}
        colorScheme={isOpen ? "secondary" : "primary"}
      >
        {isOpen ? "Fechar" : buttonText}
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box>{children}</Box>
      </Collapse>
    </Stack>
  );
};
