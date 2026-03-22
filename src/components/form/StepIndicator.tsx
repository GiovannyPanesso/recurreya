import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

const STEPS = [
  "Entrada",
  "Notificación",
  "Multa",
  "Detalles",
  "Importe",
  "Tus datos",
];

interface StepIndicatorProps {
  currentStep: number; // 1-based
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={label} className="flex flex-1 items-center">
              {/* Círculo */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
                    isCompleted && "border-blue-500 bg-blue-500 text-white",
                    isActive && "border-blue-500 bg-blue-500/10 text-blue-400",
                    !isCompleted &&
                      !isActive &&
                      "border-white/10 text-slate-600",
                  )}
                >
                  {isCompleted ? <Check size={14} /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "mt-1 hidden text-xs sm:block",
                    isActive ? "text-blue-400" : "text-slate-600",
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Línea conectora */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-px flex-1 transition-all",
                    stepNumber < currentStep ? "bg-blue-500" : "bg-white/10",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
