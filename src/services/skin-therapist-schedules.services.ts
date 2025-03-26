import api from "@/lib/api";

class SkinTherapistSchedulesService {
  private baseUrl = "/skin-therapist-schedules";

  async getSkinTherapistSchedules(
    therapistId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          therapistId,
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching skin therapist schedules:", error);
      throw error;
    }
  }

  async getSkinTherapistScheduleById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching skin therapist schedule with id ${id}:`,
        error
      );
      throw error;
    }
  }

  async createSkinTherapistSchedule(
    skinTherapistScheduleData: any
  ): Promise<any> {
    try {
      const response = await api.post(
        `${this.baseUrl}`,
        skinTherapistScheduleData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating skin therapist schedule:", error);
      throw error;
    }
  }

  async updateSkinTherapistSchedule(
    id: number,
    skinTherapistScheduleData: any
  ): Promise<any> {
    try {
      const response = await api.put(
        `${this.baseUrl}/${id}`,
        skinTherapistScheduleData
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating skin therapist schedule with id ${id}:`,
        error
      );
      throw error;
    }
  }

  async deleteSkinTherapistSchedule(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(
        `Error deleting skin therapist schedule with id ${id}:`,
        error
      );
      throw error;
    }
  }
}

export default new SkinTherapistSchedulesService();
