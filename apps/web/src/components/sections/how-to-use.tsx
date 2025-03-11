import { APP_NAME } from "@/app/consts";
import { StepsSelector } from "@/components/steps-selector";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";

type StepOption = {
  id: number;
  title: string;
  description: string;
};

const steps: StepOption[] = [
  {
    id: 1,
    title: "Create an account",
    description: "Sign up for a free account",
  },
  {
    id: 2,
    title: "Generate your API key",
    description: "Generate an API key for your account",
  },
  {
    id: 3,
    title: "Start using the API",
    description: "Start using the API to build your application",
  },
];

export async function HowToUse({ className }: { className?: string }) {
  return (
    <Section
      id="how-to-use"
      title={`How to use ${APP_NAME}`}
      className={cn(className)}
    >
      <div className="border-x border-t">
        <StepsSelector steps={steps} />
      </div>
    </Section>
  );
}
