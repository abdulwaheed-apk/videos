import { UseFormReturn } from "react-hook-form";
import z from "zod";

// Schema for form (accepts File objects for uploads)
export const VideoSchema = () => {
    return z.object({
        title: z.string().min(1, "Title is required"),
        thumbnail: z.instanceof(File).optional(),
        video: z.instanceof(File).optional(),
        category: z.string().min(1, "Category is required"),
        duration: z.string().optional(),
    });
};

// Schema for backend API (accepts string URLs)
export const BackendVideoSchema = () => {
    return z.object({
        title: z.string().min(1, "Title is required"),
        thumbnail: z.string().optional(),
        video: z.string().optional(),
        category: z.string().min(1, "Category is required"),
        duration: z.string().optional(),
        isActive: z.boolean().optional(),
    });
};

export type VideoSchemaType = ReturnType<typeof VideoSchema>;
export type VideoFormFields = z.infer<VideoSchemaType>;
export type VideoFormReturn = UseFormReturn<VideoFormFields>;

export type BackendVideoSchemaType = ReturnType<typeof BackendVideoSchema>;
export type BackendVideoFormFields = z.infer<BackendVideoSchemaType>;

