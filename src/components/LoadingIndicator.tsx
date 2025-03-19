import { cn } from "@/lib/classNames";

type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

interface LoadingSpinnerProps {
  size?: LoadingSize;
  className?: string;
  fullPage?: boolean;
}

export function LoadingIndicator({
  size = "md",
  className,
  fullPage = false,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px]">
        <div
          className={cn(`loading loading-ring loading-${size}`, className)}
        />
      </div>
    );
  }

  return (
    <div className={cn(`loading loading-ring loading-${size}`, className)} />
  );
}
