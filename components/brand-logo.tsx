import Image from "next/image";

export function BrandLogo({ size = 40, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src="/goalpath-logo.webp"
      alt=""
      width={size}
      height={size}
      unoptimized
      decoding="async"
      priority={priority}
      className="shrink-0 rounded-xl object-cover"
    />
  );
}
