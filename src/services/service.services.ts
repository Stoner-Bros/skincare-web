import api from "@/lib/api";

class ServiceService {
  private baseUrl = "/services";

  async getServices(
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

      console.log("Raw API Response from getServices:", response);

      const responseData = response.data;

      if (
        responseData &&
        responseData.data &&
        responseData.status !== undefined
      ) {
        console.log("API trả về dạng ApiResponse", responseData.data);
        return responseData.data as any;
      }

      if (responseData && responseData.items) {
        console.log("API trả về dạng ServiceListResponse", responseData);
        return responseData as any;
      }

      if (Array.isArray(responseData)) {
        console.log("API trả về dạng mảng Service[]", responseData);
        return responseData as any;
      }

      console.error(
        "Định dạng dữ liệu API không nhận dạng được:",
        responseData
      );
      return {
        items: [],
        pageNumber,
        pageSize,
        totalPages: 0,
        totalRecords: 0,
      };
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  async getServiceById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with id ${id}:`, error);
      throw error;
    }
  }

  async getServiceImage(filename: string): Promise<string> {
    try {
      const response = await api.get(`/api/upload/${filename}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service image ${filename}:`, error);
      throw error;
    }
  }

  async createService(serviceData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, serviceData);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  async updateService(id: number, serviceData: any): Promise<any> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service with id ${id}:`, error);
      throw error;
    }
  }

  async deleteService(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting service with id ${id}:`, error);
      throw error;
    }
  }
}

export default new ServiceService();
