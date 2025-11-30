import axios from "axios";
import {
  UserDeleteResponse,
  UsersListResponse,
} from "@/types/user";

const api = process.env.NEXT_PUBLIC_API_URL;

export const usersApi = {
  getAll: async (): Promise<UsersListResponse> => {
    const url = `${api}/users`;
    const response = await axios.get<UsersListResponse>(url, {
      withCredentials: true,
    });
    return response.data;
  },
  destroy: async (id: string): Promise<UserDeleteResponse> => {
    const url = `${api}/users/${id}`;
    const response = await axios.delete(url, {
      withCredentials: true,
    });
    return response.data;
  },
};

