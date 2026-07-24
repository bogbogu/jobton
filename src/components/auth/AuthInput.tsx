import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "name"> {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

const AuthInput = ({ id, label, registration, error, className, ...rest }: AuthInputProps) => {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        id={id}
        {...registration}
        {...rest}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${error ? "border-red-400 dark:border-red-500" : "border-slate-300"} ${className ?? ""}`}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default AuthInput;
