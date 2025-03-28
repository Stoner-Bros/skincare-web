import api from "@/lib/api";

class OverviewService {
  private baseUrl = "/overview";

  async getOverview(startDate: any, endDate: any): Promise<any> {
    try {
      const response = await api.post(this.baseUrl, {
        startDate,
        endDate,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy tổng quan:", error);
      throw error;
    }
  }
}

export default new OverviewService();
