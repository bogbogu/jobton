import { useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa6";

interface SocialLoginButtonProps {
  provider: "Google" | "LinkedIn";
}

const SocialLoginButton = ({ provider }: SocialLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const icon =
    provider === "Google" ? (
      <FaGoogle className="h-4 w-4 text-[#DB4437]" aria-hidden="true" />
    ) : (
      <FaLinkedinIn className="h-4 w-4 text-[#0A66C2]" aria-hidden="true" />
    );

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden="true">
        {icon}
      </span>
      {isLoading ? `Connecting to ${provider}...` : `Continue with ${provider}`}
    </button>
  );
};

export default SocialLoginButton;
