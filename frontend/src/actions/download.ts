"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { getPresignedUrl } from "./generation";

export async function downloadSong(songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const song = await db.song.findFirstOrThrow({
    where: {
      id: songId,
      userId: session.user.id, // Only allow downloading own songs
      s3Key: { not: null },
      status: "processed",
    },
    select: { s3Key: true, title: true },
  });

  // Increment download count
  await db.song.update({
    where: { id: songId },
    data: { downloadCount: { increment: 1 } },
  });

  const url = await getPresignedUrl(song.s3Key!);

  return {
    url,
    filename: `${song.title}.wav`,
  };
}

export async function canDownloadSong(songId: string): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  const song = await db.song.findFirst({
    where: {
      id: songId,
      userId: session.user.id,
      s3Key: { not: null },
      status: "processed",
    },
  });

  return !!song;
}
