export interface User {
  accountId: number;
  email: string;
  createdAt: string;
  updateAt: string;
  role: string;
  isDeleted: boolean;
  accountInfo: {
    fullName: string;
    avatar: string | null;
    phone: string | null;
    address: string | null;
    dob: string | null;
    otherInfo: string | null;
  };
}
