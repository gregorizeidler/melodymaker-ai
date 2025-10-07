# Example 1: Simple Music Generation

This example shows how to create a simple music generation feature.

## Server Action (Backend)

```typescript
// app/actions/generation.ts
"use server"

import { inngest } from "~/inngest/client"
import { db } from "~/server/db"
import { auth } from "~/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export interface GenerateRequest {
  fullDescribedSong?: string
  instrumental?: boolean
}

export async function generateSong(request: GenerateRequest) {
  // 1. Authenticate user
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect("/auth/sign-in")

  // 2. Create database record
  const song = await db.song.create({
    data: {
      userId: session.user.id,
      title: request.fullDescribedSong || "Untitled",
      fullDescribedSong: request.fullDescribedSong,
      instrumental: request.instrumental ?? false,
      guidanceScale: 7.5,
      audioDuration: 120,
      status: "queued",
    },
  })

  // 3. Queue async processing
  await inngest.send({
    name: "generate-song-event",
    data: {
      songId: song.id,
      userId: session.user.id,
    },
  })

  return { success: true, songId: song.id }
}
```

## Client Component (Frontend)

```typescript
// components/generate-form.tsx
"use client"

import { useState } from "react"
import { generateSong } from "~/actions/generation"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"

export function GenerateForm() {
  const [description, setDescription] = useState("")
  const [instrumental, setInstrumental] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!description.trim()) {
      toast.error("Please enter a description")
      return
    }

    setLoading(true)

    try {
      const result = await generateSong({
        fullDescribedSong: description,
        instrumental,
      })

      toast.success("Music generation queued! Check your history.")
      setDescription("")
    } catch (error) {
      toast.error("Failed to generate music")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="description">Describe your song</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., upbeat electronic dance music with energetic vibes"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="instrumental"
          checked={instrumental}
          onCheckedChange={setInstrumental}
        />
        <Label htmlFor="instrumental">Instrumental only</Label>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Music"}
      </Button>
    </form>
  )
}
```

## Page Integration

```typescript
// app/(main)/create/page.tsx
import { GenerateForm } from "~/components/generate-form"

export default function CreatePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Music</h1>
      <GenerateForm />
    </div>
  )
}
```

## What Happens Behind the Scenes

1. User fills form and clicks "Generate Music"
2. `generateSong()` Server Action is called
3. Song record created with `status: "queued"`
4. Inngest event emitted
5. User sees success message immediately
6. **Background (30-60s later)**:
   - Inngest worker picks up event
   - Checks user credits
   - Calls Modal API
   - AI generates music + cover
   - Uploads to Backblaze B2
   - Updates song status to "processed"
   - Deducts 1 credit
7. User refreshes page → sees playable song

## Testing

```bash
# Run the app
cd frontend
pnpm dev

# Navigate to http://localhost:3000/create
# Fill form and submit
# Check /history to see processing status
```
