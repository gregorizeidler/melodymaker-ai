import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Music, Calendar, Users, Heart, PlayCircle } from "lucide-react";
import { auth } from "~/lib/auth";
import { getUserProfile } from "~/actions/profile";
import { SongCard } from "~/components/home/song-card";
import { FollowButton } from "~/components/profile/follow-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { userId } = await params;
  const { user, songs, stats } = await getUserProfile(userId);

  const isOwnProfile = session.user.id === userId;

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {/* Avatar */}
            <Avatar className="h-32 w-32">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="text-4xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                  {user.name}
                </h1>
                {!isOwnProfile && (
                  <FollowButton
                    userId={userId}
                    initialFollowing={user.isFollowing}
                  />
                )}
              </div>

              {user.bio && (
                <p className="text-muted-foreground mt-2">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Music className="text-muted-foreground h-4 w-4" />
                  <span className="font-semibold">{stats.totalSongs}</span>
                  <span className="text-muted-foreground">Songs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="font-semibold">{stats.followers}</span>
                  <span className="text-muted-foreground">Followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="font-semibold">{stats.following}</span>
                  <span className="text-muted-foreground">Following</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="text-muted-foreground h-4 w-4" />
                  <span className="font-semibold">{stats.totalPlays}</span>
                  <span className="text-muted-foreground">Plays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="text-muted-foreground h-4 w-4" />
                  <span className="font-semibold">{stats.totalLikes}</span>
                  <span className="text-muted-foreground">Likes</span>
                </div>
              </div>

              {/* Member Since */}
              <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Songs Section */}
      <div>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          {isOwnProfile ? "Your Songs" : `Songs by ${user.name}`}
        </h2>

        {songs.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <Music className="text-muted-foreground h-20 w-20" />
            <h3 className="mt-4 text-xl font-semibold">No Songs Yet</h3>
            <p className="text-muted-foreground mt-2">
              {isOwnProfile
                ? "Start creating music to see it here!"
                : "This user hasn't published any songs yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {songs.map((song) => (
              <SongCard key={song.id} song={song as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
