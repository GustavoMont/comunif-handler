export interface User {
  avatar: null;
  bio: null;
  email: string;
  id: number;
  lastName: string;
  name: string;
  username: string;
  role: RoleEnum;
}

export enum RoleEnum {
  user = "user",
  admin = "admin",
}
