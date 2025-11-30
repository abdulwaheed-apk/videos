import { SelectOption } from "@/types/global";

export const SUPPORTED_AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/webm",
  "audio/ogg",
  "audio/flac",
  "audio/mp3",
];
export const SUPPORTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const SUPPORTED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
];

export const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const LANGUAGES: Language[] = [
  {
    code: "ar",
    name: "arabic",
    direction: "rtl",
    status: "active",
  },
  {
    code: "en",
    name: "english",
    direction: "ltr",
    status: "active",
  },
  {
    code: "fr",
    name: "French",
    direction: "ltr",
    status: "active",
  },
  {
    code: "ur",
    name: "urdu",
    direction: "rtl",
    status: "disabled",
  },
];

export type LangStatus = "active" | "disabled";

export interface Language {
  code: string;
  name: string;
  direction: "ltr" | "rtl";
  status: LangStatus;
}

export const AVAILABLE_LANGUAGES: SelectOption[] = [];

LANGUAGES.filter((l) => l.status !== "disabled").forEach((lang) => {
  AVAILABLE_LANGUAGES.push({
    value: lang.code,
    label: lang.name,
  });
});
