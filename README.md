# CONSITEC Commercial and Operational Management Panel

Professional internal web application for monthly control of training services and certificate-only sales.

## Stack
- Next.js 14 + React 18
- API Routes (Node runtime)
- Prisma ORM
- PostgreSQL
- Recharts

## Modules
1. **Monthly Services Board** (calendar + bonus alerts 45/70)
2. **Certificate Sales Board** (Natural Person vs Company)
3. **Sales Performance 6x4** (weekly matrix, bonus flag, ranking)
4. **Support Database** (CRUD for instructors, courses, salespeople, locations)

## Auth Roles
- `ADMIN`
- `SALES`

Basic credential login with protected `/dashboard` route.

## Local Setup
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Open: `http://localhost:3000`

## Default user
- username: `admin`
- password: `admin123`

## Environment
See `.env.example`.

## Deployment
### Vercel
1. Create PostgreSQL database.
2. Add `DATABASE_URL` in Vercel environment variables.
3. Deploy repository.
4. Run migrations in CI or post-deploy pipeline.

### VPS
1. Install Node 20+, PostgreSQL, PM2.
2. Configure `.env`.
3. Run `npm ci && npm run build`.
4. Run migrations and seed.
5. Start with `pm2 start npm --name consitec -- start`.

## Business Notes
- Monthly view automatically changes using selected month/year and preserves historical records by date.
- Designed for desktop internal office operation with fast inline workflows.
