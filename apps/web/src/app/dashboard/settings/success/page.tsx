import { APP_NAME } from "@/app/consts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Subscription Successful",
  description: "Your subscription has been successfully activated",
};

export default function SubscriptionSuccessPage() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>

        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Subscription Successful!
            </CardTitle>
            <CardDescription>
              Thank you for subscribing to {APP_NAME}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your subscription has been successfully activated. You now have
              access to our premium features. We&apos;ve sent a confirmation
              email with your subscription details.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
