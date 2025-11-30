export type RadioOption = {
  value: string;
  label: string;
};
export type SelectOption = {
  value: string;
  label: string;
};

export interface ApiResponse {
  success: boolean;
  message: string;
}

export type TranslationFunction = (key: string) => string;

export type YES_NO = "yes" | "no";
