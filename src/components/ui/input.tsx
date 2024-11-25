import * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="w-full relative flex items-center bg-white rounded-md overflow-hidden">
        <input
          type={type}
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
