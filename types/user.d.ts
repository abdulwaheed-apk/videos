import { Timestamp } from "firebase/firestore";

export interface User {
  id?: string;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: Timestamp;
  lastLoginAt?: Timestamp;
}

export type UserDetailResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type UserDeleteResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export type UsersListResponse = {
  success: boolean;
  message: string;
  data: User[];
};

