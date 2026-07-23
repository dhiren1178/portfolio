"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Only routes that exist get linked. Extend this array as later phases
// add /projects, /research, /experience, /skills, /contact.
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[70] flex items-center justify-between px-6 md:px-10 py-5"
      aria-label="Primary"
    >
      <Link
        href="/"
        className="focus-ring rounded font-display font-bold text-sm tracking-wide text-phosphor"
      >
        D.SHARMA
      </Link>
      <ul className="flex items-center gap-1 rounded-full glass-panel px-2 py-1.5">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-ring relative block rounded-full px-4 py-1.5 text-xs font-mono tracking-wide transition-colors duration-300",
                  active
                    ? "text-void bg-signal"
                    : "text-phosphor-dim hover:text-phosphor"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
