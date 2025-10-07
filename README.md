# MelodyMakerAI 🎵

<div align="center">

**A Complete Full-Stack AI-Powered Music Generation Platform with Social Features**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5-2D3748)](https://www.prisma.io/)
[![Modal](https://img.shields.io/badge/Modal-AI-purple)](https://modal.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.3-green)](https://better-auth.dev/)
[![Inngest](https://img.shields.io/badge/Inngest-3.43-orange)](https://www.inngest.com/)

Create, remix, share, and discover original music tracks using state-of-the-art AI models.

<table>
  <tr>
    <td><img src="./.github/screenshots/hero-1.png" alt="MelodyMakerAI Interface 1" /></td>
    <td><img src="./.github/screenshots/hero-2.png" alt="MelodyMakerAI Interface 2" /></td>
    <td><img src="./.github/screenshots/hero-3.png" alt="MelodyMakerAI Interface 3" /></td>
  </tr>
</table>

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-deployment)

</div>

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [System Flow](#-system-flow)
- [Database Schema](#-database-schema)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Server Actions API](#-server-actions-api)
- [End-to-End Examples](#-end-to-end-examples)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎵 Features

### 🎼 Music Generation
- **AI Music Generation**: Generate complete music tracks from text descriptions using ACE-Step
- **Multiple Generation Modes**: 
  - **Simple Mode**: Describe your song and let AI handle everything (prompt + lyrics generation)
  - **Custom Mode**: Control lyrics, style, and mood precisely
  - **Remix Mode**: Create variations of existing songs with different guidance scales
- **Smart AI Models**: 
  - **ACE-Step** for high-quality music generation
  - **Qwen 2-7B** for intelligent lyrics and prompt enhancement
  - **Stable Diffusion XL Turbo** for album cover art generation
- **Auto-Categorization**: AI automatically tags genres and moods (e.g., Pop, Electronic, Sad, 80s)
- **Dual Generation**: Automatically generates 2 versions (guidance scales 7.5 and 15) per request

### 🎨 Social Features
- **Like System**: Like songs to show appreciation
- **Favorites System**: Save songs to your personal collection (separate from likes)
- **Comments**: Discuss and provide feedback on tracks
- **Follow System**: Follow your favorite artists and get updates
- **Public Profiles**: Share your music portfolio with the community
- **Listen & Download Tracking**: Track engagement metrics

### 📊 Analytics & Management
- **Dashboard**: View detailed analytics of your music
  - Total tracks created
  - Success rate percentage
  - Plays, likes, and comments statistics
  - Generation status breakdown
- **Generation History**: Track all your creations with advanced filters
  - Filter by status (queued, processing, processed, failed)
  - Filter by remix status
  - Sort by date
- **Download System**: Export your songs in WAV format with download count tracking

### 🎵 Organization
- **Playlists**: Create and manage custom playlists
- **Advanced Search**: Find music by:
  - Song title
  - Genre/Category
  - Artist name
  - BPM (coming soon)
- **Discovery Feed**: Trending songs and categorized content

### 🎨 UI/UX
- **Theme System**: Dark, Light, and Auto modes with `next-themes`
- **Responsive Design**: Beautiful, modern, mobile-friendly interface
- **Sidebar Navigation**: Complete app navigation with breadcrumbs
- **Credits Display**: Real-time credit balance in sidebar
- **Loading States**: Skeleton loaders and processing indicators
- **Toast Notifications**: Real-time feedback with Sonner

### 🔐 Platform Features
- **User Authentication**: Secure sign-up and login with Better Auth
- **Credit System**: Flexible pay-per-use model (1 credit = 1 song generation)
- **Polar Integration**: Payment processing and subscription management
- **Customer Portal**: Manage subscriptions and billing via Polar
- **File Storage**: Secure cloud storage with Backblaze B2
- **Async Processing**: Scalable background job processing with Inngest
- **Concurrency Control**: Max 1 generation per user at a time

---

## 🏗 Architecture

MelodyMakerAI uses a modern, scalable architecture with serverless AI processing and asynchronous job handling:

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend]
        A1[React Components]
        A2[Server Actions]
        A3[Zustand Store]
    end
    
    subgraph "Application Layer"
        B[Next.js App Router]
        B1[Better Auth]
        B2[Prisma ORM]
    end
    
    subgraph "Processing Layer"
        C[Inngest]
        C1[Event Queue]
        C2[Background Jobs]
        C3[Retry Logic]
    end
    
    subgraph "AI Layer - Modal"
        D[MusicGenServer]
        D1[ACE-Step Pipeline]
        D2[Qwen 2-7B LLM]
        D3[SDXL Turbo]
    end
    
    subgraph "Storage Layer"
        E[(PostgreSQL - Neon)]
        F[Backblaze B2]
    end
    
    subgraph "Payment Layer"
        G[Polar]
        G1[Webhooks]
        G2[Customer Portal]
    end
    
    A1 --> A2
    A2 --> B
    A3 --> A1
    B --> B1
    B --> B2
    B2 --> E
    A2 --> C1
    C1 --> C2
    C2 --> D
    D --> D1
    D --> D2
    D --> D3
    D1 --> F
    D3 --> F
    C2 --> B2
    G1 --> B2
    B --> G2
    
    style A fill:#3b82f6
    style D fill:#8b5cf6
    style C fill:#f59e0b
    style E fill:#10b981
    style F fill:#10b981
    style G fill:#ec4899
```

### Key Components

1. **Frontend (Next.js 15)**
   - Server-side rendering with App Router
   - Server Actions for backend operations (no REST API)
   - Client components for interactivity
   - Zustand for audio player state management

2. **Authentication (Better Auth)**
   - Email/password authentication
   - Session management
   - Polar integration for customer tracking

3. **Database (Prisma + PostgreSQL)**
   - Type-safe database access
   - Relationship management
   - Migration system

4. **Async Processing (Inngest)**
   - Event-driven architecture
   - Background job processing
   - Automatic retries on failure
   - Concurrency control per user

5. **AI Processing (Modal)**
   - Serverless GPU computing
   - On-demand model loading
   - Auto-scaling infrastructure
   - Multi-model pipeline

6. **Storage (Backblaze B2)**
   - S3-compatible object storage
   - Audio file storage (.wav)
   - Album cover storage (.png)
   - Pre-signed URL generation

7. **Payments (Polar)**
   - Webhook-based credit system
   - Customer portal integration
   - Subscription management

---

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.3 | React framework with App Router |
| **TypeScript** | 5.8.2 | Type-safe development |
| **React** | 19.0.0 | UI library |
| **Tailwind CSS** | 4.0.15 | Utility-first CSS framework |
| **Prisma** | 6.5.0 | Database ORM |
| **Better Auth** | 1.3.18 | Authentication solution |
| **Inngest** | 3.43.1 | Background job processing |
| **Zustand** | 5.0.8 | State management (audio player) |
| **next-themes** | 0.4.6 | Theme management |
| **Radix UI** | Latest | Accessible component primitives |
| **Sonner** | 2.0.7 | Toast notifications |
| **AWS SDK** | 3.901.0 | S3-compatible storage client |

### Backend & AI
| Technology | Version | Purpose |
|------------|---------|---------|
| **Modal** | Latest | Serverless AI model hosting |
| **Python** | 3.12+ | Backend runtime |
| **ACE-Step** | Latest | Music generation model |
| **Qwen 2-7B** | Latest | LLM for prompts/lyrics |
| **SDXL Turbo** | Latest | Album cover generation |
| **Transformers** | 4.56.2 | ML model library |
| **Diffusers** | 0.35.1 | Diffusion model library |
| **PyTorch** | 2.8.0 | Deep learning framework |
| **Boto3** | 1.40.39 | S3 client library |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Neon** | PostgreSQL database hosting |
| **Backblaze B2** | S3-compatible object storage |
| **Polar** | Payment processing & subscriptions |
| **Vercel** | Frontend deployment (recommended) |
| **Modal** | AI model serverless hosting |

---

## 🔄 System Flow

### Music Generation Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant ServerAction
    participant Inngest
    participant Database
    participant Modal
    participant B2Storage
    
    User->>Frontend: Fill generation form
    User->>Frontend: Click "Generate"
    
    Frontend->>ServerAction: generateSong(request)
    
    Note over ServerAction: Validates user session
    
    ServerAction->>Database: Create Song record (status: queued)
    ServerAction->>Database: Create Song record (guidance: 7.5)
    ServerAction->>Database: Create Song record (guidance: 15)
    
    ServerAction->>Inngest: Send "generate-song-event" (Song 1)
    ServerAction->>Inngest: Send "generate-song-event" (Song 2)
    
    ServerAction-->>Frontend: Success response
    Frontend-->>User: Show "Generation queued" message
    
    Note over Inngest: Background Processing Starts
    
    Inngest->>Database: Check user credits
    
    alt User has credits
        Inngest->>Database: Update status: "processing"
        Inngest->>Modal: POST to AI endpoint
        
        Note over Modal: Load Models on GPU
        Modal->>Modal: Generate prompt (if needed)
        Modal->>Modal: Generate lyrics (if needed)
        Modal->>Modal: Generate music (ACE-Step)
        Modal->>Modal: Generate cover art (SDXL)
        Modal->>Modal: Auto-categorize (Qwen)
        Modal->>B2Storage: Upload .wav file
        Modal->>B2Storage: Upload .png cover
        
        Modal-->>Inngest: Return S3 keys + categories
        
        Inngest->>Database: Update Song (s3Key, thumbnailS3Key, status: processed)
        Inngest->>Database: Connect categories
        Inngest->>Database: Deduct 1 credit from user
    else No credits
        Inngest->>Database: Update status: "no credits"
    end
    
    Note over Frontend: User refreshes or navigates
    Frontend->>Database: Fetch songs
    Database-->>Frontend: Return song with status
    Frontend-->>User: Show playable song
```

### Remix Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant RemixAction
    participant Database
    participant Inngest
    participant Modal
    
    User->>Frontend: Click "Create Remix" on song
    Frontend->>RemixAction: createRemix(songId)
    
    RemixAction->>Database: Find original song
    RemixAction->>Database: Create remix (guidance: 10)
    RemixAction->>Database: Create remix (guidance: 20)
    
    Note over Database: Sets parentSongId & isRemix=true
    
    RemixAction->>Inngest: Queue remix generation (×2)
    
    Note over Inngest,Modal: Same generation flow as above
    
    Frontend-->>User: Show remixes in history
```

### Authentication & Payment Flow

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant BetterAuth
    participant Database
    participant Polar
    
    rect rgb(59, 130, 246)
        Note over User,Database: Sign Up Flow
        User->>Frontend: Enter email/password
        Frontend->>BetterAuth: sign-up request
        BetterAuth->>Database: Create User (100 credits)
        BetterAuth->>Polar: Create customer
        Polar-->>BetterAuth: Return customer ID
        BetterAuth->>Database: Store Polar customer ID
        BetterAuth-->>Frontend: Return session
    end
    
    rect rgb(236, 72, 153)
        Note over User,Database: Purchase Credits Flow
        User->>Frontend: Click "Upgrade"
        Frontend->>Polar: Redirect to checkout
        User->>Polar: Complete payment
        Polar->>Frontend: POST /api/polar/webhook
        Frontend->>Database: Add credits to user
        Frontend-->>User: Show updated balance
    end
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o{ Song : creates
    User ||--o{ Like : gives
    User ||--o{ Favorite : marks
    User ||--o{ Comment : writes
    User ||--o{ Playlist : owns
    User ||--o{ Follow : "follows/followed_by"
    User {
        string id PK
        string name
        string email UK
        boolean emailVerified
        string image
        string bio
        int credits
        datetime createdAt
        datetime updatedAt
    }
    
    Song ||--o{ Like : receives
    Song ||--o{ Favorite : receives
    Song ||--o{ Comment : receives
    Song ||--o{ PlaylistSong : "in"
    Song ||--o{ Song : "remixes (self-relation)"
    Song }o--o{ Category : "has"
    Song {
        string id PK
        string userId FK
        string title
        string s3Key
        string thumbnailS3Key
        string status
        boolean instrumental
        string prompt
        string lyrics
        string fullDescribedSong
        string describedLyrics
        float guidanceScale
        float inferStep
        float audioDuration
        float seed
        int bpm
        boolean published
        int listenCount
        int downloadCount
        string parentSongId FK "for remixes"
        boolean isRemix
        datetime createdAt
        datetime updatedAt
    }
    
    Like {
        string userId FK
        string songId FK
        datetime createdAt
    }
    
    Favorite {
        string userId FK
        string songId FK
        datetime createdAt
    }
    
    Comment {
        string id PK
        string userId FK
        string songId FK
        string content
        datetime createdAt
        datetime updatedAt
    }
    
    Playlist ||--o{ PlaylistSong : contains
    Playlist {
        string id PK
        string userId FK
        string name
        string description
        boolean isPublic
        string coverImage
        datetime createdAt
        datetime updatedAt
    }
    
    PlaylistSong {
        string playlistId FK
        string songId FK
        int position
        datetime addedAt
    }
    
    Follow {
        string followerId FK
        string followingId FK
        datetime createdAt
    }
    
    Category {
        string id PK
        string name UK
    }
```

### Key Database Relationships

- **User** ↔ **Song**: One-to-many (user creates multiple songs)
- **Song** ↔ **Song**: Self-referencing for remixes (parentSongId)
- **User** ↔ **Like/Favorite**: Many-to-many through junction tables
- **Song** ↔ **Category**: Many-to-many (auto-categorization)
- **User** ↔ **Follow**: Self-referencing many-to-many (social graph)
- **Playlist** ↔ **Song**: Many-to-many through PlaylistSong (with position)

### Song Status States

```
queued → processing → processed
                   → failed
                   → no credits
```

---

## 📋 Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** (package manager) - `npm install -g pnpm`
- **Python** 3.12+ ([Download](https://www.python.org/))
- **uv** (Python package manager) - `pip install uv`

### Required Services
- **PostgreSQL Database**: [Neon](https://neon.tech) (recommended) or local PostgreSQL
- **Modal Account**: [modal.com](https://modal.com) - For AI processing
- **Backblaze B2**: [backblaze.com](https://www.backblaze.com/b2/cloud-storage.html) - For file storage
- **Polar Account**: [polar.sh](https://polar.sh) - For payments
- **Inngest Account**: [inngest.com](https://www.inngest.com) - For background jobs (optional for local dev)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd melodymaker-ai
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
pnpm install
```

**Backend:**
```bash
cd backend
uv sync
```

### 3. Setup Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Authentication (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET="your-secure-random-string-here"

# Better Auth URL (for production)
BETTER_AUTH_URL="https://your-domain.com"

# Modal AI Processing
MODAL_KEY="your-modal-key"
MODAL_SECRET="your-modal-secret"

# Backblaze B2 Storage
B2_KEY_ID="your-b2-key-id"
B2_APP_KEY="your-b2-app-key"
B2_ENDPOINT="https://s3.us-east-005.backblazeb2.com"
B2_BUCKET_NAME="your-bucket-name"

# AI Model Endpoints (get after deploying to Modal)
GENERATE_FROM_DESCRIPTION="https://your-app--music-gen-server-generate-with-description.modal.run"
GENERATE_FROM_DESCRIBED_LYRICS="https://your-app--music-gen-server-generate-with-described-lyrics.modal.run"
GENERATE_WITH_LYRICS="https://your-app--music-gen-server-generate-with-lyrics.modal.run"

# Polar Payments
POLAR_ACCESS_TOKEN="polar_oat_your-token"
POLAR_WEBHOOK_SECRET="polar_whs_your-webhook-secret"

# Inngest (optional for local dev, required for production)
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"
```

### 4. Setup Backblaze B2

1. Create a B2 account at [backblaze.com](https://www.backblaze.com/b2/cloud-storage.html)
2. Create a bucket (e.g., `melodymaker-storage`)
3. Generate application key with read/write permissions
4. Configure CORS for your bucket:

```json
[
  {
    "corsRuleName": "allowAll",
    "allowedOrigins": ["*"],
    "allowedHeaders": ["*"],
    "allowedOperations": ["b2_download_file_by_name"],
    "maxAgeSeconds": 3600
  }
]
```

### 5. Setup Modal (AI Backend)

```bash
cd backend

# Install Modal CLI
uv add modal

# Authenticate with Modal
uv run modal token new

# Create secrets in Modal
uv run modal secret create melodymaker-secret \
  B2_BUCKET_NAME="your-bucket-name" \
  B2_KEY_ID="your-key-id" \
  B2_APP_KEY="your-app-key" \
  B2_ENDPOINT="https://s3.us-east-005.backblazeb2.com"

# Deploy to Modal
uv run modal deploy main.py
```

After deployment, Modal will provide URLs for your endpoints. Copy these to your frontend `.env` file.

### 6. Setup Database

```bash
cd frontend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

### 7. Run Development Server

**Option A: Frontend Only (using deployed Modal)**
```bash
cd frontend
pnpm dev
```

**Option B: Full Local Development**
```bash
# Terminal 1 - Frontend
cd frontend
pnpm dev

# Terminal 2 - Modal (local testing)
cd backend
uv run modal serve main.py
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
melodymaker-ai/
├── frontend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── dev.db                 # SQLite (for local dev)
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── actions/               # Server Actions (Backend Logic)
│   │   │   ├── comment.ts         # Comment CRUD operations
│   │   │   ├── download.ts        # Song download with tracking
│   │   │   ├── favorite.ts        # Favorite management
│   │   │   ├── follow.ts          # Follow/unfollow system
│   │   │   ├── generation.ts      # Music generation queueing
│   │   │   ├── history.ts         # Generation history & stats
│   │   │   ├── playlist.ts        # Playlist management
│   │   │   ├── remix.ts           # Remix creation
│   │   │   ├── search.ts          # Advanced search
│   │   │   └── song.ts            # Song operations (like, rename, publish)
│   │   ├── app/
│   │   │   ├── (auth)/            # Authentication routes (grouped)
│   │   │   │   ├── account/[path]/ # Account management
│   │   │   │   ├── auth/[path]/    # Sign in/up pages
│   │   │   │   └── layout.tsx      # Auth layout
│   │   │   ├── (main)/            # Main app routes (grouped)
│   │   │   │   ├── analytics/     # Analytics dashboard
│   │   │   │   ├── create/        # Music generation page
│   │   │   │   ├── customer-portal/ # Polar customer portal
│   │   │   │   ├── favorites/     # Favorite songs page
│   │   │   │   ├── history/       # Generation history
│   │   │   │   ├── layout.tsx     # Main app layout (with sidebar)
│   │   │   │   ├── page.tsx       # Home/Discovery feed
│   │   │   │   ├── playlists/     # Playlist management
│   │   │   │   ├── profile/       # User profiles (in progress)
│   │   │   │   ├── search/        # Advanced search page
│   │   │   │   └── upgrade/       # Credit purchase page
│   │   │   └── api/
│   │   │       ├── auth/[...all]/ # Better Auth API routes
│   │   │       └── inngest/       # Inngest webhook endpoint
│   │   ├── components/
│   │   │   ├── back-button.tsx
│   │   │   ├── create/
│   │   │   │   ├── rename-dialog.tsx
│   │   │   │   ├── song-panel.tsx
│   │   │   │   ├── track-list-fetcher.tsx
│   │   │   │   └── track-list.tsx
│   │   │   ├── customer-portal-redirect.tsx
│   │   │   ├── history/
│   │   │   │   └── history-list.tsx
│   │   │   ├── home/
│   │   │   │   └── song-card.tsx
│   │   │   ├── playlists/
│   │   │   │   └── playlist-grid.tsx
│   │   │   ├── providers.tsx      # Theme + Toast providers
│   │   │   ├── search/
│   │   │   ├── sidebar/
│   │   │   │   ├── app-sidebar.tsx
│   │   │   │   ├── breadcrumb-page-client.tsx
│   │   │   │   ├── credits.tsx
│   │   │   │   ├── sidebar-menu-items.tsx
│   │   │   │   └── upgrade.tsx
│   │   │   ├── song-actions.tsx   # Like, favorite, download, remix
│   │   │   ├── sound-bar.tsx      # Audio player
│   │   │   ├── theme-toggle.tsx   # Dark/light mode toggle
│   │   │   └── ui/                # Radix UI components
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── dialog.tsx
│   │   │       └── ...
│   │   ├── env.js                 # Environment variable validation
│   │   ├── hooks/
│   │   │   └── use-mobile.ts      # Mobile detection hook
│   │   ├── inngest/
│   │   │   ├── client.ts          # Inngest client setup
│   │   │   └── functions.ts       # Background job: generateSong
│   │   ├── lib/
│   │   │   ├── auth-client.ts     # Better Auth client config
│   │   │   ├── auth.ts            # Better Auth server config
│   │   │   └── utils.ts           # Utility functions
│   │   ├── server/
│   │   │   └── db.ts              # Prisma client instance
│   │   ├── stores/
│   │   │   └── use-player-store.ts # Zustand audio player state
│   │   └── styles/
│   │       └── globals.css        # Global styles + Tailwind
│   ├── .env                       # Environment variables
│   ├── components.json            # shadcn/ui config
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── prettier.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── main.py                    # Modal app with AI endpoints
│   ├── prompts.py                 # Prompt templates for Qwen
│   ├── pyproject.toml             # Python dependencies (uv)
│   ├── uv.lock                    # Dependency lock file
│   └── README.md
│
├── README.md                      # This file
├── SETUP.md                       # Detailed setup guide
└── QUICK_TEST.md                  # Testing guide
```

---

## ⚙️ Configuration

### Better Auth Setup

The app uses Better Auth with Polar integration:

```typescript
// src/lib/auth.ts
export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite" // or "postgresql" for production
  }),
  socialProviders: {},
  plugins: [
    polar({
      polarAccessToken: env.POLAR_ACCESS_TOKEN,
      polarWebhookSecret: env.POLAR_WEBHOOK_SECRET,
      // Auto-creates Polar customer on signup
      createCustomerOnSignup: true
    })
  ]
})
```

### Inngest Configuration

Inngest handles background music generation with concurrency control:

```typescript
// src/inngest/functions.ts
export const generateSong = inngest.createFunction(
  {
    id: "generate-song-event",
    concurrency: {
      limit: 1,                    // Max 1 job at a time
      key: "event.data.userId"     // Per user
    },
    onFailure: async ({ event }) => {
      // Automatically marks song as "failed"
      await db.song.update({
        where: { id: event.data.songId },
        data: { status: "failed" }
      })
    }
  },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    // Step 1: Check credits
    // Step 2: Set status to "processing"
    // Step 3: Call Modal API
    // Step 4: Update song with results
    // Step 5: Deduct credits
  }
)
```

**Key Features:**
- ✅ Only 1 generation per user at a time
- ✅ Automatic retry on transient failures
- ✅ Graceful error handling
- ✅ Step-based execution with rollback support

### Modal Configuration

Modal runs AI models on serverless GPUs:

```python
# backend/main.py
@app.cls(
    image=image,
    secrets=[melodymaker_secrets],
    gpu="L40S",                    # GPU type
    volumes={
        "/models": modal_volume,
        "/.cache/huggingface": hf_volume
    },
    scaledown_window=15            # Keep warm for 15 seconds
)
class MusicGenServer:
    @modal.enter()
    def load_modal(self):
        # Load ACE-Step, Qwen, SDXL models
        pass
    
    @modal.fastapi_endpoint(method="POST", requires_proxy_auth=True)
    def generate_with_description(self, request):
        # Generate prompt → lyrics → music → cover
        pass
```

**Features:**
- ✅ Auto-scaling based on demand
- ✅ Model caching with Modal volumes
- ✅ Proxy authentication for security
- ✅ Multiple endpoints for different generation modes

---

## 🔧 Server Actions API

MelodyMakerAI uses **Next.js Server Actions** instead of REST API routes. All backend logic is in `/src/actions/`.

### Generation Actions (`generation.ts`)

#### `generateSong(request: GenerateRequest)`

Queues music generation (creates 2 songs with different guidance scales).

**Parameters:**
```typescript
interface GenerateRequest {
  prompt?: string              // Music style description
  lyrics?: string              // Custom lyrics
  fullDescribedSong?: string   // Complete song description (Simple Mode)
  describedLyrics?: string     // Lyrics description (AI generates lyrics)
  instrumental?: boolean       // True for instrumental only
}
```

**Behavior:**
1. Validates user session
2. Creates 2 Song records (guidance scales 7.5 and 15)
3. Queues 2 Inngest events
4. Returns immediately (async processing)

**Example:**
```typescript
"use server"
import { generateSong } from "@/actions/generation"

// Simple Mode
await generateSong({
  fullDescribedSong: "upbeat electronic dance music",
  instrumental: false
})

// Custom Mode
await generateSong({
  prompt: "rock, aggressive, 140BPM",
  lyrics: "[verse]\nYour custom lyrics here...",
  instrumental: false
})
```

#### `getPlayUrl(songId: string)`

Gets pre-signed URL for song playback (increments listen count).

**Returns:** `string` - Pre-signed S3 URL (valid for 1 hour)

### Song Actions (`song.ts`)

#### `ToggleLikeSong(songId: string)`

Toggles like status for a song.

#### `setPublishedStatus(songId: string, published: boolean)`

Publishes or unpublishes a song (only owner can call).

#### `renameSong(songId: string, newTitle: string)`

Renames a song (only owner can call).

### Remix Actions (`remix.ts`)

#### `createRemix(songId: string)`

Creates 2 remix variations of an existing song (guidance scales 10 and 20).

**Example:**
```typescript
import { createRemix } from "@/actions/remix"

await createRemix("song-id-here")
// Creates 2 remixes with isRemix=true and parentSongId set
```

### Favorite Actions (`favorite.ts`)

#### `toggleFavorite(songId: string)`

Adds/removes song from user's favorites.

#### `getFavorites()`

Returns all user's favorited songs.

### Playlist Actions (`playlist.ts`)

#### `createPlaylist(name: string, description?: string)`

Creates a new playlist.

#### `addSongToPlaylist(playlistId: string, songId: string)`

Adds song to playlist with auto-incremented position.

#### `removeSongFromPlaylist(playlistId: string, songId: string)`

Removes song from playlist.

### Download Actions (`download.ts`)

#### `downloadSong(songId: string)`

Generates download URL and increments download count.

**Returns:** `string` - Pre-signed download URL

**Example:**
```typescript
import { downloadSong } from "@/actions/download"

const url = await downloadSong("song-id")
// Client-side: window.open(url, '_blank')
```

### History Actions (`history.ts`)

#### `getGenerationHistory(filters?)`

Returns paginated generation history with filters.

**Parameters:**
```typescript
interface HistoryFilters {
  status?: "queued" | "processing" | "processed" | "failed"
  isRemix?: boolean
  limit?: number
  offset?: number
}
```

#### `getGenerationStats()`

Returns analytics statistics.

**Returns:**
```typescript
interface Stats {
  totalSongs: number
  successRate: number
  totalPlays: number
  totalLikes: number
  totalComments: number
  statusBreakdown: { status: string, count: number }[]
}
```

### Search Actions (`search.ts`)

#### `searchSongs(query: string, filters?)`

Advanced song search.

**Parameters:**
```typescript
interface SearchFilters {
  category?: string
  minBpm?: number
  maxBpm?: number
  artistId?: string
}
```

---

## 📚 End-to-End Examples

### Example 1: Complete Music Generation Flow

```typescript
"use client"
import { useState } from "react"
import { generateSong } from "@/actions/generation"
import { toast } from "sonner"

export function GenerateForm() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      await generateSong({
        prompt: formData.get("prompt") as string,
        lyrics: formData.get("lyrics") as string,
        instrumental: formData.get("instrumental") === "on"
      })
      
      toast.success("Generation queued! Check your history.")
    } catch (error) {
      toast.error("Failed to queue generation")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" placeholder="rock, aggressive, 140BPM" />
      <textarea name="lyrics" placeholder="[verse]..." />
      <label>
        <input type="checkbox" name="instrumental" />
        Instrumental
      </label>
      <button disabled={loading}>
        {loading ? "Queueing..." : "Generate"}
      </button>
    </form>
  )
}
```

**What happens:**
1. Form submits → calls `generateSong()` Server Action
2. Server Action creates 2 Song records (status: "queued")
3. Server Action sends 2 Inngest events
4. User sees success message immediately
5. **Background (Inngest):**
   - Checks user credits
   - Sets status: "processing"
   - Calls Modal API (takes 30-60 seconds)
   - Modal generates music + cover art
   - Uploads to B2 storage
   - Updates Song with S3 keys
   - Sets status: "processed"
   - Deducts 1 credit
6. User refreshes → sees playable song

---

### Example 2: Playing a Song

```typescript
"use client"
import { usePlayerStore } from "@/stores/use-player-store"
import { getPlayUrl } from "@/actions/generation"

export function SongCard({ song }) {
  const { setCurrentSong, play } = usePlayerStore()
  
  async function handlePlay() {
    // Get pre-signed URL (increments listen count)
    const url = await getPlayUrl(song.id)
    
    // Update global player state
    setCurrentSong({
      id: song.id,
      title: song.title,
      url: url,
      thumbnail: song.thumbnailUrl
    })
    
    play()
  }
  
  return (
    <div>
      <img src={song.thumbnailUrl} alt={song.title} />
      <h3>{song.title}</h3>
      <button onClick={handlePlay}>▶ Play</button>
    </div>
  )
}
```

---

### Example 3: Creating a Remix

```typescript
"use client"
import { createRemix } from "@/actions/remix"
import { toast } from "sonner"

export function RemixButton({ songId }) {
  async function handleRemix() {
    try {
      await createRemix(songId)
      toast.success("Remix queued! 2 variations will be created.")
    } catch (error) {
      toast.error("Failed to create remix")
    }
  }
  
  return (
    <button onClick={handleRemix}>
      🔄 Create Remix
    </button>
  )
}
```

**What happens:**
1. Creates 2 new Song records with:
   - `parentSongId` = original song ID
   - `isRemix` = true
   - `guidanceScale` = 10 and 20
   - Same prompt/lyrics as original
2. Queues 2 Inngest events
3. Background processing generates variations

---

### Example 4: Building Analytics Dashboard

```typescript
import { getGenerationStats } from "@/actions/history"

export default async function AnalyticsPage() {
  const stats = await getGenerationStats()
  
  return (
    <div>
      <h1>Analytics</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <h3>Total Songs</h3>
          <p className="text-3xl">{stats.totalSongs}</p>
        </Card>
        
        <Card>
          <h3>Success Rate</h3>
          <p className="text-3xl">{stats.successRate}%</p>
        </Card>
        
        <Card>
          <h3>Total Plays</h3>
          <p className="text-3xl">{stats.totalPlays}</p>
        </Card>
        
        <Card>
          <h3>Total Likes</h3>
          <p className="text-3xl">{stats.totalLikes}</p>
        </Card>
      </div>
      
      <h2>Status Breakdown</h2>
      <ul>
        {stats.statusBreakdown.map(item => (
          <li key={item.status}>
            {item.status}: {item.count}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

### Example 5: Implementing Favorites

```typescript
"use client"
import { toggleFavorite } from "@/actions/favorite"
import { useState } from "react"

export function FavoriteButton({ songId, initialFavorited }) {
  const [favorited, setFavorited] = useState(initialFavorited)
  
  async function handleToggle() {
    setFavorited(!favorited)
    
    try {
      await toggleFavorite(songId)
    } catch (error) {
      // Revert on error
      setFavorited(!favorited)
    }
  }
  
  return (
    <button onClick={handleToggle}>
      {favorited ? "⭐ Favorited" : "☆ Favorite"}
    </button>
  )
}
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel - Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **Root Directory**: `frontend`
   - Add all environment variables (see [Environment Variables](#-environment-variables))
   - Click "Deploy"

3. **Post-Deployment**
   - Update `BETTER_AUTH_URL` in Vercel env vars to your production URL
   - Update Polar webhook URL to `https://your-domain.com/api/polar/webhook`

### Backend Deployment (Modal)

1. **Authenticate with Modal**
   ```bash
   cd backend
   uv run modal token new
   ```

2. **Create Production Secrets**
   ```bash
   uv run modal secret create melodymaker-secret \
     B2_BUCKET_NAME="your-bucket" \
     B2_KEY_ID="your-key" \
     B2_APP_KEY="your-app-key" \
     B2_ENDPOINT="https://s3.us-east-005.backblazeb2.com"
   ```

3. **Deploy to Modal**
   ```bash
   uv run modal deploy main.py
   ```

4. **Get Endpoint URLs**
   Modal will output URLs like:
   ```
   ✓ MusicGenServer.generate_with_description
     https://your-app--music-gen-server-generate-with-description.modal.run
   
   ✓ MusicGenServer.generate_with_described_lyrics
     https://your-app--music-gen-server-generate-with-described-lyrics.modal.run
   
   ✓ MusicGenServer.generate_with_lyrics
     https://your-app--music-gen-server-generate-with-lyrics.modal.run
   ```

5. **Update Frontend Environment Variables**
   Add these URLs to Vercel environment variables:
   - `GENERATE_FROM_DESCRIPTION`
   - `GENERATE_FROM_DESCRIBED_LYRICS`
   - `GENERATE_WITH_LYRICS`

### Database Deployment (Neon - Recommended)

1. **Create Neon Project**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Update Environment Variables**
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

3. **Push Schema**
   ```bash
   cd frontend
   npx prisma db push
   ```

### Inngest Deployment

1. **Create Inngest Account**
   - Go to [inngest.com](https://www.inngest.com)
   - Create new project
   - Get event key and signing key

2. **Add to Vercel Environment Variables**
   ```bash
   INNGEST_EVENT_KEY="your-event-key"
   INNGEST_SIGNING_KEY="your-signing-key"
   ```

3. **Sync Inngest Functions**
   - Deploy to Vercel
   - Go to Inngest dashboard
   - Navigate to "Apps"
   - Click "Sync" next to your app
   - Inngest will discover functions from `/api/inngest`

### Polar Webhook Setup

1. **Get Webhook Secret**
   - Go to Polar dashboard
   - Settings → Webhooks
   - Create webhook for `checkout.completed` event
   - URL: `https://your-domain.com/api/polar/webhook`
   - Copy webhook secret

2. **Add to Environment Variables**
   ```bash
   POLAR_WEBHOOK_SECRET="polar_whs_your-secret"
   ```

---

## 🔐 Environment Variables

### Complete `.env` Reference

```bash
# ================================
# DATABASE
# ================================
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# ================================
# AUTHENTICATION
# ================================
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secure-random-string-here"

# Production URL (for Better Auth redirects)
BETTER_AUTH_URL="https://your-production-domain.com"

# ================================
# MODAL AI PROCESSING
# ================================
MODAL_KEY="your-modal-api-key"
MODAL_SECRET="your-modal-api-secret"

# ================================
# BACKBLAZE B2 STORAGE
# ================================
B2_KEY_ID="your-b2-application-key-id"
B2_APP_KEY="your-b2-application-key"
B2_ENDPOINT="https://s3.us-east-005.backblazeb2.com"
B2_BUCKET_NAME="your-bucket-name"

# ================================
# AI MODEL ENDPOINTS (from Modal)
# ================================
GENERATE_FROM_DESCRIPTION="https://your-app--music-gen-server-generate-with-description.modal.run"
GENERATE_FROM_DESCRIBED_LYRICS="https://your-app--music-gen-server-generate-with-described-lyrics.modal.run"
GENERATE_WITH_LYRICS="https://your-app--music-gen-server-generate-with-lyrics.modal.run"

# ================================
# POLAR PAYMENTS
# ================================
POLAR_ACCESS_TOKEN="polar_oat_your-access-token"
POLAR_WEBHOOK_SECRET="polar_whs_your-webhook-secret"

# ================================
# INNGEST (Background Jobs)
# ================================
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# ================================
# OPTIONAL - Development
# ================================
# Skip environment validation (for Docker builds)
SKIP_ENV_VALIDATION="false"

# Node environment
NODE_ENV="development" # or "production"
```

### Environment Variable Validation

The app uses `@t3-oss/env-nextjs` for type-safe environment variables. All required variables are validated at build time in `/src/env.js`.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd frontend
npx prisma generate
```

#### 2. Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
- Check `DATABASE_URL` format
- Ensure database allows connections from your IP
- For Neon: verify SSL mode is set (`?sslmode=require`)

#### 3. Modal Deployment Failed

**Error:** `Authentication failed`

**Solution:**
```bash
uv run modal token new
# Follow prompts to re-authenticate
```

#### 4. Inngest Functions Not Syncing

**Error:** Functions not appearing in Inngest dashboard

**Solution:**
- Ensure `/api/inngest/route.ts` is deployed
- Check Vercel deployment logs
- Manually sync in Inngest dashboard: Apps → Your App → Sync

#### 5. Song Generation Stuck on "queued"

**Possible causes:**
- Inngest not configured correctly
- Modal endpoints not accessible
- User has no credits

**Debug steps:**
```bash
# Check Inngest logs in dashboard
# Check Vercel function logs
# Check Modal logs: modal app list → view logs
```

#### 6. Audio Files Not Playing

**Error:** 403 Forbidden or CORS error

**Solution:**
- Check B2 bucket CORS configuration
- Verify pre-signed URL is valid (check expiration)
- Ensure `B2_ENDPOINT` uses correct region

#### 7. TypeScript Errors After Update

**Solution:**
```bash
cd frontend
rm -rf node_modules .next
pnpm install
npx prisma generate
pnpm dev
```

### Debug Mode

Enable verbose logging:

```typescript
// src/inngest/functions.ts
export const generateSong = inngest.createFunction(
  {
    id: "generate-song-event",
    // Add logging
    middleware: [
      async ({ step }) => {
        console.log("Step executed:", step.name)
      }
    ]
  },
  // ...
)
```

### Health Checks

**Check Modal Status:**
```bash
cd backend
uv run modal app list
uv run modal app logs your-app-name
```

**Check Database Connection:**
```bash
cd frontend
npx prisma db push --dry-run
```

**Check Inngest Status:**
- Go to [inngest.com](https://www.inngest.com) dashboard
- Check "Events" tab for incoming events
- Check "Runs" tab for function executions

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   cd frontend
   pnpm check        # Lint + TypeCheck
   pnpm format:write # Format code
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention

We use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Code Style

- **Frontend**: ESLint + Prettier (runs on commit)
- **Backend**: Black + Ruff (Python)
- Use TypeScript strict mode
- Write meaningful component/function names
- Add JSDoc comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies
- [Modal](https://modal.com) - Serverless GPU infrastructure
- [Polar](https://polar.sh) - Payment processing
- [Better Auth](https://better-auth.dev) - Authentication
- [Inngest](https://www.inngest.com) - Background job processing
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Backblaze](https://www.backblaze.com) - S3-compatible storage
- [Vercel](https://vercel.com) - Frontend deployment

### AI Models
- **ACE-Step** - Music generation model
- **Qwen 2-7B Instruct** - LLM for prompts/lyrics
- **Stable Diffusion XL Turbo** - Album cover generation

### UI Components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Lucide](https://lucide.dev/) - Icons

---

## 📞 Support

- **Documentation**: [SETUP.md](SETUP.md) - Detailed setup instructions
- **Architecture**: [ARCHITECTURE.md](ARCHITECTURE.md) - Technical deep dive
- **Examples**: [examples/](examples/) - Practical code examples
- **Testing Guide**: [QUICK_TEST.md](QUICK_TEST.md) - Testing checklist

---

<div align="center">


[⬆ Back to Top](#melodymaker-ai-)

</div>