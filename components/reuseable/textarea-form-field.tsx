import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Asterisk } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Define the props with generics for type safety
interface TextareaFormFieldProps<TFieldValues extends FieldValues> {
  formControl: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  isRequired?: boolean;
  rows?: number;
  dir?: "ltr" | "rtl";
}

// Define the generic component
export function TextareaFormField<TFieldValues extends FieldValues>({
  formControl,
  name,
  label,
  placeholder,
  isRequired = true,
  rows = 3, // Default rows for a standard height
  dir = "ltr",
}: TextareaFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem dir={dir}>
          {/* Label with optional asterisk */}
          <FormLabel className="flex justify-start items-center gap-0.5">
            {label} {isRequired && <Asterisk size={10} />}
          </FormLabel>
          <FormControl>
            {/* The Textarea component is used here */}
            <Textarea
              placeholder={placeholder}
              rows={rows} // Apply the optional rows prop
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
