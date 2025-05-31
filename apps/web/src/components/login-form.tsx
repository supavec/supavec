"use client";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/app/consts";
import Link from "next/link";
import { googleLogin } from "@/app/login/actions";
import { GoogleButton } from "@/components/google-button";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex size-12 items-center justify-center rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="./logo.png"
                className="size-12"
                alt={`${APP_NAME} logo`}
              />
            </div>
            <span className="sr-only">{APP_NAME}</span>
          </Link>
          <h1 className="text-xl font-bold">Welcome to {APP_NAME}</h1>
          <p className="text-center text-sm text-muted-foreground">
            Sign in to your account. If you don&apos;t yet have an account, it
            will be created automatically.
          </p>
        </div>
        <form action={googleLogin}>
          <GoogleButton />
        </form>
      </div>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
