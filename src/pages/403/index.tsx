import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 w-full">
      <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-md mx-auto">
        <h1 className="mb-4 text-4xl font-bold text-red-600">403</h1>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          Truy cập bị từ chối
        </h2>
        <p className="mb-8 text-gray-600">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
          viên nếu bạn cho rằng đây là lỗi.
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="px-4 py-2"
          >
            Về trang chủ
          </Button>
          <Button onClick={() => navigate(-1)} className="px-4 py-2">
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
