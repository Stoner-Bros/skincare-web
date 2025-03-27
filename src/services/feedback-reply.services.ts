import api from "@/lib/api";

interface FeedbackReplyData {
  reply: string;
  staffName?: string;
}

class FeedbackReplyService {
  private baseUrl = "/feedback-replies";

  async getFeedbackReplies(): Promise<any> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phản hồi:", error);
      throw error;
    }
  }

  async getFeedbackRepliesByFeedbackId(feedbackId: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy phản hồi cho feedback ID ${feedbackId}:`, error);
      throw error;
    }
  }

  async createFeedbackReply(feedbackId: number, replyData: FeedbackReplyData): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/feedback/${feedbackId}`, replyData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo phản hồi:", error);
      throw error;
    }
  }

  async updateFeedbackReply(id: number, replyData: FeedbackReplyData): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, replyData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật phản hồi với ID ${id}:`, error);
      throw error;
    }
  }

  async deleteFeedbackReply(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Lỗi khi xóa phản hồi với ID ${id}:`, error);
      throw error;
    }
  }
}

export default new FeedbackReplyService();
