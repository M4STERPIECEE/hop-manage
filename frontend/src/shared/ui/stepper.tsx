import { cn } from "src/shared/lib/utils";

export type StepperStep = { label: string };

type StepperProps = {
  steps: StepperStep[];
  /** 1-indexed current step */
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="mx-auto flex w-fit items-center">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <li key={step.label} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full font-medium text-xs",
                  isDone || isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground",
                )}
              >
                {stepNumber}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-sm",
                  isCurrent
                    ? "font-medium text-foreground"
                    : isDone
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  "mx-3 h-px w-16",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
