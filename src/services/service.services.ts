import api from "@/lib/api";
import {
  Service,
  ServiceCreateRequest,
  ServiceListResponse,
  ServiceUpdateRequest,
} from "@/types/service.types";

class ServiceService {
  private baseUrl = "/services";

  async getServices(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ServiceListResponse> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  async getServiceById(id: number): Promise<Service> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with id ${id}:`, error);
      throw error;
    }
  }

  async createService(serviceData: ServiceCreateRequest): Promise<Service> {
    try {
      const response = await api.post(`${this.baseUrl}`, serviceData);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  async updateService(
    id: number,
    serviceData: ServiceUpdateRequest
  ): Promise<Service> {
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
