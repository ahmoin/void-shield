import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/app/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      nav={{ enabled: false }}
      sidebar={{ collapsible: false }}
      tree={source.pageTree}
    >
      {children}
    </DocsLayout>
  );
}
