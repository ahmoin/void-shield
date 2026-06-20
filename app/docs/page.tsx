import {
  ArrowRightIcon,
  BookOpenIcon,
  FileJsonIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

const sections = [
  {
    icon: BookOpenIcon,
    title: "Getting Started",
    description:
      "Install the GitHub App and get Void Shield scanning your repositories in minutes.",
    href: "/docs/getting-started",
  },
  {
    icon: FileJsonIcon,
    title: "Configuration",
    description:
      "Customise scanning behaviour per-repo with a .voidshield.json file.",
    href: "/docs/configuration/voidshield-json",
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-16">
      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <ShieldCheckIcon className="size-4" />
            <span>{siteConfig.name} Docs</span>
          </div>
          <h1 className="font-semibold text-4xl tracking-tight lg:text-5xl">
            {siteConfig.description}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {siteConfig.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/docs/getting-started">
                Get started guide <ArrowRightIcon className="size-3.5" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a
                href={siteConfig.links.githubApp}
                rel="noopener"
                target="_blank"
              >
                Install on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Section cards */}
      <div className="mt-16">
        <h2 className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-wider">
          Browse the docs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              className="group rounded-lg border bg-card p-5 transition-colors hover:bg-accent"
              href={section.href}
              key={section.title}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <section.icon className="size-4 text-muted-foreground" />
                <span className="font-medium">{section.title}</span>
                <ArrowRightIcon className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
