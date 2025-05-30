"use client";

import { ButtonColorful } from "@/components/ui/button-colorful";
import { RetroGrid } from "@/components/ui/retro-grid";
import { APP_NAME } from "@/app/consts";
import { usePostHog } from "posthog-js/react";
import { useRouter } from "next/navigation";

export const CTA = () => {
  const posthog = usePostHog();
  const router = useRouter();

  return (
    <section className="text-center border-x border-b">
      <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background md:shadow-xl">
        <p className="text-sm z-10 font-semibold tracking-tight text-balance text-muted-foreground text-center">
          Ready to build youir own?
        </p>
        <h2 className="mt-2 text-4xl z-10 font-semibold tracking-tight text-foreground sm:text-5xl text-center">
          Build your AI app in minutes
        </h2>
        <div className="text-center text-muted-foreground mt-2 text-lg z-10">
          {APP_NAME} is an open-source platform to create apps with RAG.
          <br />
          You can connect your data to AI in minutes.
        </div>
        <ButtonColorful
          className="mt-6 z-10"
          label="Create your AI app"
          onClick={() => {
            posthog.capture(
              "Click CTA in AI app example",
              {},
              {
                send_instantly: true,
              }
            );

            router.push("https://www.supavec.com/login?src=examples-ai-app");
          }}
        />
        <RetroGrid />
      </div>
    </section>
  );
};
