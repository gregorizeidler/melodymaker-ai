"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { toggleFollow } from "~/actions/follow";
import { UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggleFollow() {
    setIsLoading(true);
    setIsFollowing(!isFollowing);

    try {
      await toggleFollow(userId);
    } catch (error) {
      // Revert on error
      setIsFollowing(!isFollowing);
      console.error("Failed to toggle follow:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isLoading}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
    >
      {isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
