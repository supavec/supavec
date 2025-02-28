"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";

export const GenerateButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} variant="secondary">
      {pending && <Loader className="size-4 mr-2 animate-spin" />}
      Generate API Key
    </Button>
  );
};
