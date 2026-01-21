import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  description?: string;
  className?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function CustomSelectField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  description,
  className,
  disabled,
  onChange
}: CustomSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }}
            defaultValue={field.value}
            value={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={`${className} w-full overflow-hidden `}>
                <div className="flex-1 text-left truncate">
                  <SelectValue placeholder={placeholder} />
                </div>
                {/* <SelectValue placeholder={placeholder} /> */}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
