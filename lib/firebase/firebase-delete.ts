import { adminStorage } from "./admin";

/**
 * Extracts the file path from a Firebase Storage URL
 * Example: https://firebasestorage.googleapis.com/v0/b/bucket/o/video%2Ffile.mp4?alt=media
 * Returns: video/file.mp4
 */
export function extractFilePathFromUrl(url: string): string | null {
  try {
    // Parse the URL
    const urlObj = new URL(url);
    
    // Check if it's a Firebase Storage URL
    if (!urlObj.hostname.includes("firebasestorage.googleapis.com")) {
      return null;
    }

    // Extract the path from the URL
    // Format: /v0/b/bucket-name/o/path%2Fto%2Ffile?alt=media
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)$/);
    if (!pathMatch) {
      return null;
    }

    // Decode the path (handles URL encoding like %2F -> /)
    const encodedPath = pathMatch[1];
    const decodedPath = decodeURIComponent(encodedPath);
    
    return decodedPath;
  } catch (error) {
    console.error("Error extracting file path from URL:", error);
    return null;
  }
}

/**
 * Deletes a file from Firebase Storage using the file URL
 * @param fileUrl - The Firebase Storage download URL
 * @returns Promise that resolves to true if deleted, false otherwise
 */
export async function deleteFileFromStorage(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl || !fileUrl.trim()) {
      return false;
    }

    const filePath = extractFilePathFromUrl(fileUrl);
    if (!filePath) {
      console.warn("Could not extract file path from URL:", fileUrl);
      return false;
    }

    // Get the bucket
    const bucket = adminStorage.bucket();
    
    // Get the file reference
    const file = bucket.file(filePath);
    
    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      console.warn("File does not exist in storage:", filePath);
      return false;
    }

    // Delete the file
    await file.delete();
    console.log("Successfully deleted file from storage:", filePath);
    return true;
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    return false;
  }
}

/**
 * Deletes multiple files from Firebase Storage
 * @param fileUrls - Array of Firebase Storage download URLs
 * @returns Promise that resolves to the number of successfully deleted files
 */
export async function deleteFilesFromStorage(
  fileUrls: (string | undefined | null)[]
): Promise<number> {
  const validUrls = fileUrls.filter(
    (url): url is string => !!url && typeof url === "string"
  );

  if (validUrls.length === 0) {
    return 0;
  }

  const deletePromises = validUrls.map((url) => deleteFileFromStorage(url));
  const results = await Promise.allSettled(deletePromises);
  
  const successCount = results.filter(
    (result) => result.status === "fulfilled" && result.value === true
  ).length;

  return successCount;
}

