import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules';
import treatmentService from '@/services/treatment.services';
import serviceService from '@/services/service.services';
import { Service } from '@/types/service.types';
import type { Treatment } from '@/types/treatment.types';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function Treatment() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
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
                            setTreatments(treatmentResponse.data.items as Treatment[]);
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

    const handleTreatmentClick = async (treatmentId: number) => {
        try {
            setLoading(true);
            const treatment = await treatmentService.getTreatmentById(treatmentId);
            setSelectedTreatment(treatment);
        } catch (err) {
            console.error('Lỗi khi tải chi tiết liệu trình:', err);
            setError('Không thể tải chi tiết liệu trình. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

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

    if (error) {
        return (
            <div className="w-full min-h-screen bg-white flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#AF1F45] mb-4">Đã xảy ra lỗi</h2>
                    <p>{error}</p>
                    <Button className="mt-4 bg-[#AF1F45] hover:bg-[#8a1936]" asChild>
                        <Link to="/">Quay về trang chủ</Link>
                    </Button>
                    {debug && (
                        <div className="mt-4 p-4 bg-gray-100 text-left text-xs overflow-auto max-h-60 rounded">
                            <pre>{JSON.stringify(debug, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Hiển thị chi tiết của một treatment khi đã chọn
    if (selectedTreatment) {
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

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex flex-col">
                            <div className="w-full h-[400px] overflow-hidden">
                                <img 
                                    src={getImageUrl(selectedTreatment.treatmentThumbnailUrl)} 
                                    alt={selectedTreatment.treatmentName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/default-treatment.jpg";
                                    }}
                                />
                            </div>
                            <div className="p-6 md:p-8">
                                <h1 className="text-3xl font-bold text-[#AF1F45] mb-6">{selectedTreatment.treatmentName}</h1>
                                
                                <div className="flex flex-wrap items-center gap-8 mb-6">
                                    <div>
                                        <p className="text-xl font-bold text-[#AF1F45]">{selectedTreatment.price.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span className="text-gray-600">{selectedTreatment.duration} phút</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                        <span className="text-gray-600">11 Booking</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                        <span className="text-gray-600">No reviews Rating</span>
                                    </div>
                                </div>
                                
                                <div className="bg-pink-50 p-4 rounded-md mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-pink-800">Mô tả liệu trình</h2>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedTreatment.description}</p>
                                </div>
                                
                                <div>
                                    <Button className="bg-[#8BC34A] hover:bg-[#7CB342] text-white w-full md:w-auto py-4 px-8 text-lg rounded-md">
                                        Book Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

                {/* Thêm debug info khi không có treatments */}
                {treatments.length === 0 && (
                    <div className="mb-4 p-2 bg-yellow-50 text-center rounded">
                        <p>Đang tìm các liệu trình cho ServiceID: {id}</p>
                        {debug && (
                            <div className="mt-2 p-2 bg-gray-100 text-left text-xs overflow-auto max-h-40 rounded">
                                <pre>{JSON.stringify(debug, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}

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
