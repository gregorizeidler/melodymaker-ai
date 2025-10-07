"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function toggleFavorite(songId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const existingFavorite = await db.favorite.findUnique({
    where: {
      userId_songId: {
        userId: session.user.id,
        songId: songId,
      },
    },
  });

  if (existingFavorite) {
    await db.favorite.delete({
      where: {
        userId_songId: {
          userId: session.user.id,
          songId: songId,
        },
      },
    });
  } else {
    await db.favorite.create({
      data: {
        userId: session.user.id,
        songId: songId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/favorites");
}

export async function getFavorites() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      song: {
        include: {
          user: { select: { name: true, image: true } },
          categories: true,
          _count: { select: { likes: true, comments: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((fav) => fav.song);
}
