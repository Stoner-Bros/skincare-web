import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import serviceService from "@/services/service.services";
import { Service } from "@/types/service.types";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ShowService() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setError("ID dịch vụ không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const serviceData = await serviceService.getServiceById(parseInt(id, 10));
        setService(serviceData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin dịch vụ:", err);
        setError("Không thể lấy thông tin dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-red-600 text-xl mb-4">{error || "Không tìm thấy dịch vụ"}</div>
        <Button onClick={handleGoBack} variant="outline" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button 
        onClick={handleGoBack} 
        variant="outline" 
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={service.serviceThumbnailUrl || "/mun.jpg"} 
              alt={service.serviceName}
              className="w-full h-80 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/mun.jpg";
              }}
            />
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-rose-600 mb-4">{service.serviceName}</h1>
            
            <div className="bg-pink-50 p-4 rounded-md mb-6">
              <h2 className="text-xl font-semibold mb-2 text-pink-800">Thông tin dịch vụ</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{service.serviceDescription}</p>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Button className="bg-rose-600 text-white">
                Đặt lịch ngay
              </Button>
              <Button 
                variant="outline" 
                className="border-rose-600 text-rose-600"
                onClick={() => navigate(`/treatment/${service.serviceId}`)}
              >
                Xem các liệu trình
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
