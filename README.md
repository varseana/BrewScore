# BrewScore

Coffee transparency and connoisseur platform. Coffee shops share their procedures, equipment, and bean sourcing. Users discover spots on an interactive map, write reviews, and build connoisseur profiles with followers.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, TanStack Query, Leaflet |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Auth | JWT access tokens + refresh token rotation, bcrypt |
| Validation | Zod |
| CI | GitHub Actions |
| Deploy | Docker, Railway/Render (server), Vercel/GitHub Pages (client) |

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or Docker)

### Option 1: Docker (recommended)

```bash
docker compose up -d
cd server && npm ci && npx prisma migrate dev && npm run db:seed
```

### Option 2: Manual

```bash
# 1. start postgres locally

# 2. server setup
cd server
cp .env.example .env
# edit .env with your DATABASE_URL
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Server runs at `http://localhost:3001`.

### Client

```bash
cd client
npm install
npm run dev
```

Client runs at `http://localhost:5173`.

## Seed Accounts

All use password: `password123`

| Role | Email |
|------|-------|
| Admin | admin@brewscore.dev |
| Owner | owner@brewscore.dev |
| Connoisseur | oscar@brewscore.dev |
| Connoisseur | nazareth@brewscore.dev |
| Connoisseur | steven@brewscore.dev |
| Explorer | sean@brewscore.dev |
| Explorer | eugenia@brewscore.dev |

## API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | - | Create account |
| POST | /api/auth/login | - | Login |
| POST | /api/auth/refresh | - | Rotate refresh token |
| POST | /api/auth/logout | Yes | Revoke all refresh tokens |
| GET | /api/auth/me | Yes | Current user profile |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/users/:id | Optional | User profile |
| PATCH | /api/users/me | Yes | Update own profile |
| POST | /api/users/:id/follow | Yes | Toggle follow/unfollow |
| GET | /api/users/:id/followers | - | Paginated followers |
| GET | /api/users/:id/following | - | Paginated following |

### Establishments
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/establishments | Optional | List/search/map bounds |
| GET | /api/establishments/:id | Optional | Detail with coffee program |
| POST | /api/establishments | Admin/Owner | Create |
| PATCH | /api/establishments/:id | Owner/Admin | Update |
| PUT | /api/establishments/:id/coffee-program | Owner/Admin | Upsert coffee program |
| POST | /api/establishments/:id/favorite | Yes | Toggle favorite |

**Map bounds query:** `GET /api/establishments?bounds=sw_lat,sw_lng,ne_lat,ne_lng`

**Filters:** `?q=search&methods=espresso,pour-over&minRating=4&minScore=80&roastsInHouse=true&sort=rating`

### Reviews
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/reviews/establishment/:estId | Optional | Reviews for establishment |
| GET | /api/reviews/user/:userId | - | Reviews by user |
| POST | /api/reviews | Yes | Create review |
| POST | /api/reviews/:id/reply | Owner/Admin | Owner reply |
| DELETE | /api/reviews/:id | Author/Admin | Delete review |

### Reports & Trust
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/reports | Yes | Report establishment |
| GET | /api/reports | Admin | List reports |
| PATCH | /api/reports/:id/resolve | Admin | Resolve + optional strike |
| GET | /api/reports/strikes/:estId | Owner/Admin | Strikes for establishment |

### Claims
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/claims | Yes | Claim ownership |
| GET | /api/claims/mine | Yes | My claims |

### Feed
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/feed/following | Yes | Reviews from followed users |
| GET | /api/feed/global | Optional | Latest reviews |
| GET | /api/feed/top-connoisseurs | - | Top 10 connoisseurs |

### Admin
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | List users |
| PATCH | /api/admin/users/:id | Admin | Update user role/ban |
| PATCH | /api/admin/establishments/:id | Admin | Update status/verify |
| DELETE | /api/admin/establishments/:id | Admin | Remove establishment |
| GET | /api/admin/claims | Admin | List claims |
| PATCH | /api/admin/claims/:id | Admin | Approve/reject claim |
| GET | /api/admin/audit-log | Admin | Audit trail |

## Deployment

### Server (Railway / Render)

1. Push to GitHub
2. Connect repo to Railway or Render
3. Set root directory to `server`
4. Set build command: `npm ci && npx prisma generate && npx tsc`
5. Set start command: `npx prisma migrate deploy && node dist/index.js`
6. Add environment variables:
   - `DATABASE_URL` (provisioned Postgres)
   - `JWT_SECRET` (generate a strong random string)
   - `JWT_REFRESH_SECRET` (generate a different strong random string)
   - `CLIENT_URL` (your frontend URL)
   - `PORT` (usually auto-set by platform)

### Client (Vercel / GitHub Pages)

1. Connect repo to Vercel
2. Set root directory to `client`
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL` pointing to your server URL

### Database

Railway and Render both offer managed PostgreSQL. Supabase free tier also works.

## Strike System

| Strikes | Status | Effect |
|---------|--------|--------|
| 0 | Active | Normal visibility, eligible for "Verified" badge |
| 1 | Active | Warning sent to owner, "Under Review" badge for 30 days |
| 2 | Flagged | Amber warning banner, reduced search/map ranking |
| 3 | Suspended | Hidden from map and search, owner can appeal within 14 days |
| Appeal failed | Removed | Permanently hidden |

## License

MIT
