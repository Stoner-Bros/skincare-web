import { Button } from "@/components/ui/button";
import serviceService from "@/services/service.services";
import treatmentService from "@/services/treatment.services";
import { ArrowLeft, Loader2, Clock, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "swiper/swiper-bundle.css";

export default function Treatment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any | null>(null);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const path = window.location.pathname;

        // Nếu đang ở route /treatment/detail/:id
        if (path.includes("/treatment/detail/")) {
          const treatmentId = parseInt(id || "0");
          if (treatmentId > 0) {
            const treatment = await treatmentService.getTreatmentById(
              treatmentId
            );
            setSelectedTreatment(treatment);

            // Lấy thông tin service của treatment
            if (treatment.serviceId) {
              const serviceData = await serviceService.getServiceById(
                treatment.serviceId
              );
              setService(serviceData);
            }
          }
        }
        // Nếu đang ở route /treatment/:id (các treatment của một service)
        else if (id) {
          const serviceId = parseInt(id);
          const serviceData = await serviceService.getServiceById(serviceId);
          setService(serviceData);

          // Lấy danh sách treatments cho service này
          const treatmentResponse = await treatmentService.getTreatments(
            serviceId
          );
          console.log(
            `API response for service ${serviceId}:`,
            treatmentResponse
          );

          if (
            "items" in treatmentResponse &&
            Array.isArray(treatmentResponse.items)
          ) {
            setTreatments(treatmentResponse.items);
          } else if (Array.isArray(treatmentResponse)) {
            setTreatments(treatmentResponse);
          } else if (
            treatmentResponse &&
            typeof treatmentResponse === "object"
          ) {
            // Trường hợp response là một object khác
            if (
              "data" in treatmentResponse &&
              typeof treatmentResponse.data === "object" &&
              treatmentResponse.data !== null &&
              "items" in treatmentResponse.data &&
              Array.isArray(treatmentResponse.data.items)
            ) {
              setTreatments(treatmentResponse.data.items as any[]);
            } else {
              console.error(
                "Định dạng response không xác định:",
                treatmentResponse
              );
            }
          }
        } else {
          // Nếu không có id, lấy tất cả treatments
          const treatmentResponse = await treatmentService.getTreatments();

          if (
            "items" in treatmentResponse &&
            Array.isArray(treatmentResponse.items)
          ) {
            setTreatments(treatmentResponse.items);
          } else if (Array.isArray(treatmentResponse)) {
            setTreatments(treatmentResponse);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGoBack = () => {
    if (selectedTreatment) {
      setSelectedTreatment(null);
    } else {
      navigate(-1);
    }
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto py-8 px-4">
        <Button
          onClick={handleGoBack}
          variant="outline"
          className="mb-6 flex items-center hover:bg-pink-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#AF1F45] mb-3">
            {service ? service.serviceName : "Tất cả dịch vụ chăm sóc"}
          </h2>
          {service && service.serviceDescription && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {service.serviceDescription}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto">
          {treatments.length > 0 ? (
            treatments.map((treatment) => (
              <Link
                key={treatment.treatmentId}
                to={`/treatment/detail/${treatment.treatmentId}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="h-[250px] overflow-hidden relative">
                  <img
                    src={getImageUrl(treatment.treatmentThumbnailUrl)}
                    alt={treatment.treatmentName}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/default-treatment.jpg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white truncate">
                      {treatment.treatmentName}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center text-gray-600">
                      <Tag className="h-5 w-5 mr-2" />
                      <span className="font-semibold">
                        {treatment.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>{treatment.duration} phút</span>
                    </div>
                  </div>
                  {treatment.description && (
                    <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                      {treatment.description}
                    </p>
                  )}
                  <Button className="w-full mt-4 bg-[#AF1F45] hover:bg-[#8a1936] text-white">
                    Xem chi tiết
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <img
                src="/empty-state.png"
                alt="No treatments found"
                className="w-48 h-48 mb-4 opacity-50"
              />
              <p className="text-gray-500 text-lg">
                Không tìm thấy liệu trình nào
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
