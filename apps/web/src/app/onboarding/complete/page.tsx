import { APP_NAME } from "@/app/consts";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function OnboardingCompletePage() {
  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>
            Your onboarding is complete. Welcome to {APP_NAME}!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Join our Discord community to connect with other Supavec users and
            get support.
          </p>
          <a
            target="_blank"
            href="https://discord.gg/MS9CjPeXF4"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            <Icons.discord className="mr-2 size-4" />
            Join {APP_NAME} Discord
          </a>
        </CardContent>
        <CardFooter>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Go to Dashboard
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
