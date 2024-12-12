import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  require?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, icon, value, onChange, require = false, ...props },
    ref
  ) => {
    return (
      <div className="w-full relative flex items-center bg-white rounded-md overflow-hidden">
        {require && (
          <span className="absolute left-1 top-0 text-red-500 text-sm font-bold">
            *
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={cn(
            "left-0 focus-visible:outline-none flex h-9 w-full px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          // rounded-md border border-input bg-transparent
          // focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          ref={ref}
          {...props}
        />
        {icon && <button className="px-3">{icon}</button>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
