import api from "../lib/api";
import {
  Account,
  AccountCreateRequest,
  AccountUpdateRequest,
  AccountListResponse,
  ApiResponse,
  AccountInfo,
} from "../types/account.types";

class AccountService {
  private baseUrl = "/accounts";

  async getAccounts(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<AccountListResponse>> {
    try {
      const response = await api.get(`${this.baseUrl}`, {
        params: {
          pageNumber,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  }

  async getAccountById(id: number): Promise<ApiResponse<Account>> {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account with id ${id}:`, error);
      throw error;
    }
  }

  async createAccount(
    accountData: AccountCreateRequest
  ): Promise<ApiResponse<Account>> {
    try {
      const response = await api.post(`${this.baseUrl}`, accountData);
      return response.data;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  async updateAccount(
    id: number,
    accountData: AccountUpdateRequest
  ): Promise<ApiResponse<AccountInfo>> {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error(`Error updating account with id ${id}:`, error);
      throw error;
    }
  }

  async deleteAccount(id: number): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting account with id ${id}:`, error);
      throw error;
    }
  }
}

export default new AccountService();
