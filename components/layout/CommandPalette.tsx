"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiSearch, FiX } from "react-icons/fi";
import { portfolioProjects } from "@/lib/portfolioData";

const destinations = [
  { title: "Home", href: "/" },
  { title: "Work", href: "/projects" },
  { title: "Research", href: "/research" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
  { title: "Experience", href: "/experience" },
  { title: "Mission Lab", href: "/mission" },
  { title: "Skills", href: "/skills" },
  ...portfolioProjects.map(({ title, href }) => ({ title, href })),
];

export default function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const results = destinations.filter(({ title }) => title.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k" || event.repeat) return;
      event.preventDefault();
      if (dialog.current?.open) dialog.current.close();
      else {
        dialog.current?.showModal();
        search.current?.focus();
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  return <>
    <button type="button" className="ed-link" onClick={() => {
      dialog.current?.showModal();
      search.current?.focus();
    }}>Quick navigation <FiSearch aria-hidden="true" /></button>
    <dialog className="ed-search" ref={dialog} aria-labelledby="search-title" onClose={() => setQuery("")}>
      <div className="ed-search-header">
        <label id="search-title" htmlFor="destination-search">Quick navigation</label>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close quick navigation"><FiX /></button>
      </div>
      <input id="destination-search" ref={search} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects and pages" />
      {results.length ? <ul>{results.map(({ href, title }) => <li key={href}>
        <Link href={href} onClick={() => dialog.current?.close()}>{title}</Link>
      </li>)}</ul> : <p role="status" className="py-3">No matching pages</p>}
    </dialog>
  </>;
}
