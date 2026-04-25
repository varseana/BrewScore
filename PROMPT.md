# BrewScore — Coffee Transparency & Connoisseur Platform

## Objective

Build a full-stack web application where coffee shops, bistros, and restaurants publicly share their coffee-making procedures, equipment, bean sourcing, and preparation methods — so customers can evaluate coffee quality before visiting. Users discover spots on an interactive map, create connoisseur profiles, rate establishments, write reviews, and build a following of people who trust their palate.

The app ships as a static-friendly frontend (deployable to GitHub Pages or Vercel) with a backend API. The MVP prioritizes the map experience, browsing, authentication, and the connoisseur social layer.

## Core Features

### 1. Interactive Map (primary discovery method)
- **Live geolocation:** browser `navigator.geolocation` to center map on user's current position
- **Custom markers:** coffee cup icon, color-coded by Transparency Score (amber = high, muted = low)
- **Marker clustering:** group nearby markers at low zoom levels using Leaflet.markercluster
- **Hover preview cards:** floating glass card appears on marker hover showing:
  - Establishment name, star rating, Transparency Score badge
  - Top 2 brewing methods as pills
  - Distance from user (calculated client-side)
  - Thumbnail photo
  - "View Profile" link
- **Click → full profile:** clicking marker or hover card navigates to establishment detail page
- **Bounds-based loading:** API endpoint `GET /establishments?bounds=sw_lat,sw_lng,ne_lat,ne_lng` returns establishments within current map viewport. Re-fetches on pan/zoom
- **Search + map sync:** typing in search bar filters markers live, map pans to results
- **"Near Me" button:** re-centers map on user's live location with smooth animation
- **Map/List toggle:** switch between map view and card list view, both showing same filtered results
- **Responsive:** full-screen map on mobile with bottom sheet for results, split view (map left, list right) on desktop
- **Tech:** Leaflet + React Leaflet (free, no API key) with OpenStreetMap tiles

### 2. Establishment Profiles (public, no login required to browse)
Each coffee shop / bistro / restaurant gets a profile page showing:
- Name, location, photos, hours
- **Coffee Program Card** — the centerpiece:
  - Bean origins (single origin, blend, roaster partnership)
  - Brewing methods available (espresso, pour-over, French press, siphon, cold brew, etc.)
  - Equipment used (machine brand/model — e.g. La Marzocca Linea PB, Mahlkonig EK43)
  - Water filtration system (if disclosed)
  - Milk options and steaming standards
  - Signature drinks with preparation notes
  - Roast freshness policy (days from roast, in-house roasting y/n)
- **Procedure Transparency Score** — auto-calculated from how many fields the establishment has filled out (more transparency = higher score, displayed as a badge)
- Menu highlights (not full menu — just the coffee program)
- Average community rating (from connoisseurs)
- Mini map showing location with a single marker

### 3. Authentication & User Roles
- Register / Login (email + password, OAuth with Google)
- Four user roles:
  - **Explorer** — browses, saves favorites, leaves basic ratings
  - **Connoisseur** — unlocked after 10+ reviews. Gets a public profile, can be followed, reviews carry more weight in rankings
  - **Owner** — claims an establishment (with proof of ownership). Can edit coffee program, respond to reviews, view analytics. One owner per establishment (transfer supported)
  - **Admin** — full platform control. Manages reports, issues strikes, suspends/removes establishments, manages users, seeds test data
- Profile page: avatar, bio, taste preferences (light roast lover, espresso purist, etc.), review history, follower/following counts
- Follow system: follow connoisseurs to see their latest reviews in a personal feed

### 4. Reviews & Ratings
- Rate an establishment on:
  - Bean quality (1-5)
  - Preparation skill (1-5)
  - Equipment quality (1-5)
  - Consistency (1-5)
  - Overall experience (1-5)
- Written review with optional photo upload
- Tag the specific drink ordered
- Connoisseur reviews are visually distinguished (badge, highlighted card)

### 5. Discovery & Search
- Search by location, brewing method, equipment, bean origin, or rating
- Filter: "Has pour-over", "Uses single origin", "Roasts in-house", "Score 4+"
- Map view as default discovery (see section 1)
- "Near Me" geolocation search
- Trending establishments and top-rated connoisseurs on the landing page

### 6. Feed
- Personalized feed showing reviews from followed connoisseurs
- Global feed showing latest community activity
- Establishment updates (new beans, new equipment, seasonal drinks)

### 7. Reporting & Trust System
Users can report establishments that lie about their procedures, equipment, or sourcing. The platform enforces accountability through a strike system inspired by platforms like Yelp, Google Maps, and Trustpilot.

