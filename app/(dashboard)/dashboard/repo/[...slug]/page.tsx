import { notFound } from "next/navigation";

export default async function RepoPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  if (slug.length < 2) {
    notFound();
  }

  const owner = slug[0];
  const repo = slug[1];
  const fullName = `${owner}/${repo}`;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-2 font-semibold text-2xl">{fullName}</h1>
      <p className="text-muted-foreground">
        Security scan results for this repository will appear here.
      </p>
    </main>
  );
}
