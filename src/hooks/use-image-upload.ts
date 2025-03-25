import { useState } from "react";

interface UseImageUploadReturn {
  selectedFile: File | null;
  previewImage: string | null;
  setPreviewImage: (url: string | null) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadImage: () => Promise<string>;
  resetImage: () => void;
}

export function useImageUpload(initialPreview?: string): UseImageUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialPreview || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) return "";

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          Accept: "*/*",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const responseData = await response.json();
      return responseData.data.fileName;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const resetImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  return {
    selectedFile,
    previewImage,
    setPreviewImage,
    handleImageChange,
    uploadImage,
    resetImage,
  };
}
