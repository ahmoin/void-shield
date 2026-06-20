import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { source } from "@/app/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout
        nav={{ enabled: false }}
        sidebar={{ collapsible: false }}
        tree={source.pageTree}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
