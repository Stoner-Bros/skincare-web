import api from "@/lib/api";

interface ConsultingFormData {
  message: string;
  email: string;
  phone: string;
  fullName: string;
}

interface ConsultingFormUpdateData {
  status: string;
  updatedAt?: string;
}

class ConsultationService {
  private baseUrl = "/consulting-forms";

  // Lấy tất cả form tư vấn với phân trang
  async getConsultingForms(pageNumber: number = 1, pageSize: number = 10): Promise<any> {
    try {
      const response = await api.get(this.baseUrl, {
        params: {
          pageNumber,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách form tư vấn:", error);
      throw error;
    }
  }

  // Lấy form tư vấn theo ID
  async getConsultingFormById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy form tư vấn với id ${id}:`, error);
      throw error;
    }
  }

  // Tạo form tư vấn mới
  async createConsultingForm(consultingFormData: ConsultingFormData): Promise<any> {
    try {
      const response = await api.post(this.baseUrl, consultingFormData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo form tư vấn mới:", error);
      throw error;
    }
  }

  // Cập nhật form tư vấn
  async updateConsultingForm(id: number, consultingFormData: ConsultingFormUpdateData): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, consultingFormData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật form tư vấn với id ${id}:`, error);
      throw error;
    }
  }

  // Xóa form tư vấn
  async deleteConsultingForm(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Lỗi khi xóa form tư vấn với id ${id}:`, error);
      throw error;
    }
  }
}

export default new ConsultationService();
