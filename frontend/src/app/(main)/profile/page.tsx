import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "~/lib/auth";

export default async function ProfileRedirectPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  // Redirect to user's own profile
  redirect(`/profile/${session.user.id}`);
}
