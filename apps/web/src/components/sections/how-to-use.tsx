import { APP_NAME } from "@/app/consts";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import { CheckCircle, Zap, Rocket, Users } from "lucide-react";

type StepOption = {
  id: number;
  title: string;
  description: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: string;
};

const steps: StepOption[] = [
  {
    id: 1,
    title: "Create your workspace",
    description: "Get started in seconds with our intuitive setup",
    details:
      "Sign up for free and create your first workspace. No credit card required, no complex configuration needed.",
    icon: Users,
    highlight: "Free forever plan available",
  },
  {
    id: 2,
    title: "Generate your API key",
    description: "Secure access to enterprise-grade vector infrastructure",
    details:
      "Generate your unique API key with one click. Built with security-first architecture and automatic key rotation.",
    icon: Zap,
    highlight: "Enterprise-grade security",
  },
  {
    id: 3,
    title: "Start embedding",
    description: "From zero to semantic search in minutes",
    details:
      "Send your first documents via our REST API or SDKs. Watch as your data transforms into intelligent, searchable vectors.",
    icon: Rocket,
    highlight: "Sub-100ms response times",
  },
];

export async function HowToUse({ className }: { className?: string }) {
  return (
    <Section
      id="how-to-use"
      title={`How to use ${APP_NAME}`}
      className={cn(className)}
    >
      <div className="border border-border rounded-lg overflow-hidden bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              <div className="p-8 h-full flex flex-col">
                {/* Step number and icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {step.id}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {step.details}
                  </p>

                  {/* Highlight badge */}
                  {step.highlight && (
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-green-700 dark:text-green-400 font-medium">
                        {step.highlight}
                      </span>
                    </div>
                  )}
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-px w-px h-8 bg-gradient-to-b from-border to-transparent transform -translate-y-1/2 z-10" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="border-t border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Ready to transform your search experience?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Start for free
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-2 text-sm font-medium hover:bg-muted transition-colors">
              View documentation
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
