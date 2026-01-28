# Chore Calendar

A beautiful, modern calendar app for tracking daily chores and activities with drag-and-drop functionality.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **🎯 Daily Goals** — Set a daily score target and track your progress
- **🖱️ Drag & Drop** — Easily drag chores onto calendar days
- **⭐ Favorites** — Mark chores as favorites to reuse them
- **📱 Responsive** — Works great on desktop and mobile
- **🔐 Authentication** — Sign in with Google or GitHub to save progress
- **☁️ Cloud Sync** — Your data is saved to the cloud when logged in

## 🛠️ Tech Stack

| Layer       | Technology                                                                     |
| ----------- | ------------------------------------------------------------------------------ |
| Framework   | [Next.js 15](https://nextjs.org) with App Router                               |
| Language    | [TypeScript](https://typescriptlang.org)                                       |
| Styling     | [Tailwind CSS 4](https://tailwindcss.com)                                      |
| Database    | [Neon PostgreSQL](https://neon.tech) + [Drizzle ORM](https://orm.drizzle.team) |
| Auth        | [Auth.js v5](https://authjs.dev) (Google, GitHub)                              |
| Drag & Drop | [@dnd-kit](https://dndkit.com)                                                 |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A [Neon](https://neon.tech) database (free tier available)
- OAuth credentials from Google and/or GitHub

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/chore-calendar.git
cd chore-calendar

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Configuration

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

### Database Setup

```bash
# Push the schema to your database
npm run db:push
```

### Development

```bash
npm run dev
```

Open [the application](http://localhost:3000) (or your deployment URL) to see the app.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages & API routes
│   ├── api/
│   │   ├── auth/        # Auth.js endpoints
│   │   ├── calendar/    # Calendar CRUD
│   │   ├── chores/      # Chores CRUD
│   │   └── settings/    # User settings
│   └── page.tsx         # Main app page
├── components/          # React components
├── context/             # React context (ChoreProvider)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities & API client
├── server/              # Server-side code
│   ├── auth.ts          # Auth.js config
│   └── db/              # Drizzle schema & connection
├── styles/              # Global CSS
└── types.ts             # TypeScript types
```

## 📜 Scripts

| Script              | Description                 |
| ------------------- | --------------------------- |
| `npm run dev`       | Start development server    |
| `npm run build`     | Build for production        |
| `npm run start`     | Start production server     |
| `npm run check`     | Run linting + type checking |
| `npm run db:push`   | Push schema to database     |
| `npm run db:studio` | Open Drizzle Studio         |

## 📄 License

MIT
