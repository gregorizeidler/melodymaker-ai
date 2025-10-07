"use client";

import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      className="mb-2 self-start"
      variant="outline"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon /> Back
    </Button>
  );
}
