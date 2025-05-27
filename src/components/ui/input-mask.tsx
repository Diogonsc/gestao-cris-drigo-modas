import { forwardRef } from "react";
import { Input, InputProps } from "./input";
import MaskedInput from "react-input-mask";

export interface InputMaskProps extends Omit<InputProps, "onChange"> {
  mask: string;
  maskChar?: string;
  onChange?: (value: string) => void;
}

const InputMask = forwardRef<HTMLInputElement, InputMaskProps>(
  ({ mask, maskChar = "_", onChange, error, ...props }, ref) => {
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
          <Input {...inputProps} ref={ref} error={error} />
        )}
      </MaskedInput>
    );
  }
);

InputMask.displayName = "InputMask";

export { InputMask };
