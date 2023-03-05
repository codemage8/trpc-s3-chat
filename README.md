# TRPC+S3 text app

## Test Results

[![Playwright Pagination](actions/workflows/test-pagination.yml/badge.svg)](actions/workflows/test-pagination.yml)


## Features
- 🧙‍♂️ E2E typesafety with [tRPC](https://trpc.io)
- ⚡ Full-stack React with Next.js
- ⚡ Database with Prisma
- ⚙️ VSCode extensions
- 🎨 ESLint + Prettier
- 💚 CI setup using GitHub Actions:
  - ✅ E2E testing with [Playwright](https://playwright.dev/)
  - ✅ Linting
- 🔐 Validates your env vars on build and start
- Uses Amazon S3 Bucket for image storage
- Uses Mongodb Atlas for message storage
- Optimistic Update on trpc mutation
- Mantine for UX

## Setup

### Requirements
  - Node >= 14
  - Mongodb Atlas
  - Amazon S3

### Configuration for Development

- copy `sample.env` file and rename to `.env`, fill in the variables.
  - `DATABASE_URL` : Connection url to mongodb atlas db
  - `S3_REGION`, `S3_BUCKET_NAME`
  - `S3_KEY`, `S3_SECRET_KEY`, `S3_BUCKET_NAME` : Use access keys & secrets with PutObject permission granted to the bucket
  - `CLIENT_S3_KEY`, `CLIENT_S3_SECRET_KEY` : Use credentias with only GetObject (For client side image loading)

### Commands

```bash
pnpm run dev
```

### Github workflow

- Open`.github/workflows/test-pagination.yml`, update the environment variables, some variables are stored as repository secret for privacy


### Deployment
- Use Vercel
- Make sure to assign environment variables in `.env` file, since `.env` file is not used for production deployment 