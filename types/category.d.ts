import { Timestamp } from "firebase/firestore";

export interface Category {
    id?: string;
    title: string;
    description?: string;
    isActive?: boolean;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    createdBy: string;
}

export type CreateCategoryPayload = Pick<Category, "title" | "description" | "isActive">;

export type CategoryDetailResponse = {
    success: boolean;
    message: string;
    data: Category;
};
export type CategoryDeleteResponse = {
    success: boolean;
    message: string;
    error?: unknown;
};

export type CategoriesListResponse = {
    success: boolean;
    message: string;
    data: Category[];
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

