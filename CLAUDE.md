---
description: 
alwaysApply: true
---

# Chore Calendar - Project Rules

## Overview

A Next.js 15 calendar app for tracking daily chores with drag-and-drop, authentication, and cloud sync.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 4 + vanilla CSS variables
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Auth**: Auth.js v5 (NextAuth.js)
- **Drag & Drop**: @dnd-kit

## Architecture

### Directory Structure

```
src/
├── app/              # Pages & API routes (Next.js App Router)
├── components/       # React components
├── context/          # React context providers
├── hooks/            # Custom hooks
├── lib/              # Utilities (api.ts for API client)
├── server/           # Server-side code (auth, db)
├── styles/           # Global CSS
└── types.ts          # Shared TypeScript types
```

### Key Patterns

1. **API Layer**: All fetch calls are centralized in `src/lib/api.ts`
2. **State Management**: React Context (`ChoreContext`) with local + remote sync
3. **Auth Flow**: Auth.js with Drizzle adapter for user persistence
4. **Database**: Drizzle ORM with table prefix `chore_calendar_*`

## Coding Standards

### TypeScript

- Strict mode enabled
- Use `type` imports: `import type { Foo } from ...`
- Prefer Zod for runtime validation in API routes

### React

- Use functional components with hooks
- Wrap state mutations in `useCallback` when passed as props
- Mark client components with `"use client"` directive

### CSS

- Use CSS variables defined in `globals.css` (`:root`)
- Prefer custom utility classes over inline Tailwind for repeated patterns
- Keep component-specific styles in globals.css with section comments

### API Routes

- Validate input with Zod schemas
- Return proper HTTP status codes (401, 400, etc.)
- Always check `session?.user?.id` for auth

## Database

### Schema Location

`src/server/db/schema.ts`

### Tables

- `chore_calendar_user` - Users with `targetScore`
- `chore_calendar_account` - OAuth accounts
- `chore_calendar_session` - Sessions
- `chore_calendar_chore` - Chore definitions
- `chore_calendar_chore_instance` - Calendar entries

### Commands

```bash
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to DB
npm run db:studio    # Visual DB browser
```

## Testing

No automated tests currently. Verify manually:

1. `npm run typecheck` - TypeScript compilation
2. `npm run lint` - ESLint
3. Browser testing for UI

## Common Tasks

### Add a new API endpoint

1. Create route in `src/app/api/[name]/route.ts`
2. Add Zod schema for validation
3. Add API function to `src/lib/api.ts`
4. Update context/hooks as needed

### Add a new database table

1. Define table in `src/server/db/schema.ts`
2. Run `npm run db:push`
3. Create API route for CRUD
4. Add functions to `src/lib/api.ts`

### Modify user settings

1. Add column to `users` table in schema
2. Run `npm run db:push`
3. Update `/api/settings` route
4. Update `fetchUserSettings` in api.ts
