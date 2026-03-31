import { cn } from "@/utils/cn";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition",
            value === option.value
              ? "border-green-500 bg-green-500/10"
              : "border-white/10 bg-white/3 hover:border-white/20",
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mt-0.5 accent-green-500"
          />
          <div>
            <span className="text-sm font-medium text-white">
              {option.label}
            </span>
            {option.description && (
              <p className="mt-0.5 text-xs text-slate-400">
                {option.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
