import { RoleEnum } from "@/models/User";

export const handleRoleName = (role?: RoleEnum) => {
  switch (role) {
    case RoleEnum.admin:
      return "Admin";

    default:
      return "Usuário";
  }
};
