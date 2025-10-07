import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Music, Play, Heart, MessageCircle, TrendingUp, Download } from "lucide-react";
import { auth } from "~/lib/auth";
import { getGenerationStats } from "~/actions/history";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const stats = await getGenerationStats();

  const statCards = [
    {
      title: "Total Songs",
      value: stats.totalSongs,
      icon: Music,
      description: "Songs generated",
      color: "text-blue-500",
    },
    {
      title: "Successful",
      value: stats.successfulSongs,
      icon: TrendingUp,
      description: "Successfully processed",
      color: "text-green-500",
    },
    {
      title: "Total Plays",
      value: stats.totalListens,
      icon: Play,
      description: "Times your music was played",
      color: "text-purple-500",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      description: "Likes on your songs",
      color: "text-pink-500",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: MessageCircle,
      description: "Comments received",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your music generation performance and engagement
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generation Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Status</CardTitle>
          <CardDescription>Breakdown of your song generations by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      status === "processed"
                        ? "bg-green-500"
                        : status === "processing"
                        ? "bg-blue-500"
                        : status === "queued"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-medium capitalize">{status}</span>
                </div>
                <span className="text-muted-foreground">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
          <CardDescription>Your music generation success rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Success Rate</span>
              <span className="font-bold">
                {stats.totalSongs > 0
                  ? Math.round((stats.successfulSongs / stats.totalSongs) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="h-2 rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-green-500"
                style={{
                  width: `${
                    stats.totalSongs > 0
                      ? (stats.successfulSongs / stats.totalSongs) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
