import { STAFF_ROLES } from "@/constants/users.constants";
import { RoleEnum } from "@/models/User";
import { handleRoleName } from "@/utils/handleRoleName";
import { Tag, TagLabel, TagProps } from "@chakra-ui/react";
import React from "react";

interface Props extends TagProps {
  role?: RoleEnum;
}

export const RoleLabel: React.FC<Props> = ({ role, ...props }) => {
  const isStaff = role ? STAFF_ROLES.includes(role) : false;
  return (
    <Tag
      {...props}
      rounded="full"
      colorScheme={isStaff ? "orange" : "primary"}
      py={"2"}
      px={"5"}
    >
      <TagLabel>{handleRoleName(role)}</TagLabel>
    </Tag>
  );
};
