import Image from "next/image";
import { InfiniteSlider } from "@/components/infinite-slider";

export function LogoCloud() {
  return (
    <div className="mask-[linear-gradient(to_right,transparent,black,transparent)] overflow-hidden py-4">
      <InfiniteSlider gap={42} reverse speed={80} speedOnHover={25}>
        {logos.map((logo) => (
          <Image
            alt={logo.alt}
            className="pointer-events-none h-4 w-auto select-none md:h-5 dark:brightness-0 dark:invert"
            height={20}
            key={`logo-${logo.alt}`}
            src={logo.src}
            width={120}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}

const logos = [
  { src: "/logos/nvidia-wordmark.svg", alt: "Nvidia Logo" },
  { src: "/logos/supabase-wordmark.svg", alt: "Supabase Logo" },
  { src: "/logos/openai-wordmark.svg", alt: "OpenAI Logo" },
  { src: "/logos/turso-wordmark.svg", alt: "Turso Logo" },
  { src: "/logos/vercel-wordmark.svg", alt: "Vercel Logo" },
  { src: "/logos/github-wordmark.svg", alt: "GitHub Logo" },
  { src: "/logos/claude-wordmark.svg", alt: "Claude AI Logo" },
  { src: "/logos/clerk-wordmark.svg", alt: "Clerk Logo" },
];
