import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ListMusic, Plus } from "lucide-react";
import { auth } from "~/lib/auth";
import { getUserPlaylists } from "~/actions/playlist";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import PlaylistGrid from "~/components/playlists/playlist-grid";

export default async function PlaylistsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const playlists = await getUserPlaylists();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Playlists</h1>
          <p className="text-muted-foreground mt-2">
            {playlists.length} {playlists.length === 1 ? "playlist" : "playlists"}
          </p>
        </div>
        <Link href="/playlists/create">
          <Button>
            <Plus className="h-4 w-4" />
            Create Playlist
          </Button>
        </Link>
      </div>

      {playlists.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center text-center">
          <ListMusic className="text-muted-foreground h-20 w-20" />
          <h2 className="mt-4 text-2xl font-bold tracking-tight">No Playlists Yet</h2>
          <p className="text-muted-foreground mt-2">
            Create your first playlist to organize your favorite songs
          </p>
          <Link href="/playlists/create" className="mt-4">
            <Button>
              <Plus className="h-4 w-4" />
              Create Playlist
            </Button>
          </Link>
        </div>
      ) : (
        <PlaylistGrid playlists={playlists} />
      )}
    </div>
  );
}
