# Harbor frontend

React + Vite frontend for the rental ERP shell. The UI uses a session-only login state and requests live data from `/api/v1`; it does not seed mock data or persist credentials in local storage.

```bash
npm install
npm run dev
npm run build
```

The Vite development server proxies no API requests by default, so configure the hosting layer or add a Vite proxy for the backend in deployment.
