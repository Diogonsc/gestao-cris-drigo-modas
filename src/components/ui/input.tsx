import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, inputRef, ...props }, ref) => {
    // Combinando as refs usando useCallback
    const combinedRef = React.useCallback(
      (element: HTMLInputElement | null) => {
        // Atualiza a ref externa
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
        // Atualiza a inputRef se fornecida
        if (typeof inputRef === "function") {
          inputRef(element);
        } else if (inputRef) {
          (
            inputRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = element;
        }
      },
      [ref, inputRef]
    );

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={combinedRef}
          {...props}
        />
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
