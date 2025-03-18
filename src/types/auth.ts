import { LoginCredentials } from "./user";

export type SignupCredentials = LoginCredentials & {
  username: string;
};
