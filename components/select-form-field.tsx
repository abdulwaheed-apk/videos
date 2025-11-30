import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Asterisk } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectOption } from "@/types/global";
import { toTitleCase } from "@/utils";

// Define the structure for a single select option
// The value must be a string, as required by the shadcn Select component

// Define the props with generics for type safety
interface SelectFormFieldProps<TFieldValues extends FieldValues> {
  formControl: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  isRequired?: boolean;
  className?: string;
}

// Define the generic component
export function SelectFormField<TFieldValues extends FieldValues>({
  formControl,
  name,
  label,
  placeholder,
  options,
  isRequired = false, // Selects are often not required, but you can set this to true
  className = "",
}: SelectFormFieldProps<TFieldValues>) {
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
            {/* onValueChange handles the selection change */}
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                {/* SelectValue shows the currently selected item or the placeholder */}
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {/* Map over the dynamic options list to create SelectItems */}
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {toTitleCase(option.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
