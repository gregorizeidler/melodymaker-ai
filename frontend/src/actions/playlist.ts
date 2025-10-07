"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function createPlaylist(name: string, description?: string, isPublic = true) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      isPublic,
      userId: session.user.id,
    },
  });

  revalidatePath("/playlists");
  return playlist;
}

export async function updatePlaylist(
  playlistId: string,
  data: { name?: string; description?: string; isPublic?: boolean }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const playlist = await db.playlist.update({
    where: {
      id: playlistId,
      userId: session.user.id,
    },
    data,
  });

  revalidatePath("/playlists");
  return playlist;
}

export async function deletePlaylist(playlistId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  await db.playlist.delete({
    where: {
      id: playlistId,
      userId: session.user.id,
    },
  });

  revalidatePath("/playlists");
}

export async function addSongToPlaylist(playlistId: string, songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  // Check if user owns the playlist
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId, userId: session.user.id },
    include: { playlistSongs: true },
  });

  if (!playlist) {
    throw new Error("Playlist not found or you don't have permission");
  }

  // Get next position
  const maxPosition = playlist.playlistSongs.length;

  await db.playlistSong.create({
    data: {
      playlistId,
      songId,
      position: maxPosition,
    },
  });

  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
}

export async function removeSongFromPlaylist(playlistId: string, songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  // Verify ownership
  const playlist = await db.playlist.findUnique({
    where: { id: playlistId, userId: session.user.id },
  });

  if (!playlist) {
    throw new Error("Playlist not found or you don't have permission");
  }

  await db.playlistSong.delete({
    where: {
      playlistId_songId: {
        playlistId,
        songId,
      },
    },
  });

  revalidatePath("/playlists");
  revalidatePath(`/playlists/${playlistId}`);
}

export async function getUserPlaylists(userId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const targetUserId = userId || session?.user.id;

  if (!targetUserId) redirect("/auth/sign-in");

  const playlists = await db.playlist.findMany({
    where: {
      userId: targetUserId,
      ...(userId && userId !== session?.user.id ? { isPublic: true } : {}),
    },
    include: {
      playlistSongs: {
        include: {
          song: {
            include: {
              user: { select: { name: true } },
              categories: true,
            },
          },
        },
        orderBy: { position: "asc" },
      },
      user: { select: { name: true, image: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return playlists;
}

export async function getPlaylistById(playlistId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const playlist = await db.playlist.findUnique({
    where: { id: playlistId },
    include: {
      playlistSongs: {
        include: {
          song: {
            include: {
              user: { select: { name: true, image: true } },
              categories: true,
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { position: "asc" },
      },
      user: { select: { name: true, image: true } },
    },
  });

  if (!playlist) {
    throw new Error("Playlist not found");
  }

  // Check if user has access
  if (!playlist.isPublic && playlist.userId !== session?.user.id) {
    throw new Error("You don't have permission to view this playlist");
  }

  return playlist;
}
