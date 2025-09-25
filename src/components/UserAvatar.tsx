"use client";
import Image from "next/image";
import { useState } from "react";

const DEFAULT_AVATAR = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png";

export function UserAvatar({ src, alt, size = 56 }: { src?: string; alt: string; size?: number }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const finalSrc = !failed && src ? src : DEFAULT_AVATAR;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {!loaded && (
        <div className="absolute inset-0 rounded-xl bg-white/10 animate-pulse" />
      )}
      <Image
        src={finalSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        className={`rounded-xl object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setFailed(true)}
        priority={false}
      />
    </div>
  );
}
