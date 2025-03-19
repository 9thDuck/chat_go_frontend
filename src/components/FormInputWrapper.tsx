import React from "react";
import { cn } from "@/lib/classNames";

type FormInputWrapperProps = {
  labelText: string;
  id: string;
  icon?: React.ReactNode;
  errorMsg: string;
  inputElement: React.ReactElement<{ className?: string }>;
};

export function FormInputWrapper({
  labelText,
  icon,
  id,
  errorMsg,
  inputElement,
}: FormInputWrapperProps) {
  return (
    <div className="form-control">
      <label htmlFor={id} className="label py-1 sm:py-2">
        <span className="label-text font-medium text-base-content/90 select-none">
          {labelText}
        </span>
      </label>
      <div className="relative group">
        {icon ? (
          <div className="absolute inset-y-0 z-1 left-0 pl-3 flex items-center pointer-events-none text-base-content/40 group-hover:text-base-content/60 transition-colors">
            {icon}
          </div>
        ) : null}
        {React.cloneElement(inputElement, {
          className: cn(
            inputElement.props.className,
            "input input-bordered w-full pl-10 focus:input-primary transition-colors placeholder:text-base-content/40 hover:border-primary/50"
          ),
        })}
      </div>
      <p
        id={`${id}-error`}
        className="text-error text-sm mt-1 min-h-[20px]"
        role="alert"
      >
        {String(errorMsg)}
      </p>
    </div>
  );
}
