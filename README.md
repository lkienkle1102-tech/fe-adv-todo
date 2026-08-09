This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Authentication deployment

Authentication uses the Next.js server as a backend-for-frontend (BFF):

1. The browser submits credentials to the same-origin `/api/session` route.
2. The Next.js server exchanges the credentials for a JWT with the backend.
3. The JWT is stored only in a host-only, `HttpOnly` session cookie on the frontend origin.
4. Browser API calls go to the same-origin `/api/backend/*` proxy, which adds the JWT as a Bearer token server-side.

The JWT is never stored in `localStorage` or `sessionStorage`, and the frontend and backend do not need to share a cookie domain.

Set the server-only backend URL in the frontend deployment:

```env
BACKEND_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://app.example.com
```

`NEXT_PUBLIC_API_URL` is still accepted as a compatibility fallback, but new deployments should use `BACKEND_URL` so the backend address is not exposed as browser configuration.

Supported topology examples:

| Frontend | Backend | Frontend `BACKEND_URL` | Backend `FRONTEND_ORIGIN` |
| --- | --- | --- | --- |
| `https://example.com` | `https://api.example.com` | `https://api.example.com` | `https://example.com` |
| `https://frontend.com` | `https://backend.net` | `https://backend.net` | `https://frontend.com` |
| `http://localhost:3000` | `http://localhost:8000` | `http://localhost:8000` | `http://localhost:3000` |
| `http://localhost:3000` | `https://backend.net` | `https://backend.net` | `http://localhost:3000` |

Use origins without a trailing slash. Production frontend and backend endpoints should use HTTPS. The frontend must run with a Next.js server or serverless runtime; static export cannot provide the session and proxy Route Handlers.
