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

export interface AccountCreateRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AccountUpdateRequest {
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
}

export interface AccountListResponse {
  items: Account[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  extras?: string;
  debug_info?: string;
  data: T;
}
