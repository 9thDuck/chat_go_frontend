import { LoginCredentials } from "./user";

export type SignupCredentials = LoginCredentials & {
  username: string;
};

export type SignupPayload = SignupCredentials & {
  publicKey: string;
  encryptionKeyId: string;
  encryptionKey: string;
};
