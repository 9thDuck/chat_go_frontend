import { Role } from "@/types/role";
export type User = {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  publicKey: string;
  profilepic: string;
  roleId: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type ServerUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  public_key: string;
  profile_pic: string;
  roleId: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
};


export type UserResponse = {
  data: ServerUser;
};
