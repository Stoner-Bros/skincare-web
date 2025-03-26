import api from "@/lib/api";

// Interface cho câu hỏi trong bài test
interface SkinTestQuestion {
  skinTestQuestionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

// Interface cho thông tin bài test
interface SkinTest {
  skinTestId: number;
  testName: string;
  description: string;
  createdAt: string;
  skinTestQuestions: SkinTestQuestion[];
}

// Interface cho customer/guest
interface Customer {
  customerId: number;
  fullName: string;
  phone: string;
}

interface Guest {
  guestId: number;
  fullName: string;
  phone: string;
}

// Interface cho dữ liệu trả về từ API
export interface SkinTestAnswer {
  answerId: number;
  skinTestId: number;
  customer?: Customer | null;
  guest?: Guest | null;
  answers: string[];
  skinTest: SkinTest;
  email?: string;
}

class SkinTestAnswerService {
  private baseUrl = "/skin-test-answers";

  async getSkinTestAnswers(): Promise<SkinTestAnswer[]> {
    try {
      console.log("Gọi API lấy danh sách skin test answers");
      const response = await api.get(this.baseUrl);

      // Log chi tiết dữ liệu trả về
      console.log("Dữ liệu trả về từ API getSkinTestAnswers:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error fetching skin test answers:", error);
      throw error;
    }
  }

  async getSkinTestAnswerById(id: number): Promise<SkinTestAnswer> {
    try {
      console.log(`Gọi API lấy thông tin skin test answer với id: ${id}`);
      const response = await api.get(`${this.baseUrl}/${id}`);

      // Log chi tiết dữ liệu trả về
      console.log("Dữ liệu API trả về từ skin-test-answer:", response.data);

      // Kiểm tra và khởi tạo mảng answers nếu nó không tồn tại hoặc không phải là mảng
      if (!response.data.answers || !Array.isArray(response.data.answers)) {
        console.warn("Dữ liệu answers không hợp lệ, khởi tạo mảng rỗng");
        response.data.answers = [];
      }

      return response.data;
    } catch (error: any) {
      console.error(`Error fetching skin test answer with id ${id}:`, error);
      // Ghi log chi tiết lỗi nếu có
      if (error.response) {
        console.error("Chi tiết lỗi từ API:", {
          status: error.response.status,
          data: error.response.data,
        });
      }
      throw error;
    }
  }

  async createSkinTestAnswer(answerData: {
    skinTestId: number;
    fullName: string;
    phone: string;
    email?: string;
    answers: string[];
  }): Promise<SkinTestAnswer> {
    try {
      console.log("Gửi dữ liệu tới API createSkinTestAnswer:", answerData);
      const response = await api.post(this.baseUrl, answerData);
      console.log("Kết quả tạo skin test answer:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating skin test answer:", error);
      throw error;
    }
  }

  // Lấy lịch sử làm bài kiểm tra theo customerId
  async getSkinTestAnswerHistoryByCustomerId(
    customerId: number
  ): Promise<SkinTestAnswer[]> {
    try {
      console.log(`Lấy lịch sử làm bài kiểm tra cho customer ${customerId}`);
      const response = await api.get(
        `${this.baseUrl}/by-customer/${customerId}`
      );
      console.log("Lịch sử làm bài kiểm tra:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching skin test answer history for customer ${customerId}:`,
        error
      );
      throw error;
    }
  }

  // Lấy tất cả lịch sử làm bài kiểm tra
  async getSkinTestAnswerHistory(): Promise<SkinTestAnswer[]> {
    try {
      console.log("Lấy tất cả lịch sử làm bài kiểm tra");
      const response = await api.get(`${this.baseUrl}/history`);
      console.log("Dữ liệu lịch sử:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching skin test answer history:", error);
      throw error;
    }
  }
}

export default new SkinTestAnswerService();
