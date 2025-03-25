import { Button } from "@/components/ui/button";
import treatmentService from "@/services/treatment.services";
import serviceService from "@/services/service.services";
import {
  ArrowLeft,
  Loader2,
  Clock,
  Tag,
  Star,
  Users,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TreatmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState<any | null>(null);
  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatmentDetail = async () => {
      try {
        setLoading(true);
        const treatmentId = parseInt(id || "0");

        console.log("Đang tải treatment với ID:", treatmentId);

        if (treatmentId > 0) {
          const response = await treatmentService.getTreatmentById(treatmentId);
          console.log("Dữ liệu treatment nhận được:", response);

          // Lấy dữ liệu từ response.data
          const treatmentData = response.data;

          if (treatmentData) {
            setTreatment(treatmentData);

            // Lấy thông tin service của treatment
            if (treatmentData.serviceId) {
              console.log("Đang tải service với ID:", treatmentData.serviceId);
              const serviceResponse = await serviceService.getServiceById(
                treatmentData.serviceId
              );
              // Lấy dữ liệu từ response.data cho service
              const serviceData = serviceResponse.data;
              console.log("Dữ liệu service nhận được:", serviceData);
              setService(serviceData);
            }
          } else {
            setError("Không tìm thấy dữ liệu liệu trình");
          }
        } else {
          setError("Không tìm thấy thông tin liệu trình");
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết liệu trình:", err);
        setError("Không thể tải chi tiết liệu trình. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchTreatmentDetail();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Format image URL correctly based on format
  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/default-treatment.jpg";

    // Nếu URL đã là đường dẫn đầy đủ, trả về luôn
    if (url.startsWith("http")) return url;

    // Nếu URL chỉ là tên file, thêm base URL
    return `https://skincare-api.azurewebsites.net/api/upload/${url}`;
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex justify-center items-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#AF1F45]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="container mx-auto py-8">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="container mx-auto py-8">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div className="text-center py-10">
            <p className="text-gray-500">Không tìm thấy thông tin liệu trình</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="mb-6 flex items-center hover:bg-pink-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10">
          <div className="md:flex">
            <div className="md:w-1/2 relative">
              <img
                src={getImageUrl(treatment.treatmentThumbnailUrl)}
                alt={treatment.treatmentName}
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-treatment.jpg";
                }}
              />
              {treatment.isAvailable && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Có sẵn
                </div>
              )}
            </div>

            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-[#2F3B4B] mb-4">
                {treatment.treatmentName}
              </h1>

              <div className="space-y-6">
                <div className="flex items-center text-2xl font-bold text-[#AF1F45]">
                  <Tag className="h-6 w-6 mr-2" />
                  <span>{treatment.price?.toLocaleString("vi-VN")} VND</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{treatment.duration || "30"} phút</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>
                    {treatment.isAvailable ? "Có sẵn" : "Không có sẵn"}
                  </span>
                  <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  <span>Chưa có đánh giá</span>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Mô tả:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {treatment.description ||
                      `${treatment.treatmentName} là liệu trình chăm sóc da được thiết kế đặc biệt để điều trị và ngăn ngừa mụn, giảm viêm và phục hồi độ trong sáng cho da. Sử dụng kết hợp các phương pháp làm sạch sâu, tẩy tế bào chết và các thành phần kháng khuẩn, liệu trình này giúp kiểm soát mụn và giảm thiểu nguy cơ mụn tái phát.`}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Lợi ích chính:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Làm sạch sâu và loại bỏ tạp chất</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Cân bằng độ ẩm và dầu trên da</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-5 w-5 mr-2 text-green-500" />
                      <span>Giảm thiểu dấu hiệu lão hóa</span>
                    </li>
                  </ul>
                </div>

                <Button className="w-full mt-8 bg-[#AF1F45] hover:bg-[#8a1936] text-white py-6 text-lg font-semibold">
                  Đặt lịch ngay
                </Button>
              </div>
            </div>
          </div>
        </div>

        {service && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#2F3B4B]">
              Dịch vụ liên quan
            </h2>
            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-[#AF1F45] mb-3">
                {service.serviceName}
              </h3>
              <p className="text-gray-600">{service.serviceDescription}</p>
              <Button
                variant="outline"
                className="mt-4 border-[#AF1F45] text-[#AF1F45] hover:bg-[#AF1F45] hover:text-white"
                onClick={() => navigate(`/services/${service.serviceId}`)}
              >
                Xem chi tiết dịch vụ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
