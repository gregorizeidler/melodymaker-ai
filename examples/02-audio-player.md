# Example 2: Building an Audio Player

This example shows how to build a global audio player with Zustand.

## Zustand Store

```typescript
// stores/use-player-store.ts
import { create } from "zustand"

interface Track {
  id: string
  title: string
  url: string
  artwork: string | null
  prompt: string | null
  createdByUserName: string | null
}

interface PlayerState {
  track: Track | null
  isPlaying: boolean
  volume: number
  
  // Actions
  setTrack: (track: Track) => void
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (volume: number) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  track: null,
  isPlaying: false,
  volume: 1,
  
  setTrack: (track) => set({ track, isPlaying: true }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
  reset: () => set({ track: null, isPlaying: false }),
}))
```

## Audio Player Component

```typescript
// components/sound-bar.tsx
"use client"

import { useEffect, useRef } from "react"
import { usePlayerStore } from "~/stores/use-player-store"
import { Button } from "~/components/ui/button"
import { Slider } from "~/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"

export function SoundBar() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { track, isPlaying, volume, play, pause, setVolume } = usePlayerStore()

  // Sync audio element with state
  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current || !track) return
    audioRef.current.src = track.url
    audioRef.current.play()
  }, [track])

  // Update volume
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  if (!track) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <audio ref={audioRef} />
      
      <div className="container mx-auto flex items-center gap-4">
        {/* Album Art */}
        <div className="w-12 h-12 rounded overflow-hidden">
          {track.artwork ? (
            <Image src={track.artwork} alt={track.title} width={48} height={48} />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{track.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {track.createdByUserName}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => (isPlaying ? pause() : play())}
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 w-32">
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={([value]) => setVolume(value!)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Song Card with Play Button

```typescript
// components/song-card.tsx
"use client"

import { useState } from "react"
import { usePlayerStore } from "~/stores/use-player-store"
import { getPlayUrl } from "~/actions/generation"
import { Button } from "~/components/ui/button"
import { Play, Loader2 } from "lucide-react"

interface SongCardProps {
  song: {
    id: string
    title: string
    thumbnailUrl: string | null
    user: { name: string }
  }
}

export function SongCard({ song }: SongCardProps) {
  const [loading, setLoading] = useState(false)
  const setTrack = usePlayerStore((state) => state.setTrack)

  async function handlePlay() {
    setLoading(true)

    try {
      // Get pre-signed URL (increments listen count)
      const url = await getPlayUrl(song.id)

      // Update global player state
      setTrack({
        id: song.id,
        title: song.title,
        url,
        artwork: song.thumbnailUrl,
        prompt: null,
        createdByUserName: song.user.name,
      })
    } catch (error) {
      console.error("Failed to play song:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="group relative">
      <div className="aspect-square rounded-md overflow-hidden">
        <img src={song.thumbnailUrl || "/placeholder.png"} alt={song.title} />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePlay}
            disabled={loading}
            className="h-12 w-12 rounded-full bg-white/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Play className="fill-white" />
            )}
          </Button>
        </div>
      </div>

      <h3 className="mt-2 font-medium truncate">{song.title}</h3>
      <p className="text-sm text-muted-foreground">{song.user.name}</p>
    </div>
  )
}
```

## Add to Layout

```typescript
// app/(main)/layout.tsx
import { SoundBar } from "~/components/sound-bar"

export default function MainLayout({ children }: { children: React.Node }) {
  return (
    <div>
      {children}
      <SoundBar />
    </div>
  )
}
```

## Features

✅ **Global State**: One audio player across all pages  
✅ **Automatic Playback**: Starts playing when track changes  
✅ **Volume Control**: Slider with icon  
✅ **Listen Count**: Incremented via `getPlayUrl()`  
✅ **Smooth Transitions**: Fade in/out with CSS  

## Testing

```bash
# 1. Start app
pnpm dev

# 2. Navigate to home page
# 3. Click play on any song
# 4. Verify player appears at bottom
# 5. Navigate to another page → player persists
# 6. Click another song → player switches tracks
```
