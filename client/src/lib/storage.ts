import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

export async function uploadCmsImage(file: File, folder: string, uploadedBy?: string): Promise<string> {
  if (!storage) {
    throw new Error("Firebase Storage is not configured.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large. Maximum size is 10MB.");
  }

  const safeName = sanitizeFileName(file.name || "upload.jpg");
  const timestamp = Date.now();
  const uploader = uploadedBy ?? "unknown";
  const path = `${folder}/${uploader}/${timestamp}-${safeName}`;

  const objectRef = ref(storage, path);
  await uploadBytes(objectRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedBy: uploader,
      uploadedAt: new Date().toISOString(),
    },
  });

  return getDownloadURL(objectRef);
}
