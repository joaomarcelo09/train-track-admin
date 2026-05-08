# Train Track Admin

Frontend dashboard for managing trains, lines, and tracks.

## Environment

The app reads the backend base URL from:

```bash
VITE_API_URL=http://localhost:3000/api
```

Update `.env` if your API runs on a different host or port. Keep `.env.example`
in sync when adding new environment variables.

## Commands

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run lint
```

## Docker

Build and run the production frontend container:

```bash
docker compose up --build
```

The app is served on `http://localhost:5173` by default. Override the exposed
port with `FRONTEND_PORT`.

Vite embeds `VITE_API_URL` at build time, so rebuild the image after changing
the backend URL:

```bash
VITE_API_URL=http://localhost:3000/api docker compose up --build
```

## API

Axios is configured in `src/api/client.ts`. If the backend is unavailable, the
stores fall back to seeded local data so the UI remains usable during frontend
development.

Authentication requests use:

```text
POST /auth/register
POST /auth/login
GET /auth/me
```

Register and login send:

```json
{
  "email": "user@email.com",
  "password": "password123"
}
```

Login should return:

```json
{
  "access_token": "jwt_token",
  "token_type": "bearer"
}
```

After login, the frontend calls `GET /auth/me` to load the authenticated user.
The JWT is stored locally and sent on protected API calls as:

```text
Authorization: Bearer <token>
```
