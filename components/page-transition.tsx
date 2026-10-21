"use client";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
/** Keyed by route so each navigation reveals the new screen without resetting the app shell. */
export function PageTransition({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  return <div key={pathname} className={`page-enter ${className}`}>{children}</div>;
}
