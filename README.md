# DuckChat - Secure Messaging Platform - Frontend(WIP)

DuckChat is a modern, privacy-focused chat application with end-to-end encryption and real-time communication capabilities. Built with a TypeScript frontend and Go backend, it prioritizes security while maintaining a smooth user experience.

## Key Features

### 🔒 End-to-End Encryption

- Asymmetric encryption over the network using Ed25519 with eciesjs
- Symmetric encryption using xchacha20poly1305 from @noble/ciphers for indexeddb storage

### 💬 Real-Time Chat

- WebSocket-based message delivery
- Message history with pagination

### 📱 Offline Support

- Local message storage with encryption
- Message queue for offline sending
- Automatic sync when reconnecting

### 👥 Contact Management

- Encrypted contact requests
- Search and filter contacts

## Tech Stack

- **Frontend**: React + TypeScript, DaisyUI, TailwindCSS, Zustand, Dexiejs, React-Query, React-Hook-Form, Zod
- **Encryption**: Asymmetric Cryptography using Ed25519 with eciesjs and symmetric encryption using xchacha20poly1305 from @noble/ciphers

## Upcoming Features 🚧

### Messages

- Read receipts and delivery status
- Contact list with presence indicators

### Video Calling

- WebRTC-based peer-to-peer video calls
- End-to-end encrypted video streams
- Picture-in-picture mode for multitasking

### Peer-to-Peer File Sharing

- Direct device-to-device transfers
- Encrypted file chunks with integrity checks
- Offline file queuing system

### Mirroring offline messages using P2P to another client device

- For moving private keys, and other offline stored data to another client device

## Getting Started

1. Clone the repository
2. Setup the .env as shown in .env.example
3. Run `npm install`
4. Run `npm run dev`
