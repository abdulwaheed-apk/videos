import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Asterisk } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";

// Define the props with generics for type safety
interface InputFormFieldProps<TFieldValues extends FieldValues> {
  // Use Control<TFieldValues> for the control prop
  formControl: Control<TFieldValues>;
  // Use FieldPath<TFieldValues> for the name prop to ensure it matches a key in your form data
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  isRequired?: boolean;
  className?: string;
  type?: HTMLInputTypeAttribute | undefined;
  description?: string;
}

export function InputFormField<TFieldValues extends FieldValues>({
  formControl,
  name,
  label,
  placeholder,
  isRequired = true,
  className = "",
  type = "text",
  description = "",
}: InputFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {/* Label with optional asterisk */}
          <FormLabel className="flex justify-start items-center gap-0.5">
            {label} {isRequired && <Asterisk size={10} />}
          </FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
