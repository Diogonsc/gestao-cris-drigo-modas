
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  description?: string;
  control: Control<T>;
  render: React.ComponentType<{
    field: {
      value: any;
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      name: string;
      ref: React.Ref<any>;
    };
  }>;
}

export function CustomFormField<T extends FieldValues>({
  name,
  label,
  description,
  control,
  render: Component,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Component field={field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
