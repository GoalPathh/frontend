"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  avatarUrl?: string | null;
  name?: string | null;
  className?: string;
  iconClassName?: string;
  imageSizes?: string;
};

export function UserAvatar({
  avatarUrl,
  name,
  className,
  iconClassName,
  imageSizes = "40px",
}: UserAvatarProps) {
  const [imageBroken, setImageBroken] = useState(false);
  const normalizedAvatarUrl = avatarUrl?.trim();

  useEffect(() => {
    setImageBroken(false);
  }, [normalizedAvatarUrl]);

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 text-primary shadow-sm",
        className,
      )}
    >
      {normalizedAvatarUrl && !imageBroken ? (
        <Image
          src={normalizedAvatarUrl}
          alt={name?.trim() || "User profile"}
          fill
          sizes={imageSizes}
          className="object-cover"
          onError={() => setImageBroken(true)}
        />
      ) : (
        <User className={cn("h-1/2 w-1/2", iconClassName)} aria-hidden="true" />
      )}
    </span>
  );
}
