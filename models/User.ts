export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  username: string;
}

export enum RoleEnum {
  user = "user",
  admin = "admin",
}
