import { Account } from "./account.types";

export interface SkinTherapist {
  accountId: number;
  specialization: string;
  experience: string;
  introduction: string;
  bio: string;
  rating: number;
  isAvailable: boolean;
  account: Account;
}

export interface PaginatedSkinTherapistResponse {
  status: number;
  message: string;
  extras: string;
  debug_info: string;
  data: {
    items: SkinTherapist[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}
