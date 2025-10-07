"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { inngest } from "~/inngest/client";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export interface RemixRequest {
  parentSongId: string;
  variations?: {
    changePrompt?: string; // New style elements to add
    changeLyrics?: boolean; // Regenerate lyrics
    guidanceScale?: number; // Different guidance
  };
}

export async function remixSong(remixRequest: RemixRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  // Get the parent song
  const parentSong = await db.song.findUnique({
    where: { id: remixRequest.parentSongId },
    select: {
      title: true,
      prompt: true,
      lyrics: true,
      fullDescribedSong: true,
      describedLyrics: true,
      instrumental: true,
      audioDuration: true,
      inferStep: true,
      seed: true,
    },
  });

  if (!parentSong) {
    throw new Error("Parent song not found");
  }

  // Create variations with different guidance scales
  const guidanceScales = remixRequest.variations?.guidanceScale
    ? [remixRequest.variations.guidanceScale]
    : [10, 20]; // Two variations

  for (const guidanceScale of guidanceScales) {
    let newPrompt = parentSong.prompt;
    let newDescribedSong = parentSong.fullDescribedSong;

    // Add variation to prompt
    if (remixRequest.variations?.changePrompt) {
      newPrompt = newPrompt
        ? `${newPrompt}, ${remixRequest.variations.changePrompt}`
        : remixRequest.variations.changePrompt;
      newDescribedSong = newDescribedSong
        ? `${newDescribedSong}, ${remixRequest.variations.changePrompt}`
        : remixRequest.variations.changePrompt;
    }

    const remixTitle = `${parentSong.title} (Remix)`;

    const remixSong = await db.song.create({
      data: {
        userId: session.user.id,
        title: remixTitle,
        prompt: newPrompt,
        lyrics: remixRequest.variations?.changeLyrics ? undefined : parentSong.lyrics,
        fullDescribedSong: newDescribedSong,
        describedLyrics: remixRequest.variations?.changeLyrics
          ? undefined
          : parentSong.describedLyrics,
        instrumental: parentSong.instrumental,
        guidanceScale,
        audioDuration: parentSong.audioDuration ?? 120,
        inferStep: parentSong.inferStep,
        seed: parentSong.seed,
        parentSongId: remixRequest.parentSongId,
        isRemix: true,
      },
    });

    await inngest.send({
      name: "generate-song-event",
      data: {
        songId: remixSong.id,
        userId: remixSong.userId,
      },
    });
  }

  revalidatePath("/create");
}
