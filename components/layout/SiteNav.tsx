"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { publicAsset } from "@/lib/publicAsset";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const currentPath = pathname.replace(/\/$/, "") || "/";
  const isCurrent = (href: string) => currentPath === href;
  const isActive = (href: string) => isCurrent(href) || (href !== "/" && currentPath.startsWith(`${href}/`));

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape, for keyboard users.
  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = Array.from(document.querySelectorAll<HTMLElement>("main, body > footer"));
    const wasInert = background.map(element => element.inert);
    background.forEach(element => { element.inert = true; });
    const items = () => Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    items()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = [toggle.current, ...items()].filter(Boolean);
      const index = controls.indexOf(document.activeElement as HTMLAnchorElement);
      if (index !== -1 && index + (event.shiftKey ? -1 : 1) >= 0 && index + (event.shiftKey ? -1 : 1) < controls.length) return;
      event.preventDefault();
      controls[event.shiftKey ? controls.length - 1 : 0]?.focus();
    };
    const resize = window.matchMedia("(min-width: 1024px)");
    const closeDesktop = () => { if (resize.matches) setMenuOpen(false); };
    resize.addEventListener("change", closeDesktop);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      background.forEach((element, index) => { element.inert = wasInert[index]; });
      resize.removeEventListener("change", closeDesktop);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <nav className="ed-nav" aria-label="Primary">
      <div className="ed-wrap ed-nav-inner">
      <Link
        href="/"
        className="ed-brand"
      >
        Dhiren Sharma
      </Link>

      {/* Desktop nav */}
      <ul className="ed-nav-links hidden lg:flex">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(link.href) ? "page" : undefined}
                className={cn(
                  "ed-nav-link",
                  active && "ed-nav-active"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <a href={publicAsset("/resume.pdf")} download className="ed-resume hidden lg:inline-flex">Résumé <FiArrowUpRight aria-hidden="true" /></a>

      {/* Mobile menu trigger */}
      <button
        ref={toggle}
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? "mobile-nav-menu" : undefined}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        className="ed-menu-toggle lg:hidden"
      >
        {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menu}
            id="mobile-nav-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            className="ed-mobile-menu lg:hidden"
          >
            <ul className="mx-auto flex min-h-full max-w-sm flex-col justify-center gap-1 px-6 pb-8 pt-20">
              {links.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.25, delay: reducedMotion ? 0 : 0.025 * i }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => {
                        setMenuOpen(false);
                        if (isCurrent(link.href)) toggle.current?.focus();
                      }}
                      aria-current={isCurrent(link.href) ? "page" : undefined}
                      className={cn(
                        "ed-mobile-link",
                        active && "ed-nav-active"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
              <li><a href={publicAsset("/resume.pdf")} download className="ed-mobile-link">Download résumé ↗</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </nav>
  );
}
