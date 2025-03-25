import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { utf8ToBytes, bytesToUtf8 } from "@noble/ciphers/utils";
import { randomBytes } from "@noble/ciphers/webcrypto";

export interface EncryptedData {
  ciphertext: Uint8Array;
  nonce: Uint8Array;
}

export interface Encryption {
  encrypt: (plaintext: string) => EncryptedData;
  decrypt: (data: EncryptedData) => string;
}

export function createEncryption(key: string): Encryption {
  // Create a consistent key from the provided string
  const keyBytes = utf8ToBytes(key.padEnd(32, "0").slice(0, 32));

  return {
    encrypt: (plaintext: string): EncryptedData => {
      const nonce = randomBytes(24); // XChaCha20 uses 24-byte nonces
      const data = utf8ToBytes(plaintext);

      const cipher = xchacha20poly1305(keyBytes, nonce);
      const ciphertext = cipher.encrypt(data);

      return { ciphertext, nonce };
    },

    decrypt: (data: EncryptedData): string => {
      const { ciphertext, nonce } = data;
      const cipher = xchacha20poly1305(keyBytes, nonce);
      const plaintext = cipher.decrypt(ciphertext);

      return bytesToUtf8(plaintext);
    },
  };
}
