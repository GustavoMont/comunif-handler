import { User } from "@/models/User";
import { Button, useBoolean } from "@chakra-ui/react";
import React from "react";
import { DeactivateUserModal } from "./DeactivateUserModal";
import { HiTrash } from "react-icons/hi";
import { ActivateUserModal } from "./ActivateUserModal";

interface Props {
  user?: User;
}

export const ActivateButtonControl: React.FC<Props> = ({ user }) => {
  const [isOpen, { on, off }] = useBoolean();
  if (user?.isActive) {
    return (
      <>
        <DeactivateUserModal user={user} isOpen={isOpen} onClose={off} />
        <Button leftIcon={<HiTrash />} onClick={on} colorScheme="red">
          Desativar
        </Button>
      </>
    );
  }
  return (
    <>
      <ActivateUserModal isOpen={isOpen} onClose={off} user={user} />
      <Button onClick={on} colorScheme="yellow">
        Ativar
      </Button>
    </>
  );
};
