import { Timestamp } from "firebase/firestore";

export interface Video {
  id?: string;
  title: string;
  thumbnail?: string;
  video?: string;
  category: string;
  duration?: string;
  isActive?: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
}

export type CreateVideoPayload = Pick<
  Video,
  "title" | "thumbnail" | "video" | "category" | "duration" | "isActive"
>;

export type VideoDetailResponse = {
  success: boolean;
  message: string;
  data: Video;
};

export type VideoDeleteResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type VideosListResponse = {
  success: boolean;
  message: string;
  data: Video[];
};

export type UpdateVideoPayload = Partial<CreateVideoPayload>;
