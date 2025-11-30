"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { InputFormField } from "../reuseable/input-form-field";
import { PasswordFormField } from "../reuseable/password-form-field";
import { useLoginWithEmail } from "@/lib/hooks/mutations/use-auth";
import { LoginFormData, loginSchema } from "@/schemas/auth.schema";
import { Loader2 } from "lucide-react";

export function SigninForm({ ...props }: React.ComponentProps<typeof Card>) {
  const loginWithEmail = useLoginWithEmail();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    loginWithEmail.mutate(data);
  };

  const isPending = loginWithEmail.isPending;

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle> Welcome Back </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <InputFormField
                name="email"
                label={"Email"}
                placeholder="you@example.com"
                formControl={form.control}
              />
              <PasswordFormField
                name="password"
                label={"Password"}
                placeholder={"Enter Password"}
                formControl={form.control}
              />
              <FieldGroup>
                <Field>
                  <Button disabled={isPending} type="submit">
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                      </>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
