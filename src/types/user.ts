import { Role } from "@/types/role";

export type User = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  publicKey: string;
  encryptionKey: string;
  profilepic: string;
  roleId: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type UserResponse = {
  data: User;
};
