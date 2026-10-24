import type { ReactNode } from "react";
import { safeHttpUrl } from "../utils/safeLinks";

interface ExternalLinkProps {
  href: string | null | undefined;
  children: ReactNode;
  className?: string;
}

const linkClasses =
  "break-all text-blue-600 underline underline-offset-2 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300";

/** Renders a link only for valid http(s) URLs; otherwise the plain text. */
const ExternalLink = ({ href, children, className }: ExternalLinkProps) => {
  const safe = safeHttpUrl(href);

  if (!safe) {
    return <span className="break-all">{children}</span>;
  }

  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" className={className ?? linkClasses}>
      {children}
    </a>
  );
};

export default ExternalLink;
