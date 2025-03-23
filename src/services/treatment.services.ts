import api from "@/lib/api";
class TreatmentService {
  private baseUrl = "/treatments";

  async getTreatments(
    serviceId?: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      const params: any = {
        pageNumber,
        pageSize,
      };

      if (serviceId !== undefined) {
        params.serviceId = serviceId;
      }

      const response = await api.get(`${this.baseUrl}`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching treatments:", error);
      throw error;
    }
  }

  async getTreatmentById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching treatment with id ${id}:`, error);
      throw error;
    }
  }

  async createTreatment(treatmentData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, treatmentData);
      return response.data;
    } catch (error) {
      console.error("Error creating treatment:", error);
      throw error;
    }
  }

  async updateTreatment(id: number, treatmentData: any): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, treatmentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating treatment with id ${id}:`, error);
      throw error;
    }
  }

  async deleteTreatment(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting treatment with id ${id}:`, error);
      throw error;
    }
  }
}

export default new TreatmentService();
