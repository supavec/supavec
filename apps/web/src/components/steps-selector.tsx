"use client";

import { HeroVideoDialog } from "./ui/hero-video-dialog";

type StepOption = {
  id: number;
  title: string;
  description: string;
};

type StepsSelectorProps = {
  steps: StepOption[];
};

export const StepsSelector: React.FC<StepsSelectorProps> = ({ steps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 relative">
      <div className="md:col-span-2 border-b md:border-b-0 bg-background md:border-r border-border sticky top-(--header-height)">
        <div className="flex md:flex-col md:h-full feature-btn-container overflow-x-auto p-4 pb-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="shrink-0 md:flex-1 flex flex-col justify-center w-64 md:w-full text-left p-4 mb-2 mr-2 last:mr-0 md:mr-0 rounded border border-border"
            >
              <h3 className="font-medium tracking-tight">
                {index + 1}. {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-1 md:col-span-3">
        <HeroVideoDialog
          className="block"
          previewClassName="rounded-none"
          animationStyle="from-center"
          videoSrc="https://qxxlcbvvszqlusrmczke.supabase.co/storage/v1/object/public/public-files/supavec-demo.mp4"
          thumbnailSrc="/supavec-demo-cover.jpg"
          thumbnailAlt="Supavec Demo"
        />
      </div>
    </div>
  );
};
