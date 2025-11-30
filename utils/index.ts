import { LANGUAGES } from "./constants";

export function toTitleCase(input: string | undefined | null): string {
  if (!input) return "";
  return (
    input
      .trim()
      // Replace underscores and hyphens with spaces
      .replace(/[_-]+/g, " ")
      // Collapse multiple spaces into one
      .replace(/\s+/g, " ")
      // Convert each word to Title Case
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  );
}

export function getLangName(code: string) {
  return LANGUAGES.find((lang) => lang.code === code)?.name;
}

export const getExtension = (
  fileName: string,
): { baseName: string; extension: string } => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return { baseName: fileName, extension: "" };
  }
  return {
    baseName: fileName.substring(0, lastDotIndex),
    extension: fileName.substring(lastDotIndex), // Includes the dot, e.g., ".mp3"
  };
};
