# Example 3: Inngest Background Job Processing

This example shows how to create and handle background jobs with Inngest.

## Setup Inngest Client

```typescript
// inngest/client.ts
import { Inngest } from "inngest"

export const inngest = new Inngest({ 
  id: "melodymaker-ai",
  // Optional: add event key for cloud deployment
  eventKey: process.env.INNGEST_EVENT_KEY 
})
```

## Create Background Function

```typescript
// inngest/functions.ts
import { inngest } from "./client"
import { db } from "~/server/db"
import { env } from "~/env"

export const generateSong = inngest.createFunction(
  {
    id: "generate-song-event",
    
    // Concurrency: max 1 job per user at a time
    concurrency: {
      limit: 1,
      key: "event.data.userId"
    },
    
    // Retry config
    retries: 3,
    
    // Error handler
    onFailure: async ({ event, error }) => {
      console.error("Generation failed:", error)
      
      await db.song.update({
        where: { id: event.data.songId },
        data: { status: "failed" }
      })
    }
  },
  
  // Event trigger
  { event: "generate-song-event" },
  
  // Handler function
  async ({ event, step }) => {
    const { songId, userId } = event.data

    // Step 1: Check user credits
    const { credits, endpoint, body } = await step.run("check-credits", async () => {
      const song = await db.song.findUniqueOrThrow({
        where: { id: songId },
        include: {
          user: {
            select: {
              id: true,
              credits: true
            }
          }
        }
      })

      return {
        credits: song.user.credits,
        endpoint: env.GENERATE_FROM_DESCRIPTION,
        body: {
          full_described_song: song.fullDescribedSong,
          guidance_scale: song.guidanceScale,
          audio_duration: song.audioDuration,
          instrumental: song.instrumental
        }
      }
    })

    if (credits === 0) {
      await step.run("no-credits", async () => {
        await db.song.update({
          where: { id: songId },
          data: { status: "no credits" }
        })
      })
      return
    }

    // Step 2: Update status
    await step.run("set-processing", async () => {
      await db.song.update({
        where: { id: songId },
        data: { status: "processing" }
      })
    })

    // Step 3: Call AI API (with automatic retry)
    const response = await step.fetch("call-modal-api", endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Modal-Key": env.MODAL_KEY,
        "Modal-Secret": env.MODAL_SECRET
      },
      body: JSON.stringify(body)
    })

    // Step 4: Update song with results
    await step.run("update-song", async () => {
      const data = await response.json()

      await db.song.update({
        where: { id: songId },
        data: {
          s3Key: data.s3_key,
          thumbnailS3Key: data.cover_image_s3_key,
          status: "processed",
          categories: {
            connectOrCreate: data.categories.map((name: string) => ({
              where: { name },
              create: { name }
            }))
          }
        }
      })
    })

    // Step 5: Deduct credits
    await step.run("deduct-credits", async () => {
      await db.user.update({
        where: { id: userId },
        data: {
          credits: { decrement: 1 }
        }
      })
    })

    return { success: true }
  }
)
```

## Register Function

```typescript
// app/api/inngest/route.ts
import { serve } from "inngest/next"
import { inngest } from "~/inngest/client"
import { generateSong } from "~/inngest/functions"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateSong,
    // Add more functions here
  ]
})
```

## Trigger Event from Server Action

```typescript
// actions/generation.ts
"use server"

import { inngest } from "~/inngest/client"
import { db } from "~/server/db"

export async function queueGeneration(userId: string, data: SongData) {
  // 1. Create database record
  const song = await db.song.create({
    data: {
      userId,
      ...data,
      status: "queued"
    }
  })

  // 2. Emit event (non-blocking)
  await inngest.send({
    name: "generate-song-event",
    data: {
      songId: song.id,
      userId: userId
    }
  })

  // 3. Return immediately
  return { songId: song.id }
}
```

## Local Development

```bash
# Terminal 1: Run Inngest Dev Server
npx inngest-cli@latest dev

# Terminal 2: Run Next.js
pnpm dev

# Visit http://localhost:8288 to see Inngest dashboard
```

## Cloud Deployment

```bash
# 1. Set environment variables in Vercel
INNGEST_EVENT_KEY="..."
INNGEST_SIGNING_KEY="..."

# 2. Deploy to Vercel
vercel --prod

# 3. Sync functions in Inngest dashboard
# Go to https://app.inngest.com
# Navigate to your app → Click "Sync"
```

## Key Features

### 1. **Step-Based Execution**
Each `step.run()` is retried independently if it fails.

```typescript
// If "call-modal-api" fails, only that step retries
// Previous steps (check-credits, set-processing) don't re-run
await step.run("check-credits", async () => {...})
await step.run("set-processing", async () => {...})
await step.run("call-modal-api", ...) // 👈 Fails and retries
```

### 2. **Automatic Retries**
```typescript
retries: 3  // Automatically retries failed steps
```

### 3. **Concurrency Control**
```typescript
concurrency: {
  limit: 1,
  key: "event.data.userId"  // Only 1 job per user
}
```

### 4. **Built-in Fetch with Retry**
```typescript
// Automatically retries on network errors
const response = await step.fetch("api-call", url, options)
```

### 5. **Error Handling**
```typescript
onFailure: async ({ event, error }) => {
  // Cleanup on failure
  await db.song.update({...})
}
```

## Monitoring

### Inngest Dashboard
1. Go to [https://app.inngest.com](https://app.inngest.com)
2. View:
   - **Events**: All emitted events
   - **Runs**: Function executions
   - **Logs**: Step-by-step execution logs
   - **Errors**: Failed runs with stack traces

### Example Dashboard Views

```
Events
├── generate-song-event (5 pending)
├── generate-song-event (12 completed)
└── generate-song-event (1 failed)

Runs
├── Run #123 - In Progress (Step 3/5)
├── Run #122 - Completed (42s)
└── Run #121 - Failed (Retry 2/3)
```

## Testing

```typescript
// Test event emission locally
import { inngest } from "~/inngest/client"

await inngest.send({
  name: "generate-song-event",
  data: {
    songId: "test-song-id",
    userId: "test-user-id"
  }
})

// Check Inngest dashboard at http://localhost:8288
// Verify function execution and logs
```

## Best Practices

1. **Idempotent Steps**: Each step should be safe to retry
2. **Small Steps**: Break complex logic into multiple steps
3. **Logging**: Use `console.log()` in steps for debugging
4. **Error Handling**: Always implement `onFailure`
5. **Timeouts**: Set reasonable timeouts for external API calls

```typescript
// ✅ Good: Idempotent database update
await step.run("update-status", async () => {
  await db.song.update({
    where: { id: songId },
    data: { status: "processing" }
  })
})

// ❌ Bad: Not idempotent
await step.run("increment-count", async () => {
  count++ // This will increment multiple times on retry!
})
```
