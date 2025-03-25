import { encrypt, decrypt, PublicKey, PrivateKey, ECIES_CONFIG } from "eciesjs";
import { bytesToHex, hexToBytes } from "@noble/ciphers/utils";

// Configure ECIES to use XChaCha20 and compressed keys
ECIES_CONFIG.ellipticCurve = "x25519";
ECIES_CONFIG.symmetricAlgorithm = "xchacha20";
// ECIES_CONFIG.isEphemeralKeyCompressed = true;
// ECIES_CONFIG.isHkdfKeyCompressed = true;

export function asymEncryptMessage(
  message: string,
  publicKeyHex: string
): string {
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);
  const encrypted = encrypt(
    PublicKey.fromHex(publicKeyHex).toBytes(),
    messageBytes
  );
  return bytesToHex(encrypted);
}

export function asymDecryptMessage(
  encryptedMessage: string,
  privateKeyHex: string
): string {
  const decoder = new TextDecoder();
  const privateKey = PrivateKey.fromHex(privateKeyHex);
  const decrypted = decrypt(privateKey.toHex(), hexToBytes(encryptedMessage));
  return decoder.decode(decrypted);
}

export function getSearchParams(paramsArray: string[]): string {
  return paramsArray
    .map((param) => {
      if (param !== "") {
        return `&${param}`;
      }
      return "";
    })
    .join("");
}
