import api from "@/lib/api";

interface SkinTestData {
  testName: string;
  description: string;
  skinTestQuestions?: Array<{
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  }>;
}

class SkinTestService {
  private baseUrl = "/skin-tests";

  async getSkinTests(pageNumber: number = 1, pageSize: number = 10): Promise<any> {
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
      console.error("Error fetching skin tests:", error);
      throw error;
    }
  }

  async getSkinTestById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skin test with id ${id}:`, error);
      throw error;
    }
  }

  async createSkinTest(skinTestData: SkinTestData): Promise<any> {
    try {
      const response = await api.post(this.baseUrl, skinTestData);
      return response.data;
    } catch (error) {
      console.error("Error creating skin test:", error);
      throw error;
    }
  }

  async updateSkinTest(id: number, skinTestData: SkinTestData): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, skinTestData);
      return response.data;
    } catch (error) {
      console.error(`Error updating skin test with id ${id}:`, error);
      throw error;
    }
  }

  async deleteSkinTest(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting skin test with id ${id}:`, error);
      throw error;
    }
  }
}

export default new SkinTestService();
