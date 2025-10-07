"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { getPresignedUrl } from "./generation";

export async function getUserProfile(userId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          songs: true,
          followers: true,
          following: true,
        },
      },
      followers: {
        where: {
          followerId: session.user.id,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const songs = await db.song.findMany({
    where: {
      userId: userId,
      published: true,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      categories: true,
      likes: {
        where: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const songsWithUrls = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;
      return { ...song, thumbnailUrl };
    }),
  );

  // Calculate total stats
  const totalPlays = songs.reduce((sum, song) => sum + song.listenCount, 0);
  const totalLikes = songs.reduce(
    (sum, song) => sum + (song._count?.likes ?? 0),
    0,
  );

  return {
    user: {
      ...user,
      isFollowing: user.followers.length > 0,
    },
    songs: songsWithUrls,
    stats: {
      totalSongs: songs.length,
      totalPlays,
      totalLikes,
      followers: user._count.followers,
      following: user._count.following,
    },
  };
}

export async function getCurrentUserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  return getUserProfile(session.user.id);
}
