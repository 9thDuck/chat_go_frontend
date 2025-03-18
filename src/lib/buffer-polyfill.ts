import { Buffer } from "buffer";

// Polyfill Buffer globally
window.Buffer = Buffer;

// Add Buffer to the global type
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
} 