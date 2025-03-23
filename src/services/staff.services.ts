import api from "@/lib/api";

class StaffService {
  private baseUrl = "/staffs";

  async getStaffs(pageNumber: number = 1, pageSize: number = 10): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching staffs:", error);
      throw error;
    }
  }

  async getStaffById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff with id ${id}:`, error);
      throw error;
    }
  }

  async createStaff(staffData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, staffData);
      return response.data;
    } catch (error) {
      console.error("Error creating staff:", error);
      throw error;
    }
  }

  async updateStaff(id: number, staffData: any): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, staffData);
      return response.data;
    } catch (error) {
      console.error(`Error updating staff with id ${id}:`, error);
      throw error;
    }
  }

  async deleteStaff(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting staff with id ${id}:`, error);
      throw error;
    }
  }
}

export default new StaffService();
