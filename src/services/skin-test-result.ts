import api from "@/lib/api";

class SkinTestResultService {
  private baseUrl = "/skin-test-results";

  async getSkinTestResults(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      const params: any = {
        pageNumber,
        pageSize,
      };

      const response = await api.get(this.baseUrl, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching skin test results:", error);
      throw error;
    }
  }

  // Lấy kết quả khuyến nghị dựa trên skinTestAnswerId
  async getSkinTestResultById(answerId: number): Promise<any> {
    try {
      console.log(`Đang tìm kết quả khuyến nghị cho bài làm với AnswerID: ${answerId}`);
      
      // Đầu tiên lấy tất cả kết quả để tìm kết quả có SkinTestAnswerID trùng với AnswerID
      const response = await api.get(this.baseUrl);
      console.log(`Đã nhận ${response.data.length} kết quả từ API`);
      
      // Tìm kết quả có SkinTestAnswerID khớp với answerId
      const matchingResult = response.data.find((result: any) => 
        result.skinTestAnswerId === answerId
      );
      
      if (matchingResult) {
        console.log(`Đã tìm thấy kết quả khuyến nghị cho AnswerID ${answerId}:`, matchingResult);
        
        // Kiểm tra trường "result" có tồn tại không
        if (matchingResult.result !== undefined) {
          console.log("Loại dữ liệu của result:", typeof matchingResult.result);
          console.log("Giá trị của result:", matchingResult.result);
          
          // Thử parse nếu là chuỗi JSON
          if (typeof matchingResult.result === 'string') {
            try {
              const parsed = JSON.parse(matchingResult.result);
              console.log("Dữ liệu sau khi parse:", parsed);
            } catch (e) {
              console.warn("Không thể parse chuỗi JSON:", e);
            }
          }
        } else {
          console.warn("Kết quả không chứa trường 'result'");
        }
        
        return matchingResult;
      } else {
        console.warn(`Không tìm thấy kết quả khuyến nghị nào cho AnswerID ${answerId}`);
        throw new Error(`Không tìm thấy kết quả khuyến nghị cho AnswerID ${answerId}`);
      }
    } catch (error: any) {
      console.error(`Lỗi khi tìm kết quả khuyến nghị với AnswerID ${answerId}:`, error);
      
      // Ghi log chi tiết lỗi nếu có
      if (error.response) {
        console.error("Chi tiết lỗi từ API:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ máy chủ:", error.request);
      } else {
        console.error("Lỗi cấu hình request:", error.message);
      }
      
      throw error;
    }
  }

  async createSkinTestResult(
    skinTestAnswerId: number,
    resultData: { result: string }
  ): Promise<any> {
    try {
      const response = await api.post(
        `${this.baseUrl}/${skinTestAnswerId}`,
        resultData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating skin test result:", error);
      throw error;
    }
  }

  async updateSkinTestResult(
    id: number,
    resultData: { result: string }
  ): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, resultData);
      return response.data;
    } catch (error) {
      console.error(`Error updating skin test result with id ${id}:`, error);
      throw error;
    }
  }

  async deleteSkinTestResult(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting skin test result with id ${id}:`, error);
      throw error;
    }
  }
}

export default new SkinTestResultService();
