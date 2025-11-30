"use client";
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    CategorySchema,
    CategoryFormFields as Inputs,
} from "@/schemas/category.schema";
import { useUpdateCategory } from "@/lib/hooks/mutations/use-categories";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Loader2 } from "lucide-react";
import { useCategoryById } from "@/lib/hooks/queries/use-categories";
import { IconEdit } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";

export function UpdateCategory({ id }: { id: string }) {
    const schema = CategorySchema();
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const updateMutation = useUpdateCategory(id);
    const { data } = useCategoryById(id);

    const category = data?.data;

    const form = useForm<Inputs>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            title: category?.title ?? "",
            description: category?.description ?? "",
            isActive: category?.isActive ?? true,
        },
    });

    // Update form when category data loads
    useEffect(() => {
        if (category) {
            form.reset({
                title: category.title ?? "",
                description: category.description ?? "",
                isActive: category.isActive ?? true,
            });
        }
    }, [category, form]);

    if (!user || !user?.uid) return;

    const submitForm: SubmitHandler<Inputs> = async (formData) => {
        const res = await updateMutation.mutateAsync(formData);
        if (res.success) {
            form.reset();
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <IconEdit />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Category</DialogTitle>
                    <DialogDescription>Update Category</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(submitForm)} className="grid gap-6">
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="medical" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type here..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Active Status</FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                Enable or disable this category
                                            </div>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
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
                                {updateMutation.isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <span>Update</span>
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