- **Report flow:** any logged-in user can file a report against an establishment
  - Reason categories: misleading info, false procedures, fake equipment claims, other
  - Description field (required) + evidence photo upload (optional)
  - Reports are anonymous to the establishment owner (only admins see reporter identity)
- **3-Strike system:**
  - Strike 1: warning notification to owner + "Under Review" badge visible on profile for 30 days
  - Strike 2: establishment flagged — amber warning banner on profile, reduced visibility in search/map rankings
  - Strike 3: establishment suspended — hidden from map and search, owner notified, can appeal within 14 days
  - Post-appeal removal: if appeal fails or no appeal filed, establishment permanently removed
- **Establishment statuses:** `active` → `flagged` (2 strikes) → `suspended` (3 strikes) → `removed` (appeal failed/expired)
- **Appeal process:** owner can submit a written appeal + evidence to contest any strike. Admin reviews and resolves
- **Public trust indicators:** establishments with 0 strikes and high transparency get a "Verified" badge

### 8. Owner Dashboard
Establishment owners can claim and manage their own listing.

- **Claim flow:** user requests ownership of an establishment by submitting proof (business license, utility bill, or similar). Admin reviews and approves/rejects
- **Dashboard features:**
  - Edit Coffee Program (beans, methods, equipment, all fields)
  - Upload/manage photos
  - Update hours and location
  - Respond to reviews (public replies, visible on review cards)
  - View analytics: rating trends, review count over time, most-praised categories, Transparency Score breakdown
  - View active strikes and report history
  - Submit appeals for strikes
- **Restrictions:** owner can only edit their own establishment. Cannot delete reviews or modify ratings

### 9. Admin Panel
Full platform management for testing, moderation, and data integrity.

- **Report management:** view all pending reports, investigate, resolve or dismiss, issue strikes
- **Strike management:** issue/revoke strikes, review appeals, escalate to suspension/removal
- **Establishment management:** create/edit/delete any establishment, change status (active/flagged/suspended/removed), verify establishments, transfer ownership
- **User management:** view all users, change roles, ban/suspend users, reset passwords
- **Data tools:** seed test data, bulk import establishments, export analytics
- **Activity log:** audit trail of all admin actions (who did what, when)
- **Access:** protected routes, admin role required. Seed script creates a default admin account for development

## Style / Aesthetic Direction

### Theme: Dark roast meets modern minimalism
- Dark mode primary (`#1a1a1a` base, `#0d0d0d` surfaces), warm accent palette drawn from coffee tones
- Accent color: rich amber `#C8A26B` (espresso crema) for CTAs, ratings, highlights
- Secondary accent: deep burgundy `#6B2D3E` for connoisseur badges and premium elements
- Neutral text: `#E8E0D8` (warm white, not clinical blue-white)

### Semantic Color Tokens
```
--color-bg:          #0d0d0d
--color-surface:     #1a1a1a
--color-surface-alt: #242424
--color-brand-500:   #C8A26B
--color-brand-700:   #8B6F47
--color-brand-300:   #E0C99A
--color-accent:      #6B2D3E
--color-text:        #E8E0D8
--color-text-muted:  #8A8078
--color-border:      #2E2A26
--color-success:     #4A7C59
--color-error:       #9B3B3B
```

### Typography
- Headings: `'DM Serif Display', serif` — elegant, editorial, coffee-menu feel
- Body: `'Inter', sans-serif` — clean readability
- Type scale: display (48px), h1 (36px), h2 (28px), h3 (22px), body (16px), small (14px), caption (12px)

### Spacing
- 4px base grid. Tokens: `--space-1` (4px) through `--space-10` (64px)

### Border Radius
- Small: 8px (buttons, inputs, badges)
- Medium: 16px (cards, panels)
- Large: 24px (modals, hero sections)
- Personality: friendly-professional (consumer app, not enterprise)

### Cards & Surfaces
- Glass morphism on featured cards and map hover cards: `backdrop-filter: blur(12px)`, `rgba(255,255,255,0.04)` background
- Subtle warm glow on hover: `box-shadow: 0 8px 32px rgba(200,162,107,0.08)`
- Card hover: `translateY(-3px)` lift, border shifts to `--color-brand-500`

### Map-Specific Styling
- Dark map tiles (CartoDB Dark Matter or similar dark OSM style)
- Custom marker icons: small coffee cup SVG, filled with Transparency Score color
- Hover card: glass morphism card floating above map, `backdrop-filter: blur(16px)`, warm border glow
- Cluster circles: amber gradient with count number, pulse animation on zoom change

