import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

declare global {
    interface Window {
        Buffer: typeof Buffer;
    }
} 