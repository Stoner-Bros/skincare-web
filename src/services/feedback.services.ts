import api from "@/lib/api";

class FeedbackService {
  private baseUrl = "/feedbacks";

  async getFeedbacks(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          pageNumber,
          pageSize,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách feedback:", error);
      throw error;
    }
  }

  async getFeedbackById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy feedback với id ${id}:`, error);
      throw error;
    }
  }

  async getFeedbackByBookingId(bookingId: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy feedback theo booking id ${bookingId}:`, error);
      throw error;
    }
  }

  async createFeedback(bookingId: number, feedbackData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, feedbackData, {
        params: {
          bookingId
        }
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo feedback:", error);
      throw error;
    }
  }

  async updateFeedback(id: number, feedbackData: any): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật feedback với id ${id}:`, error);
      throw error;
    }
  }

  async deleteFeedback(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Lỗi khi xóa feedback với id ${id}:`, error);
      throw error;
    }
  }
}

export default new FeedbackService();
