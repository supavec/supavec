import { Section } from "@/components/section";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function WhySupavec({ className }: { className?: string }) {
  return (
    <Section id="why-supavec" title="Why Supavec?" className={cn(className)}>
      <div className="border-x border-t">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {siteConfig.whySupavec.map(
            ({ name, description, icon: Icon }, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col gap-y-2 items-center justify-center py-8 px-4 border-b transition-colors hover:bg-secondary/20",
                  "last:border-b-0",
                  "md:[&:nth-child(2n+1)]:border-r md:[&:nth-child(n+5)]:border-b-0"
                )}
              >
                <div className="flex flex-col gap-y-2 items-center">
                  <div className="p-2 rounded-lg text-foreground transition-colors group-hover:from-secondary group-hover:to-secondary/80">
                    {Icon}
                  </div>
                  <h2 className="text-xl font-medium text-card-foreground text-center text-balance">
                    {name}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground text-balance text-center max-w-md mx-auto">
                  {description}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </Section>
  );
}
