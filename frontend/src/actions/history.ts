"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { getPresignedUrl } from "./generation";

export interface HistoryFilters {
  status?: "queued" | "processing" | "processed" | "failed" | "no credits";
  isRemix?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getGenerationHistory(filters?: HistoryFilters) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const where: any = {
    userId: session.user.id,
  };

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.isRemix !== undefined) {
    where.isRemix = filters.isRemix;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.createdAt = {};
    if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
    if (filters.dateTo) where.createdAt.lte = filters.dateTo;
  }

  const songs = await db.song.findMany({
    where,
    include: {
      categories: true,
      _count: {
        select: {
          likes: true,
          comments: true,
          remixes: true,
        },
      },
      parentSong: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Add thumbnail URLs for processed songs
  const songsWithUrls = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl =
        song.thumbnailS3Key && song.status === "processed"
          ? await getPresignedUrl(song.thumbnailS3Key)
          : null;
      return { ...song, thumbnailUrl };
    })
  );

  return songsWithUrls;
}

export async function getGenerationStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const stats = await db.song.groupBy({
    by: ["status"],
    where: { userId: session.user.id },
    _count: true,
  });

  const totalSongs = await db.song.count({
    where: { userId: session.user.id },
  });

  const successfulSongs = await db.song.count({
    where: { userId: session.user.id, status: "processed" },
  });

  const totalListens = await db.song.aggregate({
    where: { userId: session.user.id, status: "processed" },
    _sum: { listenCount: true },
  });

  const totalLikes = await db.like.count({
    where: { song: { userId: session.user.id } },
  });

  const totalComments = await db.comment.count({
    where: { song: { userId: session.user.id } },
  });

  return {
    totalSongs,
    successfulSongs,
    totalListens: totalListens._sum.listenCount || 0,
    totalLikes,
    totalComments,
    byStatus: stats.reduce((acc: any, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, {}),
  };
}
