import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { History } from "lucide-react";
import { auth } from "~/lib/auth";
import { getGenerationHistory } from "~/actions/history";
import HistoryList from "~/components/history/history-list";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const history = await getGenerationHistory();

  if (history.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <History className="text-muted-foreground h-20 w-20" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight">No Generation History</h1>
        <p className="text-muted-foreground mt-2">
          Start creating music to see your history here!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generation History</h1>
        <p className="text-muted-foreground mt-2">
          {history.length} {history.length === 1 ? "generation" : "generations"} in total
        </p>
      </div>

      <HistoryList songs={history} />
    </div>
  );
}
