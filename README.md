# NGO ResourceLink

React/Vite frontend for NGO resource coordination. All interactions run locally in the browser; this project does not require an API or database.

## Run the frontend

Requirements: Node.js 20 or newer.

```powershell
npm install
npm run dev
```

Open `http://localhost:5173` and choose **Continue with local NGO preview** or **Continue with local admin preview**. Sample registrations, document names, review decisions, transfers, messages, and resource changes stay in memory and reset when the app is refreshed. The preview does not authenticate users or send requests to a server.

The directory shows the included NGOs as verified, per the project brief. Confirm current credentials, availability, and delivery details directly before coordinating aid. Shortage analysis is a transparent local rules check, not a live forecast or trained AI model.

## Checks

```powershell
npm run build
npm run lint
```
