import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import accountService from "@/services/account.services";
import { useEffect, useState } from "react";

export default function MyProfile() {
  const { user, reloadUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    phone: "",
    dob: "",
    otherInfo: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.accountInfo?.fullName || "",
        email: user.email || "",
        address: user.accountInfo?.address || "",
        phone: user.accountInfo?.phone || "",
        dob: user.accountInfo?.dob || "",
        otherInfo: user.accountInfo?.otherInfo || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profileData = {
        fullName: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        dob: formData.dob,
        otherInfo: formData.otherInfo,
      };

      await accountService.updateAccount(user.accountInfo.accountId, profileData);
      await reloadUser();
      toast({
        title: "Thành công",
        description: "Thông tin cá nhân đã được cập nhật thành công",
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-pink-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <h2 className="text-2xl font-medium text-center mb-6">
          Thông Tin Cá Nhân
        </h2>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email không thể thay đổi
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Thông tin khác
            </label>
            <input
              type="text"
              name="otherInfo"
              value={formData.otherInfo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
