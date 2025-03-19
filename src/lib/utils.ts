import { encrypt, decrypt } from "eciesjs";

export function encryptMessage(message: string, publicKey: string) { 
    const encoder = new TextEncoder()
    const messageBytes = encoder.encode(message)
    const encrypted = encrypt(publicKey, messageBytes)
    return encrypted
}

export function decryptMessage(encrypted: Buffer<ArrayBufferLike>, privateKey: Buffer<ArrayBuffer>) {
    const decoder = new TextDecoder()
    const decrypted = decrypt(privateKey, encrypted)
    return decoder.decode(decrypted)
}