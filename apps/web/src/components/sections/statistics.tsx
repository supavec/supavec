import { Icons } from "@/components/icons";
import { Section } from "@/components/section";
import { BorderText } from "@/components/ui/border-number";
import { BrainCircuit } from "lucide-react";

const stats = [
  {
    title: "600+",
    subtitle: "Stars on GitHub",
    icon: <Icons.github className="size-5" />,
    link: "https://github.com/taishikato/supavec",
  },
  {
    title: "200k+",
    subtitle: "Embeddings generated",
    icon: <BrainCircuit className="size-5" />,
    link: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  },
  {
    title: "100+",
    subtitle: "Discord Members",
    icon: <Icons.discord className="size-5" />,
    link: "https://go.supavec.com/discord",
  },
];

export function Statistics() {
  return (
    <Section id="statistics" title="Statistics">
      <div
        className="border-x border-t bg-gradient-to-br from-background via-secondary/10 to-background"
        style={{
          backgroundImage:
            "radial-gradient(circle at bottom center, hsl(var(--secondary) / 0.6), hsl(var(--background)))",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {stats.map((stat) => (
            <a
              href={stat.link}
              key={stat.link}
              target="_blank"
              className="flex flex-col items-center justify-center py-8 px-4 border-b sm:border-b-0 last:border-b-0 sm:border-r sm:last:border-r-0 [&:nth-child(-n+2)]:border-t-0 sm:[&:nth-child(-n+3)]:border-t-0 relative group overflow-hidden"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 duration-300 ease-in-out">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
              <div className="text-center relative">
                <BorderText
                  text={stat.title}
                  className="text-4xl font-bold text-foreground"
                />
                <div className="flex items-center justify-center gap-2 mt-2">
                  {stat.icon}
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
