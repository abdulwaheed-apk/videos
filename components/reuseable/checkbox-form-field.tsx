import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Asterisk } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckBoxFormFieldFormFieldProps<TFieldValues extends FieldValues> {
  formControl: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  description?: string;
  isRequired?: boolean;
  className?: string;
  iconClassName?: string;
}

export function CheckBoxFormField<TFieldValues extends FieldValues>({
  formControl,
  name,
  label,
  description,
  isRequired = true,
  className = "",
  iconClassName = "size-4",
}: CheckBoxFormFieldFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0 rounded-md border border-transparent p-4",
            className,
          )}
        >
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              className={iconClassName}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="flex justify-start items-center gap-0.5 font-normal">
              {label} {isRequired && <Asterisk size={10} />}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
