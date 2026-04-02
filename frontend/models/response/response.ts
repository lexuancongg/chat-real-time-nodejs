import { ApiError } from "../error/error";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
};