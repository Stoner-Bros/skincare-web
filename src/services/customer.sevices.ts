import api from "@/lib/api";

class CustomerService {
  private baseUrl = "/customers";

  async getCustomers(
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
      console.error("Error fetching customers:", error);
      throw error;
    }
  }

  async getCustomerById(id: number): Promise<any> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  }

  async createCustomer(customerData: any): Promise<any> {
    try {
      const response = await api.post(`${this.baseUrl}`, customerData);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting customer with id ${id}:`, error);
      throw error;
    }
  }
}

export default new CustomerService();
