import api from "@/lib/api";

class SkinTherapistService {
  private baseUrl = "/skintherapists";

  async getSkinTherapists(
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
      console.error("Error fetching skin therapists:", error);
      throw error;
    }
  }

  async getSkinTherapistById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skin therapist with id ${id}:`, error);
      throw error;
    }
  }

  async createSkinTherapist(skinTherapistData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, skinTherapistData);
      return response.data;
    } catch (error) {
      console.error("Error creating skin therapist:", error);
      throw error;
    }
  }

  async updateSkinTherapist(id: number, skinTherapistData: any): Promise<any> {
    try {
      const response = await api.put(
        `${this.baseUrl}/${id}`,
        skinTherapistData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating skin therapist with id ${id}:`, error);
      throw error;
    }
  }

  async deleteSkinTherapist(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting skin therapist with id ${id}:`, error);
      throw error;
    }
  }
}

export default new SkinTherapistService();
