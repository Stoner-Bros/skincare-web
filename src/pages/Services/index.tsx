import serviceService from '@/services/service.services';
import treatmentService from '@/services/treatment.services';
import { Service } from '@/types/service.types';
import { Treatment } from '@/types/treatment.types';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [treatmentsMap, setTreatmentsMap] = useState<Record<number, Treatment[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getServices();
        
        let servicesList: Service[] = [];
        if (Array.isArray(response)) {
          servicesList = response;
        } else if ('items' in response) {
          servicesList = response.items;
        }
        
        setServices(servicesList);
        
        // Tải danh sách treatments cho mỗi service
        const treatmentsData: Record<number, Treatment[]> = {};
        for (const service of servicesList) {
          const treatmentResponse = await treatmentService.getTreatments(service.serviceId);
          if ('items' in treatmentResponse) {
            treatmentsData[service.serviceId] = treatmentResponse.items;
          }
        }
        
        setTreatmentsMap(treatmentsData);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải danh sách dịch vụ:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
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
    if (!url) return '/default-service.jpg';
      
    // Nếu URL đã là đường dẫn đầy đủ, trả về luôn
    if (url.startsWith('http')) return url;
      
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
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-[#AF1F45] text-center mb-10">Dịch Vụ Của Chúng Tôi</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.length > 0 ? (
          services.map((service) => (
            <div 
              key={service.serviceId} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <div 
                className="h-48 bg-cover bg-center cursor-pointer" 
                style={{ backgroundImage: `url(${getImageUrl(service.serviceThumbnailUrl)})` }}
                onClick={() => handleServiceClick(service.serviceId)}
              ></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#AF1F45] truncate" title={service.serviceName}>
                  {service.serviceName}
                </h3>
                <p className="text-gray-600 line-clamp-2 text-sm mt-2">{service.serviceDescription}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleServiceClick(service.serviceId)}
                    className="text-[#AF1F45] text-sm font-medium hover:underline"
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleTreatmentClick(service.serviceId)}
                    className="bg-[#AF1F45] text-white text-sm px-3 py-1 rounded hover:bg-[#8a1936]"
                  >
                    Xem các liệu trình
                  </button>
                </div>
                
                {/* Hiển thị 2 liệu trình đầu tiên nếu có */}
                {treatmentsMap[service.serviceId] && treatmentsMap[service.serviceId].length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <p className="text-sm font-medium text-gray-500 mb-2">Liệu trình nổi bật:</p>
                    <div className="space-y-2">
                      {treatmentsMap[service.serviceId].slice(0, 2).map(treatment => (
                        <div 
                          key={treatment.treatmentId}
                          className="flex items-center justify-between bg-pink-50 p-2 rounded-md cursor-pointer hover:bg-pink-100"
                          onClick={() => handleTreatmentDetailClick(treatment.treatmentId)}
                        >
                          <span className="text-xs text-gray-700 truncate">{treatment.treatmentName}</span>
                          <span className="text-xs font-medium text-[#AF1F45]">{treatment.price.toLocaleString('vi-VN')} đ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Không có dịch vụ nào để hiển thị.</p>
          </div>
        )}
      </div>
    </div>
  );
} 