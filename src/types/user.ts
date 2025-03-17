import { Role } from "@/types/role";
export type User = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  profilepic: string;
  roleId: string;
  role: Role;
  createdat: string;
  updatedat: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data: User;
};
