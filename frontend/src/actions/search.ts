"use server";

import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { getPresignedUrl } from "./generation";

export interface SearchFilters {
  query?: string;
  genre?: string;
  bpm?: { min?: number; max?: number };
  instrumental?: boolean;
  userId?: string;
  sortBy?: "recent" | "popular" | "trending";
}

export async function searchSongs(filters: SearchFilters) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const where: any = {
    published: true,
    status: "processed",
  };

  // Text search in title or prompt
  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { prompt: { contains: filters.query, mode: "insensitive" } },
      { fullDescribedSong: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  // Filter by genre/category
  if (filters.genre) {
    where.categories = {
      some: {
        name: { contains: filters.genre, mode: "insensitive" },
      },
    };
  }

  // Filter by BPM
  if (filters.bpm) {
    where.bpm = {};
    if (filters.bpm.min) where.bpm.gte = filters.bpm.min;
    if (filters.bpm.max) where.bpm.lte = filters.bpm.max;
  }

  // Filter by instrumental
  if (filters.instrumental !== undefined) {
    where.instrumental = filters.instrumental;
  }

  // Filter by user
  if (filters.userId) {
    where.userId = filters.userId;
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (filters.sortBy === "popular") {
    orderBy = { listenCount: "desc" };
  } else if (filters.sortBy === "trending") {
    // Recent songs with high engagement
    where.createdAt = {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
    };
    orderBy = [{ listenCount: "desc" }, { createdAt: "desc" }];
  }

  const songs = await db.song.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      categories: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: session?.user.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
      favorites: session?.user.id
        ? {
            where: {
              userId: session.user.id,
            },
          }
        : false,
    },
    orderBy,
    take: 50,
  });

  // Add thumbnail URLs
  const songsWithUrls = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailS3Key
        ? await getPresignedUrl(song.thumbnailS3Key)
        : null;
      return { ...song, thumbnailUrl };
    })
  );

  return songsWithUrls;
}

export async function getAvailableGenres() {
  const categories = await db.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => c.name);
}
