"use client";

import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { Clock, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";

interface HistoryListProps {
  songs: any[];
}

export default function HistoryList({ songs }: HistoryListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "queued":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "no credits":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {songs.map((song) => (
        <Card key={song.id} className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                {getStatusIcon(song.status)}
                <h3 className="font-semibold">{song.title}</h3>
                {song.isRemix && (
                  <Badge variant="secondary" className="text-xs">
                    Remix
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(song.createdAt).toLocaleString()}
              </p>
              {song.prompt && (
                <p className="text-sm text-muted-foreground">Style: {song.prompt}</p>
              )}
              {song.categories.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {song.categories.map((cat: any) => (
                    <Badge key={cat.id} variant="outline" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right space-y-1">
              <Badge
                variant={
                  song.status === "processed"
                    ? "default"
                    : song.status === "failed"
                    ? "destructive"
                    : "secondary"
                }
              >
                {song.status}
              </Badge>
              {song.status === "processed" && (
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>{song.listenCount} plays</div>
                  <div>{song._count.likes} likes</div>
                  <div>{song._count.comments} comments</div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
