"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { authClient } from "@/lib/auth-client";

export function AuthPage() {
  return (
    <div className="relative w-full md:h-screen md:overflow-hidden">
      <Particles
        className="absolute inset-0"
        color="#666666"
        ease={20}
        quantity={120}
      />
      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-8">
        <Button asChild className="absolute top-4 left-4" variant="ghost">
          <Link href="/">
            <ChevronLeftIcon data-icon="inline-start" />
            Home
          </Link>
        </Button>

        <div className="mx-auto space-y-4 sm:w-sm">
          <Icons.logoFull className="h-5" />
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-2xl tracking-wide">
              Welcome to Void Shield
            </h1>
            <p className="text-base text-muted-foreground">
              Sign in or create your Void Shield account.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/dashboard",
                })
              }
              type="button"
            >
              <Icons.gitHub data-icon="inline-start" />
              Continue with GitHub
            </Button>
          </div>
          <p className="mt-8 text-muted-foreground text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/terms-of-service"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              className="underline underline-offset-4 hover:text-primary"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
