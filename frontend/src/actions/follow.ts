"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

export async function toggleFollow(targetUserId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth/sign-in");

  if (session.user.id === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  const existingFollow = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    await db.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUserId,
        },
      },
    });
  } else {
    await db.follow.create({
      data: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath(`/profile/${targetUserId}`);
}

export async function getFollowers(userId: string) {
  const followers = await db.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          _count: {
            select: {
              followers: true,
              following: true,
              songs: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return followers.map((f) => f.follower);
}

export async function getFollowing(userId: string) {
  const following = await db.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          _count: {
            select: {
              followers: true,
              following: true,
              songs: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return following.map((f) => f.following);
}

export async function isFollowing(targetUserId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return false;

  const follow = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: targetUserId,
      },
    },
  });

  return !!follow;
}
