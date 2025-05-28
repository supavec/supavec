import { BorderText } from "@/components/ui/border-number";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Link from "next/link";

const examples = [
  {
    title: "Chat with PDF",
    href: "/examples/chat-with-pdf",
  },
  {
    title: "Sales Coaching AI",
    href: "/examples/sales-coaching",
  },
];

const tools = [
  {
    title: "CiteAnalytics",
    href: "https://www.citeanalytics.com",
  },
  {
    title: "Supa Deep Reasearch",
    href: "https://www.supa-deep-research.com",
  },
];

const links = [
  {
    title: "Pricing",
    href: "/pricing",
    external: false,
  },
  {
    title: "Blog",
    href: `${process.env.NEXT_PUBLIC_APP_URL}/blog`,
    external: false,
  },
  {
    title: "API Docs",
    href: "https://go.supavec.com/docs",
    external: true,
  },
];

const legal = [
  {
    title: "Privacy Policy",
    href: "/legal/privacy-policy",
  },
  {
    title: "Terms of Service",
    href: "/legal/tos",
  },
];

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex flex-col gap-y-5 rounded-lg px-7 py-5 container",
        className
      )}
    >
      {/* SEO text block */}
      <div className="border-t pt-8 pb-4">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Supavec</strong> is an
            open-source Retrieval-Augmented Generation (RAG) platform built on
            Supabase row-level security. Our RAG-as-a-Service API enables
            developers to integrate their own data with any LLM, providing
            secure, scalable document embedding and retrieval capabilities for
            AI applications. Unlike proprietary solutions, Supavec offers full
            transparency and control over your RAG infrastructure.
          </p>
        </div>
      </div>

      <div className="flex gap-y-5 flex-col-reverse md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:items-start">
          <div className="flex items-center gap-x-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="logo" className="size-8" />
            <h2 className="text-lg font-bold text-foreground">
              {siteConfig.name}
            </h2>
          </div>

          <ul className="flex gap-x-5 gap-y-2 text-muted-foreground md:items-center">
            {siteConfig.footer.socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  target="_blank"
                  href={link.url}
                  className="flex h-5 w-5 items-center justify-center text-muted-foreground transition-all duration-100 ease-linear hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>

          <p className="text-sm font-medium tracking-tight text-muted-foreground">
            {siteConfig.footer.bottomText}
          </p>
        </div>

        <div className="flex flex-1 justify-between md:justify-around">
          <div>
            <h6 className="text-sm text-secondary-foreground/80 font-semibold mb-2">
              Links
            </h6>
            <ul className="flex flex-col gap-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    className="text-sm text-muted-foreground hover:text-foreground transition-color ease-linear"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-sm text-secondary-foreground/80 font-semibold mb-2">
              Legal
            </h6>
            <ul className="flex flex-col gap-y-2">
              {legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-color ease-linear"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-sm text-secondary-foreground/80 font-semibold mb-2">
              Examples
            </h6>
            <ul className="flex flex-col gap-y-2">
              {examples.map((example) => (
                <li key={example.href}>
                  <Link
                    href={example.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-color ease-linear"
                  >
                    {example.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-sm text-secondary-foreground/80 font-semibold mb-2">
              Tools
            </h6>
            <ul className="flex flex-col gap-y-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-color ease-linear"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <BorderText
        text={siteConfig.footer.brandText}
        className="text-[clamp(3rem,15vw,10rem)] overflow-hidden font-mono tracking-tighter font-medium"
      />
    </footer>
  );
}
