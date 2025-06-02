import { forwardRef, useRef, useEffect } from "react";
import { Input, InputProps } from "./input";
import MaskedInput from "react-input-mask";

export interface InputMaskProps extends Omit<InputProps, "onChange"> {
  mask: string;
  maskChar?: string;
  onChange?: (value: string) => void;
}

const InputMask = forwardRef<HTMLInputElement, InputMaskProps>(
  ({ mask, maskChar = "_", onChange, error, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Sincroniza a ref externa com a ref interna
    useEffect(() => {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    return (
      <MaskedInput
        mask={mask}
        maskChar={maskChar}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange?.(e.target.value)
        }
        {...props}
      >
        {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
          <Input {...inputProps} ref={inputRef} error={error} />
        )}
      </MaskedInput>
    );
  }
);

InputMask.displayName = "InputMask";

export { InputMask };
