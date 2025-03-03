"use client";

import { Icons } from "@/components/icons";
import { Section } from "@/components/section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Ripple } from "@/components/ui/ripple";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const contributors = [
  {
    name: "Neco",
    avatar: "https://avatars.githubusercontent.com/u/5212808?v=4",
  },
  {
    name: "Marie Otaki",
    avatar: "https://avatars.githubusercontent.com/u/33252783?v=4",
  },
  {
    name: "Blair Bodnar",
    avatar: "https://avatars.githubusercontent.com/u/991976?v=4",
  },
  {
    name: "Magio",
    avatar: "https://avatars.githubusercontent.com/u/981372?v=4",
  },
  {
    name: "Taishi kato",
    avatar: "https://avatars.githubusercontent.com/u/980588?v=4",
  },
];

export function Community({ className }: { className?: string }) {
  return (
    <Section id="community" title="Community" className={cn(className)}>
      <div className="border-x border-t overflow-hidden relative">
        <Ripple />
        <div className="p-6 text-center py-12">
          <p className="text-muted-foreground mb-6 text-balance max-w-prose mx-auto font-medium">
            We&apos;re grateful for the amazing open-source community that helps
            make our project better every day.
          </p>
          <div className="flex justify-center -space-x-6 mb-8">
            {contributors.map((contributor, index) => (
              <div key={index}>
                <Avatar className="size-12 relative border-2 border-background bg-muted">
                  <AvatarImage
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    {contributor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              asChild
              variant="secondary"
              className="flex items-center gap-2"
            >
              <a target="_blank" href={siteConfig.links.github}>
                <Icons.github className="h-5 w-5" />
                Become a contributor
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
