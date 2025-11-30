import { UseFormReturn } from "react-hook-form";
import z from "zod";

export const CategorySchema = () => {
    return z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        isActive: z.boolean(),
    });
};

export type CategorySchemaType = ReturnType<typeof CategorySchema>;
export type CategoryFormFields = z.infer<CategorySchemaType>;
export type CategoryFormReturn = UseFormReturn<CategoryFormFields>;

