# MelodyMakerAI Frontend

The frontend application for MelodyMakerAI - a full-stack AI-powered music generation platform.

## 🛠 Tech Stack

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Type-safe development
- **[React 19](https://react.dev/)** - UI library
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Prisma 6.5](https://www.prisma.io/)** - Database ORM
- **[Better Auth 1.3](https://better-auth.dev/)** - Authentication solution
- **[Inngest 3.43](https://www.inngest.com/)** - Background job processing
- **[Polar](https://polar.sh)** - Payment processing integration
- **[AWS SDK](https://aws.amazon.com/sdk-for-javascript/)** - S3-compatible storage client
- **[Zustand 5](https://zustand-demo.pmnd.rs/)** - State management
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

## 📁 Project Structure

```
frontend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite (local development)
├── src/
│   ├── actions/               # Server Actions (Backend Logic)
│   │   ├── comment.ts         # Comment CRUD operations
│   │   ├── download.ts        # Song download with tracking
│   │   ├── favorite.ts        # Favorite management
│   │   ├── follow.ts          # Follow/unfollow system
│   │   ├── generation.ts      # Music generation queueing
│   │   ├── history.ts         # Generation history & stats
│   │   ├── playlist.ts        # Playlist management
│   │   ├── remix.ts           # Remix creation
│   │   ├── search.ts          # Advanced search
│   │   └── song.ts            # Song operations
│   ├── app/
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (main)/            # Main app routes
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── env.js                 # Environment validation
│   ├── hooks/                 # Custom React hooks
│   ├── inngest/               # Background jobs
│   ├── lib/                   # Utilities
│   ├── server/                # Server utilities
│   ├── stores/                # Zustand stores
│   └── styles/                # Global styles
├── .env                       # Environment variables
├── components.json            # shadcn/ui config
├── next.config.js
├── package.json
├── postcss.config.js
├── prettier.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL database (or SQLite for local dev)

### Installation

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbo
pnpm build            # Build for production
pnpm start            # Start production server
pnpm preview          # Build and preview

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm typecheck        # TypeScript type checking
pnpm check            # Lint + TypeCheck
pnpm format:check     # Check code formatting
pnpm format:write     # Format code with Prettier

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="https://your-domain.com"

# Modal AI
MODAL_KEY="your-modal-key"
MODAL_SECRET="your-modal-secret"

# Backblaze B2
B2_KEY_ID="your-key-id"
B2_APP_KEY="your-app-key"
B2_ENDPOINT="https://s3.us-east-005.backblazeb2.com"
B2_BUCKET_NAME="your-bucket"

# AI Endpoints
GENERATE_FROM_DESCRIPTION="https://your-modal-endpoint.modal.run"
GENERATE_FROM_DESCRIBED_LYRICS="https://your-modal-endpoint.modal.run"
GENERATE_WITH_LYRICS="https://your-modal-endpoint.modal.run"

# Polar
POLAR_ACCESS_TOKEN="polar_oat_your-token"
POLAR_WEBHOOK_SECRET="polar_whs_your-secret"

# Inngest
INNGEST_EVENT_KEY="your-event-key"
INNGEST_SIGNING_KEY="your-signing-key"
```

See [main README](../README.md#-environment-variables) for detailed configuration.

## 🏗 Architecture

### Server Actions vs API Routes

MelodyMakerAI uses **Next.js Server Actions** instead of traditional REST API routes:

- ✅ Type-safe end-to-end
- ✅ No need to define API routes
- ✅ Automatic request/response handling
- ✅ Better integration with React Server Components

All backend logic is in `/src/actions/`.

### App Router Structure

```
app/
├── (auth)/              # Authentication group
│   ├── auth/[path]/    # Sign in/up pages
│   ├── account/[path]/ # Account management
│   └── layout.tsx      # Auth-specific layout
└── (main)/              # Main app group
    ├── layout.tsx      # Sidebar + navigation
    ├── page.tsx        # Home/discovery feed
    ├── create/         # Music generation
    ├── history/        # Generation history
    ├── analytics/      # Analytics dashboard
    ├── favorites/      # Favorite songs
    ├── playlists/      # Playlist management
    ├── search/         # Advanced search
    ├── customer-portal/ # Polar billing
    ├── upgrade/        # Credit purchase
    └── profile/        # User profiles
```

**Route Groups** `(auth)` and `(main)` don't affect the URL structure but allow different layouts.

### State Management

- **Server State**: Handled by Server Actions + React Server Components
- **Client State**: Zustand for global audio player
- **Form State**: React hook form (if needed)
- **Theme State**: next-themes

### Data Flow

```
User Interaction
    ↓
Client Component
    ↓
Server Action (actions/*.ts)
    ↓
Prisma Database
    ↓
Inngest Event (if async)
    ↓
Background Processing
```

## 🎨 Styling

### Tailwind CSS 4

The project uses Tailwind CSS 4 with:
- PostCSS compilation
- Custom design system
- Dark mode support
- Mobile-first responsive design

### Theme System

```typescript
// components/providers.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

Supports: `light`, `dark`, `system` (auto)

### Component Library

Using shadcn/ui components with Radix UI primitives:
- Fully accessible (ARIA compliant)
- Keyboard navigation
- Customizable with Tailwind
- TypeScript support

## 🗄️ Database

### Prisma ORM

```bash
# Generate types
npx prisma generate

# Sync schema
npx prisma db push

# Create migration
npx prisma migrate dev

# View data
npx prisma studio
```

### Schema Overview

Main models:
- `User` - User accounts with credits
- `Song` - Generated music tracks
- `Like` - Song likes
- `Favorite` - User's favorite songs
- `Comment` - Song comments
- `Playlist` - User playlists
- `PlaylistSong` - Playlist items
- `Follow` - User follows
- `Category` - Music categories

See [schema.prisma](prisma/schema.prisma) for full schema.

## 🔐 Authentication

### Better Auth

Better Auth provides:
- Email/password authentication
- Session management
- Polar customer integration
- Secure cookie handling

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { polar } from "@polar-sh/better-auth"

export const auth = betterAuth({
  database: prismaAdapter(db),
  plugins: [polar({ ... })]
})
```

### Usage

```typescript
// Server-side
import { auth } from "~/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({
  headers: await headers()
})

// Client-side
import { authClient } from "~/lib/auth-client"

const { data: session } = authClient.useSession()
```

## 🔄 Background Jobs (Inngest)

### Music Generation Flow

1. User submits generation form
2. Server Action creates Song records
3. Inngest events are sent
4. Background function processes:
   - Checks credits
   - Calls Modal API
   - Updates database
   - Deducts credits

```typescript
// inngest/functions.ts
export const generateSong = inngest.createFunction(
  {
    id: "generate-song-event",
    concurrency: {
      limit: 1,
      key: "event.data.userId"
    }
  },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    // Multi-step processing
  }
)
```

### Testing Inngest Locally

1. Install Inngest CLI: `npx inngest-cli@latest dev`
2. Visit http://localhost:8288
3. Trigger events manually to test

## 💳 Payments (Polar)

### Integration

Polar integration provides:
- Credit packages
- Webhook processing
- Customer portal redirect
- Automatic credit top-ups

### Webhook Endpoint

```typescript
// app/api/polar/webhook/route.ts
export async function POST(req: Request) {
  // Verify signature
  // Process payment
  // Add credits to user
}
```

## 🎵 Audio Player

### Zustand Store

```typescript
// stores/use-player-store.ts
interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  play: () => void
  pause: () => void
  setCurrentSong: (song: Song) => void
}
```

### Usage

```typescript
import { usePlayerStore } from "~/stores/use-player-store"

function SongCard({ song }) {
  const { setCurrentSong, play } = usePlayerStore()
  
  const handlePlay = () => {
    setCurrentSong(song)
    play()
  }
}
```

## 🧪 Testing

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format checking
pnpm format:check

# All checks
pnpm check
```

## 📦 Building for Production

```bash
# Build
pnpm build

# Test production build locally
pnpm preview
```

### Environment Variables in Production

Make sure all required environment variables are set in your hosting platform (Vercel, etc.).

## 🚢 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

Vercel automatically:
- Detects Next.js
- Builds the project
- Sets up serverless functions
- Configures CDN

### Other Platforms

The app can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Self-hosted

## 🐛 Troubleshooting

### Common Issues

**Prisma Client Not Found**
```bash
npx prisma generate
```

**Type Errors After Update**
```bash
rm -rf node_modules .next
pnpm install
```

**Environment Variables Not Loading**
- Check `.env` file exists in frontend directory
- Restart dev server
- Verify `env.js` validation

**Inngest Functions Not Working Locally**
- Run `npx inngest-cli@latest dev` in separate terminal
- Ensure `INNGEST_EVENT_KEY` is set

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Better Auth Docs](https://better-auth.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Inngest Documentation](https://www.inngest.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

For complete documentation, see the [main README](../README.md).