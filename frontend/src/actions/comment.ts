"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function addComment(songId: string, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  if (!content.trim()) {
    throw new Error("Comment cannot be empty");
  }

  const comment = await db.comment.create({
    data: {
      content: content.trim(),
      userId: session.user.id,
      songId,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath(`/song/${songId}`);
  return comment;
}

export async function deleteComment(commentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  await db.comment.delete({
    where: {
      id: commentId,
      userId: session.user.id, // Only allow deleting own comments
    },
  });

  revalidatePath("/");
}

export async function getComments(songId: string) {
  const comments = await db.comment.findMany({
    where: { songId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return comments;
}
