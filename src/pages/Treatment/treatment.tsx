import { Button } from '@/components/ui/button';
import serviceService from '@/services/service.services';
import treatmentService from '@/services/treatment.services';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import 'swiper/swiper-bundle.css';

export default function Treatment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<any | null>(null);
    const [treatments, setTreatments] = useState<any[]>([]);
    const [selectedTreatment, setSelectedTreatment] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const path = window.location.pathname;
                
                // Nếu đang ở route /treatment/detail/:id
                if (path.includes('/treatment/detail/')) {
                    const treatmentId = parseInt(id || '0');
                    if (treatmentId > 0) {
                        const treatment = await treatmentService.getTreatmentById(treatmentId);
                        setSelectedTreatment(treatment);
                        
                        // Lấy thông tin service của treatment
                        if (treatment.serviceId) {
                            const serviceData = await serviceService.getServiceById(treatment.serviceId);
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
                    const treatmentResponse = await treatmentService.getTreatments(serviceId);
                    console.log(`API response for service ${serviceId}:`, treatmentResponse);
                    setDebug(treatmentResponse); // Lưu response để debug
                    
                    if ('items' in treatmentResponse && Array.isArray(treatmentResponse.items)) {
                        setTreatments(treatmentResponse.items);
                    } else if (Array.isArray(treatmentResponse)) {
                        setTreatments(treatmentResponse);
                    } else if (treatmentResponse && typeof treatmentResponse === 'object') {
                        // Trường hợp response là một object khác
                        if ('data' in treatmentResponse && 
                            typeof treatmentResponse.data === 'object' && 
                            treatmentResponse.data !== null && 
                            'items' in treatmentResponse.data && 
                            Array.isArray(treatmentResponse.data.items)) {
                            setTreatments(treatmentResponse.data.items as any[]);
                        } else {
                            console.error('Định dạng response không xác định:', treatmentResponse);
                            setError('Cấu trúc dữ liệu không đúng định dạng');
                        }
                    }
                } else {
                    // Nếu không có id, lấy tất cả treatments
                    const treatmentResponse = await treatmentService.getTreatments();
                    setDebug(treatmentResponse); // Lưu response để debug
                    
                    if ('items' in treatmentResponse && Array.isArray(treatmentResponse.items)) {
                        setTreatments(treatmentResponse.items);
                    } else if (Array.isArray(treatmentResponse)) {
                        setTreatments(treatmentResponse);
                    }
                }
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
                setDebug(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // const handleTreatmentClick = async (treatmentId: number) => {
    //     try {
    //         setLoading(true);
    //         const treatment = await treatmentService.getTreatmentById(treatmentId);
    //         setSelectedTreatment(treatment);
    //     } catch (err) {
    //         console.error('Lỗi khi tải chi tiết liệu trình:', err);
    //         setError('Không thể tải chi tiết liệu trình. Vui lòng thử lại sau.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleGoBack = () => {
        if (selectedTreatment) {
            setSelectedTreatment(null);
        } else {
            navigate(-1);
        }
    };

    // Format image URL correctly based on format
    const getImageUrl = (url: string | undefined) => {
        if (!url) return '/default-treatment.jpg';
        
        // Nếu URL đã là đường dẫn đầy đủ, trả về luôn
        if (url.startsWith('http')) return url;
        
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

                <h2 className="text-4xl font-bold text-[#AF1F45] text-center mb-6">
                    {service ? service.serviceName : 'Tất cả dịch vụ chăm sóc'}
                </h2>

                

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mx-auto">
                    {treatments.length > 0 ? (
                        treatments.map((treatment) => (
                            <Link 
                                key={treatment.treatmentId} 
                                to={`/treatment/detail/${treatment.treatmentId}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="h-[220px] overflow-hidden">
                                    <img 
                                        src={getImageUrl(treatment.treatmentThumbnailUrl)} 
                                        alt={treatment.treatmentName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/default-treatment.jpg";
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-[#AF1F45] truncate mb-2">
                                        {treatment.treatmentName}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-500 text-sm">Giá</p>
                                            <p className="font-semibold">{treatment.price.toLocaleString('vi-VN')} VNĐ</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-500 text-sm">Thời gian</p>
                                            <p className="font-semibold">{treatment.duration} phút</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">Không tìm thấy liệu trình nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
