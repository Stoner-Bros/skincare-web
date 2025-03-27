import api from "@/lib/api";

class SkinTherapistService {
  private baseUrl = "/skintherapists";

  async getSkinTherapists(
    pageNumber: number = 1,
    pageSize: number = 10,
    includeDeleted: boolean = true
  ): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          pageNumber,
          pageSize,
          includeDeleted,
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

  async getFreeSkinTherapistSlots(
    date: string,
    timeSlotIds: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      // Chuyển đổi chuỗi timeSlotIds thành mảng
      const timeSlotIdArray = timeSlotIds
        .split(",")
        .map((id) => parseInt(id.trim()));

      // Tạo params object với URLSearchParams
      const params = new URLSearchParams();
      params.append("date", date);

      // Thêm mỗi timeSlotId dưới dạng timeSlotIds=1&timeSlotIds=2
      timeSlotIdArray.forEach((id) => {
        params.append("timeSlotIds", id.toString());
      });

      // Thêm các tham số page
      params.append("pageNumber", pageNumber.toString());
      params.append("pageSize", pageSize.toString());

      // Gửi request với params đã được định dạng
      const response = await api.get(`${this.baseUrl}/free`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching free skin therapist slots:", error);
      throw error;
    }
  }
}

export default new SkinTherapistService();
