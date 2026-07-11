import { useState } from "react";

interface CompanyLogoProps {
  company: string;
  domain: string;
  logoUrl?: string | null;
  className?: string;
}

const CompanyLogo = ({
  company,
  domain,
  logoUrl,
  className,
}: CompanyLogoProps) => {
  const fallbackLogo = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const [src, setSrc] = useState(logoUrl || fallbackLogo);
  const [showLetterAvatar, setShowLetterAvatar] = useState(false);

  const handleError = () => {
    if (src !== fallbackLogo) {
      setSrc(fallbackLogo);
    } else {
      setShowLetterAvatar(true);
    }
  };

  if (showLetterAvatar) {
    return (
      <div
        className={`h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xl ${className ?? ""}`}
      >
        {company.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={company}
      className={`h-14 w-14 rounded-xl- object-contain border- border-slate-100 dark:border-slate-700 ${className ?? ""}`}
      onError={handleError}
    />
  );
};

export default CompanyLogo;