import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { CalendarIcon, Check, Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "time"
    | "textarea"
    | "date";
  autoComplete?: string;
  description?: string;
  readOnly?: boolean;
  rows?: number;
  className?: string;
  onChange?: (value: any) => void;
  isFieldValid?: boolean;
}

export function CustomFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  description,
  readOnly = false,
  rows = 4,
  className,
  onChange,
  isFieldValid = false
}: CustomFormFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = type === "password";
  const isTextarea = type === "textarea";
  const isNumberField = type === "number";

  // Calculate position for the password toggle button if a checkmark is present
  const passwordToggleRightStyle = isFieldValid ? "2.5rem" : "0.75rem";

  // Base input class styling including conditional validation style
  const baseInputClass = cn(
    "py-3 h-auto border-gray-300 focus-visible:ring-offset-0",
    {
      "border-green-500 focus-visible:ring-green-500": isFieldValid
    },
    className
  );

  // Helper for rendering Input, Textarea, or Password field
  const renderField = (fieldProps: any) => {
    if (isTextarea) {
      return (
        <Textarea
          placeholder={placeholder}
          {...fieldProps}
          rows={rows}
          className={`resize-none ${className || ""}`}
          readOnly={readOnly}
        />
      );
    }

    if (isNumberField) {
      return (
        <Input
          type="number"
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...fieldProps}
          onChange={(e) => {
            const value = +e.target.value;
            fieldProps.onChange(value);
            onChange?.(value);
          }}
          className={baseInputClass}
          readOnly={readOnly}
        />
      );
    }

    if (type === "date") {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal py-6 border-gray-300",
                !fieldProps.value && "text-muted-foreground",
                baseInputClass
              )}
            >
              {fieldProps.value ? (
                format(new Date(fieldProps.value), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white border rounded-md shadow-md z-50"
            align="start"
          >
            <Calendar
              mode="single"
              selected={
                fieldProps.value ? new Date(fieldProps.value) : undefined
              }
              onSelect={(date) => {
                const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
                fieldProps.onChange(formattedDate);
                onChange?.(formattedDate);
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      );
    }

    // Default Input (Text, Email, Password handling is nested)
    return (
      <Input
        type={isPasswordField && showPassword ? "text" : type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...fieldProps}
        className={baseInputClass}
        readOnly={readOnly}
        onChange={(e) => {
          fieldProps.onChange(e);
          onChange?.(e.target.value);
        }}
      />
    );
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="text-sm">{label}</FormLabel>
          <div className="relative">
            <FormControl>{renderField(field)}</FormControl>

            {/* Password Toggle Button (If password field) */}
            {isPasswordField && (
              <>
                <p className="text-xs text-gray-500 pt-1">
                  At least 8 characters containing a letter and a number.
                </p>
                <button
                  type="button"
                  className="absolute right-3 top-5 h-5 w-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                  // Apply dynamic positioning only if isFieldValid is false (no tick)
                  style={{ right: isFieldValid ? "2.5rem" : "0.75rem" }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </>
            )}

            {/* Green Tick Icon (If valid and not a textarea) */}
            {isFieldValid && !isTextarea && (
              <Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
            )}
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// import React from "react";
// import { Control, FieldPath, FieldValues } from "react-hook-form";
// import { Eye, EyeOff } from "lucide-react";
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from "@/components/shared/ui/form";
// import { Input } from "./ui/input";

// interface CustomFormFieldProps<T extends FieldValues> {
//   control: Control<T>;
//   name: FieldPath<T>;
//   label: string;
//   placeholder: string;
//   type?: "text" | "email" | "password";
//   autoComplete?: string;
// }

// export function CustomFormField<T extends FieldValues>({
//   control,
//   name,
//   label,
//   placeholder,
//   type = "text",
//   autoComplete
// }: CustomFormFieldProps<T>) {
//   const [showPassword, setShowPassword] = React.useState(false);
//   const isPassowrdField = type === "password";

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>{label}</FormLabel>
//           <FormControl>
//             {isPassowrdField ? (
//               <div className="relative">
//                 <Input
//                   type={showPassword ? "text" : "password"}
//                   placeholder={placeholder}
//                   autoComplete={autoComplete}
//                   {...field}
//                   className="py-3 h-auto"
//                 />
//                 <p className="text-xs text-gray-500 pt-1">
//                   At least 8 characters containing a letter and a number.
//                 </p>
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 -top-5 pr-3 flex items-center text-gray-400"
//                   onClick={() => setShowPassword(!showPassword)}
//                   arial-label={showPassword ? "Hide Password" : "Show Password"}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             ) : (
//               <Input
//                 type={type}
//                 placeholder={placeholder}
//                 autoComplete={autoComplete}
//                 {...field}
//                 className="py-3 h-auto"
//               />
//             )}
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   );
// }
