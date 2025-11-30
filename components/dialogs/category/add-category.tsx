"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategorySchema,
  CategoryFormFields as Inputs,
} from "@/schemas/category.schema";
import { useCreateCategory } from "@/lib/hooks/mutations/use-categories";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";
import { InputFormField } from "@/components/reuseable/input-form-field";
import { TextareaFormField } from "@/components/reuseable/textarea-form-field";

export function AddCategory() {
  const schema = CategorySchema();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const createMutation = useCreateCategory();

  const form = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      isActive: true,
    },
  });

  if (!user || !user?.uid) return;

  const submitForm: SubmitHandler<Inputs> = async (formData) => {
    const res = await createMutation.mutateAsync(formData);
    if (res.success) {
      form.reset();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>Create a new Category</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitForm)} className="grid gap-6">
            <div className="grid gap-4">
              <InputFormField
                name="title"
                label="Category Title"
                formControl={form.control}
                placeholder="Category Title"
              />
              <TextareaFormField
                name="description"
                label="Category Description"
                formControl={form.control}
                placeholder="Category Description"
                isRequired={false}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
