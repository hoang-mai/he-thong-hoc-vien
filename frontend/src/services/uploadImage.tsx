import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File, folder: string) => {
  if (!file) return '';

  const filePath = `${folder}/${file.name}`;

  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
