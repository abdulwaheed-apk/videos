import axios from "axios";
import {
  CreateVideoPayload,
  VideoDeleteResponse,
  VideoDetailResponse,
  VideosListResponse,
  UpdateVideoPayload,
} from "@/types/video";

const api = process.env.NEXT_PUBLIC_API_URL;

export const videosApi = {
  getAll: async (): Promise<VideosListResponse> => {
    const url = `${api}/videos`;
    const response = await axios.get<VideosListResponse>(url, {
      withCredentials: true,
    });
    return response.data;
  },
  create: async (payload: CreateVideoPayload): Promise<VideoDetailResponse> => {
    const url = `${api}/videos`;
    const response = await axios.post<VideoDetailResponse>(url, payload, {
      withCredentials: true,
    });
    return response.data;
  },
  destroy: async (id: string): Promise<VideoDeleteResponse> => {
    const url = `${api}/videos/${id}`;
    const response = await axios.delete(url, {
      withCredentials: true,
    });
    return response.data;
  },
  getById: async (id: string): Promise<VideoDetailResponse> => {
    const url = `${api}/videos/${id}`;
    const response = await axios.get<VideoDetailResponse>(url, {
      withCredentials: true,
    });
    return response.data;
  },
  update: async (
    id: string,
    payload: UpdateVideoPayload,
  ): Promise<VideoDetailResponse> => {
    const url = `${api}/videos/${id}`;
    const response = await axios.patch<VideoDetailResponse>(url, payload, {
      withCredentials: true,
    });
    return response.data;
  },
};
