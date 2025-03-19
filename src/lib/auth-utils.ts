import { User } from "@/types/user";

import { ServerUser } from "@/types/user";

export const unprotectedRoutes = ["/auth/login", "/auth/signup"];

export function needToAccessAuthRoutes(
  pathname: string,
  authenticated: boolean
) {
  return authenticated && unprotectedRoutes.includes(pathname.slice(1));
}

export function transformToClientUser (serverUser: ServerUser): User {
 return {
  id: serverUser.id,
  username: serverUser.username,
  email: serverUser.email,
  role: serverUser.role,
  roleId: serverUser.role_id,
  firstname: serverUser.first_name,
  lastname: serverUser.last_name,
  profilepic: serverUser.profile_pic,
  createdAt: serverUser.created_at,
  updatedAt: serverUser.updated_at,
  publicKey: serverUser.public_key,
 }
}