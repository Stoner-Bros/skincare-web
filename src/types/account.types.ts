export interface AccountInfo {
  accountId: number;
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
}

export interface Account {
  accountId: number;
  email: string;
  createdAt: string;
  updateAt: string;
  role: string;
  isDeleted: boolean;
  accountInfo: AccountInfo;
}

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  extras: string;
  debug_info: string;
  data: {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}
