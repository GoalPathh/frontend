"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, FocusEvent, MouseEvent, TouchEvent } from "react";

type IntentLinkProps = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & {
  href: string;
  prefetch?: boolean;
};

export function IntentLink({ href, prefetch: prefetchOnViewport = false, onMouseEnter, onFocus, onTouchStart, ...props }: IntentLinkProps) {
  const router = useRouter();
  const prefetchOnIntent = () => { void router.prefetch(href); };

  return (
    <Link
      {...props}
      href={href}
      prefetch={prefetchOnViewport}
      onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => {
        onMouseEnter?.(event);
        prefetchOnIntent();
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(event);
        prefetchOnIntent();
      }}
      onTouchStart={(event: TouchEvent<HTMLAnchorElement>) => {
        onTouchStart?.(event);
        prefetchOnIntent();
      }}
    />
  );
}
