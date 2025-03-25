import api from "@/lib/api";

interface SkinTestQuestionData {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

class SkinTestQuestionService {
  private baseUrl = "/skin-test-questions";

  // Lấy tất cả câu hỏi
  async getSkinTestQuestions(): Promise<any> {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách câu hỏi:", error);
      throw error;
    }
  }

  // Lấy câu hỏi theo ID
  async getSkinTestQuestionById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy câu hỏi với id ${id}:`, error);
      throw error;
    }
  }

  // Tạo câu hỏi mới
  async createSkinTestQuestion(skinTestQuestionData: SkinTestQuestionData): Promise<any> {
    try {
      const response = await api.post(this.baseUrl, skinTestQuestionData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo câu hỏi mới:", error);
      throw error;
    }
  }

  // Cập nhật câu hỏi
  async updateSkinTestQuestion(id: number, skinTestQuestionData: SkinTestQuestionData): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, skinTestQuestionData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật câu hỏi với id ${id}:`, error);
      throw error;
    }
  }

  // Xóa câu hỏi
  async deleteSkinTestQuestion(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Lỗi khi xóa câu hỏi với id ${id}:`, error);
      throw error;
    }
  }

  // Lấy câu hỏi theo skin test ID
  async getSkinTestQuestionsBySkinTestId(skinTestId: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/by-skin-test/${skinTestId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy câu hỏi theo skin test id ${skinTestId}:`, error);
      throw error;
    }
  }

  // Tạo câu hỏi cho một skin test
  async createSkinTestQuestionForSkinTest(skinTestId: number, skinTestQuestionData: SkinTestQuestionData): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}/${skinTestId}`, skinTestQuestionData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo câu hỏi cho skin test id ${skinTestId}:`, error);
      throw error;
    }
  }
}

export default new SkinTestQuestionService();
