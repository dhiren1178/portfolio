import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";
import type { IconType } from "react-icons";
import { siteConfig } from "@/lib/config/site";
import { publicAsset } from "@/lib/publicAsset";

export interface ContactLink {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: IconType;
}

export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    value: "dhirensharma1178@gmail.com",
    href: "mailto:dhirensharma1178@gmail.com",
    icon: FiMail,
  },
  ...(process.env.NEXT_PUBLIC_GITHUB_URL ? [{
    id: "github",
    label: "GitHub",
    value: "GitHub profile",
    href: process.env.NEXT_PUBLIC_GITHUB_URL,
    icon: FiGithub,
  }] : []),
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/dhirensharma01",
    href: siteConfig.sameAs[0],
    icon: FiLinkedin,
  },
  {
    id: "resume",
    label: "Resume",
    value: "Download PDF",
    href: publicAsset("/resume.pdf"),
    icon: FiFileText,
  },
  {
    id: "project-brief",
    label: "Technical project brief",
    value: "Download PDF",
    href: publicAsset("/technical-project-brief.pdf"),
    icon: FiFileText,
  },
];

export const availability = {
  status: "active" as const,
  label: "Open to opportunities",
};
