type FormInputWrapperProps = {
  labelText: string;
  id: string;
  icon?: React.ReactNode;
  errorMsg: string;
  inputElement: React.ReactNode;
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
      <label htmlFor={id} className="label">
        <span className="label-text font-medium">{labelText}</span>
      </label>
      <div className="relative">
        {icon ? (
          <div className="absolute inset-y-0 z-1 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        ) : null}
        {inputElement}
      </div>
      <p className="text-red-500">{String(errorMsg)}</p>
    </div>
  );
}
