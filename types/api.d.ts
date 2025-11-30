type FieldError = string[];

export type ValidationErrors = Record<string, FieldError>;

export interface ValidationFailureResponse {
  success: false;
  message: string;
  errors?: ValidationErrors;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export type ApiResponse<T> = SuccessResponse<T> | ValidationFailureResponse;
