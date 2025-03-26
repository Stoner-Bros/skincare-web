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

  async getSkinTestResultById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skin test result with id ${id}:`, error);
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
