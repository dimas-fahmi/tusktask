# TuskTask

TuskTask is a modern, full-stack task management application built with Next.js, React, Drizzle ORM, and TypeScript. It features Pomodoro timers, activity logs, user authentication, and a beautiful, responsive UI.

## Features

- User authentication (Google, GitHub, Discord)
- Task management (CRUD, tags, deadlines, reminders)
- Pomodoro timer integration
- Activity logs and analytics
- Responsive sidebar navigation
- Customizable user profiles and avatars
- Notification system with sound and browser support

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Drizzle ORM, PGSQL with NeonDB
- **Authentication:** AuthJS
- **UI Components:** shadcn/ui, Lucide Icons
- **State Management:** React Context, React Query

## Screenshot

![Screenshot of TuskTask dashboard showing tasks](https://zvgpixcwdvbogm3e.public.blob.vercel-storage.com/tusktask/screenshots/Screenshot%202025-05-09%20093605-zS6LB3l40qzcllii4rr1YZtuX5U7Ov.png)

_Figure: A sample view of the TuskTask interface with task lists._

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (recommended) or npm/yarn

### Installation

_Clone This Repository, make sure you installed Github CLI_

```sh
gh repo clone dimas-fahmi/tusktask
```

_Install Dependencies_

```sh
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values.

### Running the Development Server

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```sh
pnpm build
pnpm start
```

## Project Structure

- `app/` - Next.js app directory (routes, API, pages)
- `src/` - Source code (components, hooks, utils, db, zod schemas)
- `public/` - Static assets
- `components.json` - shadcn/ui component registry

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## License

[MIT](LICENSE)

---

Made with ❤️ by Dimas Fahmi.
