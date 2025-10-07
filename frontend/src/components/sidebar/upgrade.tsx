"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";

export default function Upgrade() {
  const upgrade = async () => {
    await authClient.checkout({
      products: [
        "adc1a0d5-3a97-4c21-acae-f35a897a51c2", // small
        "005c7c8f-49da-49b6-a1e5-82bb5dc3ac48", // medium
        "331b3426-d69c-4379-bec4-d8b7c60f1c58", // large
      ],
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      className="ml-2 cursor-pointer text-orange-400"
      onClick={upgrade}
    >
      Upgrade
    </Button>
  );
}
