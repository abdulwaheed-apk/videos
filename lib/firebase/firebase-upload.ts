import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./client";

export async function uploadToFirebase(
  file: File,
  folder: "audio" | "video",
  fileName?: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const timestamp = Date.now();
  const filename = fileName
    ? `${folder}/${fileName}`
    : `${folder}/${timestamp}-${file.name}`;
  const storageRef = ref(storage, filename);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      },
    );
  });
}
