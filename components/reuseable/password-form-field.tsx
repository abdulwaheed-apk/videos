"use client";

import { useState } from "react";
import { Control, FieldValues, FieldPath } from "react-hook-form";
import { Asterisk, Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define the props with generics for type safety
interface PasswordFormFieldProps<TFieldValues extends FieldValues> {
  // Use Control<TFieldValues> for the control prop
  formControl: Control<TFieldValues>;
  // Use FieldPath<TFieldValues> for the name prop to ensure it matches a key in your form data
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  isRequired?: boolean;
  className?: string;
  description?: string;
}

export function PasswordFormField<TFieldValues extends FieldValues>({
  formControl,
  name,
  label,
  placeholder,
  isRequired = true,
  className = "",
  description = "",
}: PasswordFormFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                autoComplete="off"
                className={cn("pr-10")}
                {...field}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-9 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

