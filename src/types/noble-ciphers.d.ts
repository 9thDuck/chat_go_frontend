declare module "@noble/ciphers/chacha" {
  export function xchacha20poly1305(
    key: Uint8Array,
    nonce: Uint8Array
  ): {
    encrypt(data: Uint8Array): Uint8Array;
    decrypt(data: Uint8Array): Uint8Array;
  };
}

declare module "@noble/ciphers/utils" {
  export function utf8ToBytes(str: string): Uint8Array;
  export function bytesToUtf8(bytes: Uint8Array): string;
  export function hexToBytes(hex: string): Uint8Array;
  export function bytesToHex(bytes: Uint8Array): string;
}

declare module "@noble/ciphers/webcrypto" {
  export function randomBytes(length: number): Uint8Array;
}
