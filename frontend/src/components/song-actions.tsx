"use client";

import { useState } from "react";
import { Heart, MessageCircle, Star, Download, Share2, MoreVertical, Repeat } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ToggleLikeSong } from "~/actions/song";
import { toggleFavorite } from "~/actions/favorite";
import { remixSong } from "~/actions/remix";
import { downloadSong } from "~/actions/download";
import { toast } from "sonner";

interface SongActionsProps {
  songId: string;
  isLiked?: boolean;
  isFavorited?: boolean;
  likesCount: number;
  commentsCount: number;
  canDownload?: boolean;
  onCommentClick?: () => void;
}

export function SongActions({
  songId,
  isLiked = false,
  isFavorited = false,
  likesCount,
  commentsCount,
  canDownload = false,
  onCommentClick,
}: SongActionsProps) {
  const [liked, setLiked] = useState(isLiked);
  const [favorited, setFavorited] = useState(isFavorited);
  const [likes, setLikes] = useState(likesCount);

  const handleLike = async () => {
    try {
      await ToggleLikeSong(songId);
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    } catch (error) {
      toast.error("Failed to like song");
    }
  };

  const handleFavorite = async () => {
    try {
      await toggleFavorite(songId);
      setFavorited(!favorited);
      toast.success(favorited ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error("Failed to favorite song");
    }
  };

  const handleRemix = async () => {
    try {
      await remixSong({ parentSongId: songId });
      toast.success("Remix queued! Check your history.");
    } catch (error) {
      toast.error("Failed to create remix");
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadSong(songId);
      const link = document.createElement("a");
      link.href = result.url;
      link.download = result.filename;
      link.click();
      toast.success("Download started");
    } catch (error) {
      toast.error("Failed to download song");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/song/${songId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={liked ? "text-pink-500" : ""}
      >
        <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        <span>{likes}</span>
      </Button>

      {onCommentClick && (
        <Button variant="ghost" size="sm" onClick={onCommentClick}>
          <MessageCircle className="h-4 w-4" />
          <span>{commentsCount}</span>
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleFavorite}
        className={favorited ? "text-yellow-500" : ""}
      >
        <Star className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRemix}>
            <Repeat className="h-4 w-4 mr-2" />
            Create Remix
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
          {canDownload && (
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
