import api from "@/lib/api";

class TimeSlotService {
  private baseUrl = "/timeslots";

  async getTimeSlots() {
    try {
      const response = await api.get(`${this.baseUrl}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching time slots:", error);
      throw error;
    }
  }

  async createTimeSlot(timeSlot: any) {
    try {
      const response = await api.post(`${this.baseUrl}`, timeSlot);
      return response.data;
    } catch (error) {
      console.error("Error creating time slot:", error);
      throw error;
    }
  }

  async getTimeSlotById(id: number) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching time slot by id:", error);
      throw error;
    }
  }

  async updateTimeSlot(id: number, timeSlot: any) {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, timeSlot);
      return response.data;
    } catch (error) {
      console.error("Error updating time slot:", error);
      throw error;
    }
  }

  async deleteTimeSlot(id: number) {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting time slot:", error);
      throw error;
    }
  }
}

export default new TimeSlotService();
