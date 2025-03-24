import { Account } from "./account.types";

export interface Staff {
  accountId: number;
  startDate: string;
  isAvailable: boolean;
  account: Account;
}

export interface PaginatedStaffResponse {
  status: string;
  message: string;
  extras: any;
  debug: any;
  data: {
    items: Staff[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface CreateStaffRequest {
  email: string;
  password: string;
  fullName: string;
  startDate: string;
}

export interface UpdateStaffRequest {
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
  startDate: string;
  isAvailable: boolean;
}
