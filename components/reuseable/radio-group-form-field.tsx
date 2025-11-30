"use client";
import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Asterisk } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RadioOption } from "@/types/global";

// Define the props with generics for type safety
interface RadioGroupFormFieldProps<TFieldValues extends FieldValues> {
  formControl: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  options: RadioOption[]; // The list of options to render
  isRequired?: boolean;
}

// Define the generic component
export function RadioGroupFormField<TFieldValues extends FieldValues>({
  formControl,
  name,
  label,
  options,
  isRequired = true,
}: RadioGroupFormFieldProps<TFieldValues>) {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex justify-start items-center gap-0.5">
            {label} {isRequired && <Asterisk size={10} />}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => {
                const uniqueId = `${field.name}-${option.value}`;
                return (
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                    key={option.value}
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} id={uniqueId} />
                    </FormControl>
                    <Label
                      className="font-normal capitalize"
                      htmlFor={uniqueId}
                    >
                      {option.label}
                    </Label>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
