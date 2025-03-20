export interface SkinTherapist {
  accountId: number;
  specialization: string;
  experience: string;
  introduction: string;
  bio: string;
  rating: number;
  isAvailable: boolean;
  account: {
    accountId: number;
    email: string;
    createdAt: string;
    updateAt: string;
    role: string;
    isDeleted: boolean;
    accountInfo: {
      accountId: number;
      fullName: string;
      avatar: string;
      phone: string;
      address: string;
      dob: string;
      otherInfo: string;
    };
  };
}
