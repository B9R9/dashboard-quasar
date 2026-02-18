# React Migration Workspace

This app is the React.js migration target for the Tenant Dashboard.

## Status

Migration is in progress (incremental module-by-module migration).

- Source app: Vue 3 + Quasar (root project)
- Target app: React + Vite (`react-app/`)

## Run

```bash
cd react-app
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Current Module Scope

- Header module (notifications/messages panel logic, mock data hooks)
- Search module (input, debounce, results panel, skeleton states)

## Notes

- This folder is intentionally independent from the Quasar app.
- Migration is ongoing; feature parity is not complete yet.
