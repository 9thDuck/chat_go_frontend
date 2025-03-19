import { cn } from "@/lib/classNames";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  label?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, error, label, id, rightElement, ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label htmlFor={id} className="label py-1 sm:py-2">
            <span className="label-text font-medium text-base-content/90 select-none">
              {label}
            </span>
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 z-1 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-hover:text-base-content/60 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "input input-bordered w-full transition-colors",
              icon && "pl-10",
              "placeholder:text-base-content/40",
              "hover:border-primary/50",
              "focus:input-primary",
              "focus:outline-none focus:ring-1 focus:ring-primary/50",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <label className="label py-1">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
