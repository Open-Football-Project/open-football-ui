# 🖥️ MatchInsights UI

A React-based frontend application.

## 🚀 Features

- ⚛️ Built with React and TypeScript
- 🐳 Dockerized for deployment

## 📦 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and adjust as needed — it documents every required variable (API host, mock mode, GA measurement ID, banner visibility).

```bash
cp .env.example .env
```

### 3. Run locally

```bash
npm run dev
```

### Run tests

```bash
npm test
```

## Build and Run with Docker

### 1. Build

```bash
docker build --build-arg VITE_API_HOST=https://api.example.com --build-arg VITE_USE_API_MOCK=1 -t myappimage .
```

### 2. Run locally with Docker

```bash
docker run -p 80:80 myappimage
```
