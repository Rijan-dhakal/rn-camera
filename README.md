# RN-Cam

A cross-platform camera application built with React Native and Expo as a learning project to explore mobile development fundamentals.

## Features

- Capture photos using device camera
- Record videos
- Switch between front and back cameras
- Media gallery with grid layout
- Video playback with native controls
- Save media to device gallery
- Delete captured media
- Separate preview screens for photos and videos

## Tech Stack

- React Native
- Expo SDK
- TypeScript
- Expo Router (file-based routing)
- Expo Camera
- Expo Video
- Expo Media Library
- Expo File System

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on physical devices)

## Installation

1. Clone the repository

```bash
git clone https://github.com/Rijan-dhakal/rn-camera.git
cd rn-camera
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm start
```

4. Run on device

- Scan the QR code with Expo Go app (Android/iOS)
- Or press 'a' for Android emulator
- Or press 'i' for iOS simulator

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx       # Root layout
│   ├── index.tsx         # Home screen with media gallery
│   ├── camera.tsx        # Camera screen
│   └── [name].tsx        # Media detail screen
├── components/           # Reusable components
└── utils/
    └── media.ts          # Media type utilities
```

## Permissions

The app requires the following permissions:

- Camera access
- Microphone access (for video recording)
- Media library access (for saving files)
