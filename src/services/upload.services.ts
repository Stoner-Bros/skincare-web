import api from "@/lib/api";

interface UploadResponse {
  status: number;
  message: string;
  data: {
    fileName: string;
    path: string;
  };
}

class UploadService {
  private baseUrl = "/upload";

  async uploadImage(file: File): Promise<UploadResponse> {
    // Cần tạo FormData để tải lên file đúng cách
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<UploadResponse>(
      `${this.baseUrl}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
}

export default new UploadService();
