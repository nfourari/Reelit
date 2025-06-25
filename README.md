# Shuzzy

## Application Overview

**Shuzzy** is an interactive fishing platform that lets users:

- **Explore** a map of lakes, rivers, and other bodies of water.
- **Search** for a specific fish or the types of fish found in a specific area
- **Log and share** their catches by uploading photos, notes, and tips to the community. 
- **Discover** popular fishing spots and community-posted tips.
- **Manage** personal profiles, track catch history, and follow friends.

Built as a full-stack MERN app (with a React web client and a Flutter Android app),
Shuzzy provides both browser and mobile experiences for fishing enthusiasts and beginners alike.

This repository contains a MERN (MongoDB, Express, React, Node.js) application with both web and
mobile front-ends. Below is an overview of the setup, current progress, and instructions for
getting started. 

---

## Repository Structure

```
shuzzy/
├─ backend/               # Express API server
│  ├─ server.js           # Main Express entry point
│  ├─ package.json        # Backend dependencies and scripts
│  └─ .env                # (not committed) Environment variables
├─ frontend-web/          # React + TypeScript web client
│  ├─ src/                # React source files
│  ├─ public/             # Static assets
│  ├─ package.json        # Web dependencies and scripts
│  ├─ .eslintrc.json      # ESLint + Prettier config
│  └─ vite.config.ts      # Vite build config
├─ frontend-mobile/       # Flutter + Dart Android app
│  ├─ lib/                # Dart source files
│  ├─ android/            # Android-specific project files
│  ├─ pubspec.yaml        # Flutter dependencies
│  └─ .env                # (not committed) Flutter env config
├─ .gitignore             # Files/folders to ignore in Git
└─ README.md              # This file
```

---

## Programs Used

- **Node.js & npm** (via nvm):
  - macOS: `brew install node`
  - Linux/Windows: download from [https://nodejs.org/](https://nodejs.org/)
- **Git**: for version control.
- **MongoDB**: [Atlas](https://www.mongodb.com/cloud/atlas).
- **Android Studio & SDK**: for Flutter Android builds.
- **Flutter SDK**: for mobile app front-end.
- **VS Code** (or preferred editor) with these extensions:
  - ESLint
  - Prettier
  - Flutter & Dart

