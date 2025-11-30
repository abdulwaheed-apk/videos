import axios from "axios";
import {
    CreateCategoryPayload,
    CategoryDeleteResponse,
    CategoryDetailResponse,
    CategoriesListResponse,
    UpdateCategoryPayload,
} from "@/types/category";

const api = process.env.NEXT_PUBLIC_API_URL;

export const categoriesApi = {
    getAll: async (): Promise<CategoriesListResponse> => {
        const url = `${api}/categories`;
        const response = await axios.get<CategoriesListResponse>(url, {
            withCredentials: true,
        });
        return response.data;
    },
    create: async (
        payload: CreateCategoryPayload,
    ): Promise<CategoryDetailResponse> => {
        const url = `${api}/categories`;
        const response = await axios.post<CategoryDetailResponse>(url, payload, {
            withCredentials: true,
        });
        return response.data;
    },
    destroy: async (id: string): Promise<CategoryDeleteResponse> => {
        const url = `${api}/categories/${id}`;
        const response = await axios.delete(url, {
            withCredentials: true,
        });
        return response.data;
    },
    getById: async (id: string): Promise<CategoryDetailResponse> => {
        const url = `${api}/categories/${id}`;
        const response = await axios.get<CategoryDetailResponse>(url, {
            withCredentials: true,
        });
        return response.data;
    },
    update: async (
        id: string,
        payload: UpdateCategoryPayload,
    ): Promise<CategoryDetailResponse> => {
        const url = `${api}/categories/${id}`;
        const response = await axios.patch<CategoryDetailResponse>(url, payload, {
            withCredentials: true,
        });
        return response.data;
    },
};

