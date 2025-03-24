import { Account } from "./account.types";

export interface Customer {
  accountId: number;
  lastVisit: string;
  account: Account;
}

export interface PaginatedCustomerResponse {
  status: number;
  message: string;
  extras: string;
  debug_info: string;
  data: {
    items: Customer[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}
