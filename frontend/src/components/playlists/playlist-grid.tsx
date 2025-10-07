"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { ListMusic, Lock, Globe } from "lucide-react";
import { Badge } from "~/components/ui/badge";

interface PlaylistGridProps {
  playlists: any[];
}

export default function PlaylistGrid({ playlists }: PlaylistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((playlist) => (
        <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <ListMusic className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold line-clamp-1">{playlist.name}</h3>
                  </div>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
                {playlist.isPublic ? (
                  <Globe className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Badge variant="secondary">
                {playlist.playlistSongs.length}{" "}
                {playlist.playlistSongs.length === 1 ? "song" : "songs"}
              </Badge>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
