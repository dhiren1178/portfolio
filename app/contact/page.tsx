import type { Metadata } from "next";
import { FiArrowUpRight } from "react-icons/fi";
import { PageHeader } from "@/components/portfolio/Editorial";
import { contactLinks } from "@/lib/contactData";

export const metadata: Metadata = { title: "Contact — Dhiren Sharma" };

export default function ContactPage() {
  return <div className="ed"><div className="ed-wrap">
    <PageHeader label="Contact" title="Get in touch">I’m based in Erlangen and open to AI engineering roles and research collaborations.</PageHeader>
    <ul className="ed-contact-list">{contactLinks.map((link) => <li key={link.id}>
      <a href={link.href} download={link.href.endsWith(".pdf") || undefined}>
        <span><strong>{link.label}</strong><span>{link.value}</span></span><FiArrowUpRight aria-hidden="true" />
      </a>
    </li>)}</ul>
  </div></div>;
}
