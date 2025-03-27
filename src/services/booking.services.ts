import api from "@/lib/api";

class BookingService {
  private baseUrl = "/bookings";

  async createBooking(bookingData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  async getBookings(
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
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }

  async getBookingById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking by ID:", error);
      throw error;
    }
  }

  async updateBooking(id: number, bookingData: any): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, bookingData);
      return response.data;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  }

  async deleteBooking(id: number): Promise<any> {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  }

  async getBookingHistory(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/history`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching booking history:", error);
      throw error;
    }
  }

  async getBookingHistoryByEmail(email: string): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/history/email`, {
        params: {
          email,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching booking history by email:", error);
      throw error;
    }
  }
}

export default new BookingService();
