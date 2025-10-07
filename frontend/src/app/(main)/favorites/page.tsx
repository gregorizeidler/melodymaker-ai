import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { auth } from "~/lib/auth";
import { getFavorites } from "~/actions/favorite";
import { SongCard } from "~/components/home/song-card";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const favorites = await getFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <Heart className="text-muted-foreground h-20 w-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">No Favorites Yet</h1>
        <p className="text-muted-foreground mt-2">
          Start favoriting songs to build your collection!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Favorites</h1>
        <p className="text-muted-foreground mt-2">
          {favorites.length} {favorites.length === 1 ? "song" : "songs"} in your favorites
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {favorites.map((song) => (
          <SongCard key={song.id} song={song as any} />
        ))}
      </div>
    </div>
  );
}
