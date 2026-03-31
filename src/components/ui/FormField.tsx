import { cn } from "@/utils/cn";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function FormField({
  label,
  error,
  required,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-300">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition",
        "focus:border-green-500 focus:ring-1 focus:ring-green-500",
        error ? "border-red-500" : "border-white/10",
        className,
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border bg-[#051a0f] px-4 py-2.5 text-sm text-white outline-none transition",
        "focus:border-green-500 focus:ring-1 focus:ring-green-500",
        error ? "border-red-500" : "border-white/10",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
