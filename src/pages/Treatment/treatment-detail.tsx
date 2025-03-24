import { Button } from "@/components/ui/button";
import treatmentService from "@/services/treatment.services";
import serviceService from "@/services/service.services";
import { ArrowLeft, Loader2 } from "lucide-react";
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
          const response = await treatmentService.getTreatmentById(
            treatmentId
          );
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
    <div className="w-full min-h-screen bg-pink-50">
      <div className="container mx-auto py-8 px-4">
        {/* Breadcrumb */}
        {/* <div className="flex items-center text-sm mb-6">
                <a href="/" className="text-green-500 hover:underline flex items-center">
                    <span className="mr-1">🏠</span> Home
                </a>
                <span className="mx-2">/</span>
                <a href="/services" className="text-green-500 hover:underline">
                    Services
                </a>
                <span className="mx-2">/</span>
                <span className="text-gray-600">Service Details</span>
            </div> */}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-10">
          <div className="md:flex">
            {/* Ảnh liệu trình */}
            <div className="md:w-1/2">
              <img
                src={getImageUrl(treatment.treatmentThumbnailUrl)}
                alt={treatment.treatmentName}
                className="w-full h-[400px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-treatment.jpg";
                }}
              />
            </div>

            {/* Thông tin chính */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-[#2F3B4B] mb-4">
                {treatment.treatmentName}
              </h1>

              {/* Giá */}
              <div className="mb-4">
                <p className="text-2xl font-bold text-red-500">
                  {treatment.price
                    ? treatment.price.toLocaleString("vi-VN")
                    : "1320000"}{" "}
                  VND
                </p>
              </div>

              {/* Thời gian */}
              <div className="flex items-center mb-3">
                <span className="inline-flex items-center mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </span>
                <span>{treatment.duration || "30"} minutes</span>
              </div>

              {/* Đánh giá */}
              <div className="flex items-center mb-3">
                <span className="inline-flex items-center mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <span>
                  {treatment.isAvailable ? "Có sẵn" : "Không có sẵn"}
                </span>
                <span className="ml-4 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="ml-1">No reviews Rating</span>
                </span>
              </div>

              {/* Button đặt lịch */}
              <Button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-8 rounded-full">
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            Treatment Information
          </h2>

          {/* <div className="bg-[#1E293B] text-white p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-semibold mb-2">{treatment.treatmentName}</h3>
                    </div> */}

          <div className="mb-6">
            <h4 className="font-semibold mb-2">Overview:</h4>
            <p className="text-gray-700">
              {treatment.description ? (
                treatment.description
              ) : (
                <span>
                  {treatment.treatmentName} is a targeted skincare therapy
                  designed to treat and prevent breakouts, reduce inflammation,
                  and restore skin clarity. Using a combination of deep
                  cleansing, exfoliation, and antibacterial ingredients, this
                  treatment helps control acne and minimize future breakouts.
                </span>
              )}
            </p>

            {/* <div className="text-center mt-4">
                        <button className="text-green-500 border border-green-500 rounded-md py-2 px-4 hover:bg-green-50 transition-colors">
                            See More
                        </button>
                    </div> */}
          </div>
        </div>

        {service && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              Related Treatments
            </h2>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="font-semibold text-lg">{service.serviceName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
