import serviceService from "@/services/service.services";
import treatmentService from "@/services/treatment.services";
import { Loader2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<any>([]);
  const [treatmentsMap, setTreatmentsMap] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getServices();

        let servicesList: any[] = [];
        if (Array.isArray(response)) {
          servicesList = response;
        } else if ("items" in response) {
          servicesList = response.items;
        }

        setServices(servicesList);

        // Tải danh sách treatments cho mỗi service
        const treatmentsData: Record<number, any[]> = {};
        for (const service of servicesList) {
          const treatmentResponse = await treatmentService.getTreatments(
            service.serviceId
          );
          if ("items" in treatmentResponse) {
            treatmentsData[service.serviceId] = treatmentResponse.items;
          }
        }

        setTreatmentsMap(treatmentsData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải danh sách dịch vụ:", err);
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (serviceId: number) => {
    navigate(`/services/${serviceId}`);
  };

  const handleTreatmentClick = (serviceId: number) => {
    navigate(`/treatment/${serviceId}`);
  };

  const handleTreatmentDetailClick = (treatmentId: number) => {
    navigate(`/treatment/detail/${treatmentId}`);
  };

  // Format image URL correctly based on format
  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/default-service.jpg";

    // Nếu URL đã là đường dẫn đầy đủ, trả về luôn
    if (url.startsWith("http")) return url;

    // Nếu URL chỉ là tên file, thêm base URL
    return `${import.meta.env.VITE_API_URL}/upload/${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#AF1F45] mb-4">
            Dịch Vụ Của Chúng Tôi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các dịch vụ chăm sóc da chuyên nghiệp của chúng tôi, được
            thiết kế để mang lại trải nghiệm tốt nhất cho làn da của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0 ? (
            services.map((service: any) => (
              <div
                key={service.serviceId}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div
                  className="h-64 bg-cover bg-center relative overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage: `url(${getImageUrl(
                      service.serviceThumbnailUrl
                    )})`,
                  }}
                  onClick={() => handleTreatmentClick(service.serviceId)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity group-hover:opacity-80" />
                </div>

                <div className="p-6">
                  <h3
                    className="text-xl font-bold text-[#2F3B4B] mb-3 hover:text-[#AF1F45] transition-colors cursor-pointer"
                    onClick={() => handleTreatmentClick(service.serviceId)}
                  >
                    {service.serviceName}
                  </h3>

                  <p className="text-gray-600 line-clamp-2 mb-6 text-sm">
                    {service.serviceDescription}
                  </p>

                  <Button
                    onClick={() => handleTreatmentClick(service.serviceId)}
                    className="w-full bg-[#AF1F45] text-white hover:bg-[#8a1936]"
                  >
                    Xem các liệu trình
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {treatmentsMap[service.serviceId] &&
                    treatmentsMap[service.serviceId].length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-500 mb-3">
                          Liệu trình nổi bật:
                        </p>
                        <div className="space-y-2">
                          {treatmentsMap[service.serviceId]
                            .slice(0, 2)
                            .map((treatment) => (
                              <div
                                key={treatment.treatmentId}
                                className="flex items-center justify-between p-3 bg-pink-50 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors"
                                onClick={() =>
                                  handleTreatmentDetailClick(
                                    treatment.treatmentId
                                  )
                                }
                              >
                                <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">
                                  {treatment.treatmentName}
                                </span>
                                <span className="text-sm font-semibold text-[#AF1F45]">
                                  {treatment.price.toLocaleString("vi-VN")} đ
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <img
                src="/empty-state.png"
                alt="No services found"
                className="w-48 h-48 mb-4 opacity-50"
              />
              <p className="text-gray-500 text-lg">
                Không có dịch vụ nào để hiển thị.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