### Motion
- Interactions: 150ms, `cubic-bezier(0.4, 0, 0.2, 1)`
- Layout transitions: 250ms
- Scroll reveal: fade up from `translateY(20px)`, staggered
- Map marker appear: scale from 0 to 1 with spring easing
- Hover card: fade in + slight `translateY(-4px)` lift
- Respect `prefers-reduced-motion`

### Modals
- Entrance: spring scale `cubic-bezier(0.34, 1.56, 0.64, 1)` from 0.95 to 1.0
- Exit: scale to 0.97 + fade out
- Backdrop: `backdrop-filter: blur(8px)` + deep shadow on modal

## Technical Requirements

### Frontend
- React 18+ with TypeScript (strict mode)
- Vite for bundling
- React Router for navigation
- Tailwind CSS with custom theme config matching the design tokens above
- Zustand for state management
- TanStack Query for API data fetching and caching
- Leaflet + React Leaflet for map (free, no API key)
- Leaflet.markercluster for marker grouping
- Responsive: mobile-first, breakpoints at `sm` (640), `md` (768), `lg` (1024), `xl` (1280)

### Backend
- Node.js with Express or Fastify
- PostgreSQL database
- Prisma ORM
- JWT authentication + refresh tokens
- REST API (OpenAPI documented)
- Image uploads via Cloudinary (free tier)
- Rate limiting on auth endpoints
- Spatial query support: `WHERE lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?` for bounds-based map loading

### Data Model (core entities)
- `User` (id, email, name, avatar, bio, tastePreferences, role [explorer/connoisseur/owner/admin], followerCount, followingCount)
- `Establishment` (id, ownerId, name, location, lat, lng, photos, hours, transparencyScore, avgRating, verified, status [active/flagged/suspended/removed])
- `CoffeeProgram` (establishmentId, beanOrigins, brewingMethods, equipment, waterFiltration, milkOptions, signatureDrinks, roastPolicy)
- `Review` (id, userId, establishmentId, ratings{bean,preparation,equipment,consistency,overall}, text, photos, drinkOrdered)
- `Report` (id, reporterId, establishmentId, reason [misleading_info/false_procedures/fake_equipment/other], description, evidence, status [pending/investigating/resolved/dismissed], adminNotes, resolvedAt)
- `Strike` (id, establishmentId, reportId, reason, issuedAt, issuedBy)
- `Follow` (followerId, followingId)
- `Favorite` (userId, establishmentId)
- `ClaimRequest` (id, userId, establishmentId, proofDocuments, status [pending/approved/rejected], reviewedBy)

### Deployment
- Frontend: GitHub Pages, Vercel, or Netlify (static build)
- Backend: Railway, Render, or Fly.io
- Database: Supabase (hosted Postgres) or Railway Postgres
- CI: GitHub Actions for lint + build on PR

## Constraints

- No paid APIs in MVP — use free tiers only (Leaflet + OpenStreetMap tiles, Cloudinary free tier, Supabase free tier)
- No AI-generated reviews or fake data seeding in production
- Accessibility: WCAG 2.1 AA minimum — proper contrast ratios, keyboard navigation, screen reader labels, map keyboard controls
- Performance: Lighthouse score 90+ on mobile
- No emoji in UI chrome (buttons, headers, navigation). Emoji allowed only in user-generated content (reviews, bios)

## Output Expectations

### Deliverables
1. Monorepo with `/client` and `/server` directories
2. `README.md` with setup instructions, tech stack overview, and screenshots
3. Database schema + seed script with 5 sample establishments (with lat/lng coordinates), 3 sample connoisseurs, 1 owner, and 1 admin account
4. Working authentication flow (register, login, logout, protected routes, role-based access)
5. Interactive map as the landing/home experience with geolocation, markers, hover cards, clustering
6. Establishment browse + detail pages (accessible from map or list)
7. Review submission flow
8. Connoisseur profile + follow system
9. Search with filters + map sync
10. Reporting system with report submission and strike tracking
11. Owner dashboard with establishment editing and review responses
12. Admin panel with report management, strike system, user/establishment CRUD
13. Responsive across mobile, tablet, desktop

### Quality Bar
- TypeScript strict mode, no `any` types
- ESLint + Prettier configured
- Component-level code splitting for route-based lazy loading
- Error boundaries on all route-level components
- Loading skeletons (not spinners) for async content
- 404 and error pages styled consistently with the theme

## Regression Safety

After completing all changes, review every function and feature that existed before your modifications. Confirm nothing is broken — no missing event listeners, no removed logic, no renamed storage keys, no deleted DOM selectors. If any pre-existing functionality was accidentally affected, revert and fix before finishing.
