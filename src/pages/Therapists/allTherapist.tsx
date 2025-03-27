import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import skinTherapistService from "@/services/skin-therapist.services";

const AllTherapist: React.FC = () => {
    const [therapists, setTherapists] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTherapists = async () => {
            try {
                setLoading(true);
                const response = await skinTherapistService.getSkinTherapists(1, 10);
                
                console.log("API Response:", response); // Debug: log API response
                
                // Kiểm tra cấu trúc dữ liệu trả về
                if (response && response.data && response.data.items) {
                    setTherapists(response.data.items);
                } else if (response && response.items) {
                    setTherapists(response.items);
                } else if (Array.isArray(response)) {
                    setTherapists(response);
                } else {
                    setTherapists([]);
                    setError("Không tìm thấy dữ liệu bác sĩ");
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bác sĩ:", error);
                setError("Có lỗi xảy ra khi tải dữ liệu bác sĩ");
            } finally {
                setLoading(false);
            }
        };

        fetchTherapists();
    }, []);

    return (
        <div className='w-full min-h-screen flex flex-col bg-white'>
            <section className="swiper-container">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={50}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 3000 }}
                    pagination={{ clickable: true }}
                    navigation
                    className="select-none"
                    style={{
                        height: '700px',
                    }}
                >
                    <SwiperSlide>
                        <img src="/doingubacsi.png" alt="Slide 1" className="w-full object-cover" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/doingubacsi4.jpg" alt="Slide 2" className="w-full object-cover" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="/doingubacsi2.jpg" alt="Slide 3" className="w-full object-cover" />
                    </SwiperSlide>
                </Swiper>
            </section>

            <div className="w-full bg-gray-100 py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <img
                                src="tamnhin.png"
                                alt="Tầm nhìn"
                                className="w-[50px] h-[50px] rounded-xl mx-auto mb-4"
                            />

                            <h2 className="text-center text-xl font-semibold text-indigo-800">
                                GIÀU KINH NGHIỆM
                            </h2>
                            <p className="mt-4 text-center text-red-500">Đến năm 2025</p>
                            <hr className="border-t-2 border-gray-300 w-30 mx-auto mt-2" />
                            <p className="text-base h-[240px] overflow-y-scroll pr-1">
                                LuxSpa.Vn tự hào với đội ngũ bác sĩ giàu kinh nghiệm, tận tâm và chuyên nghiệp hàng đầu trong lĩnh vực thẩm mỹ. Mỗi bác sĩ đều am hiểu sâu sắc các phương pháp tiên tiến, cập nhật xu hướng làm đẹp mới nhất, đồng thời luôn lắng nghe và thấu hiểu nhu cầu của từng khách hàng để mang đến dịch vụ an toàn, hiệu quả với kết quả tối ưu.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <img
                                src="sumenh.webp"
                                alt="Sứ mệnh"
                                className="w-[50px] h-[50px] rounded-xl mx-auto mb-4"
                            />

                            <h2 className="text-center text-xl font-semibold text-indigo-800">
                                NGHIỆP VỤ CHUYÊN MÔN CAO
                            </h2>
                            <p className="mt-4 text-center text-red-500">
                                Triết lý "Phụng sự từ tâm"
                            </p>
                            <hr className="border-t-2 border-gray-300 w-30 mx-auto mt-2" />
                            <p className="text-base h-[240px] overflow-y-scroll pr-1">
                                Đội ngũ chuyên gia sở hữu trình độ chuyên môn cao và kinh nghiệm dày dặn trong cả hai lĩnh vực thẩm mỹ nội khoa và ngoại khoa. Sự kết hợp hoàn hảo này mang đến cho khách hàng những giải pháp làm đẹp toàn diện, từ chăm sóc da chuyên sâu đến các kỹ thuật thẩm mỹ tiên tiến.{" "}
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <img
                                src="giatri.webp"
                                alt="Tầm nhìn"
                                className="w-[50px] h-[50px] rounded-xl mx-auto mb-4"
                            />

                            <h2 className="text-center text-xl font-semibold text-indigo-800">
                                TẬN TÂM VỚI KHÁCH HÀNG
                            </h2>
                            <p className="mt-4 text-center text-red-500">GIÁ TRỊ CỐT LÕI</p>
                            <hr className="border-t-2 border-gray-300 w-30 mx-auto mt-2" />
                            <div className="h-[240px] overflow-y-scroll pr-1">
                                <p className="text-base h-[240px] overflow-y-scroll pr-1">
                                    Với lòng nhiệt thành và sự tận tâm, đội ngũ bác sĩ và chuyên gia thẩm mỹ của SeoulSpa.Vn luôn đặt lợi ích của khách hàng lên hàng đầu, sẵn sàng lắng nghe, tư vấn và đồng hành cùng bạn trên hành trình chăm sóc sức khỏe và sắc đẹp toàn diện.                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="w-full bg-pink-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">Danh sách Bác sĩ</h2>
                    
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-pink-800">Đang tải danh sách bác sĩ...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : therapists.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-pink-800">Không có bác sĩ nào</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {therapists.map((therapist, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4"
                                >
                                    <div className="w-40 h-40 flex-shrink-0">
                                        <img
                                            src={therapist.account?.accountInfo?.avatar ? `https://skincare-api.azurewebsites.net/api/upload/${therapist.account.accountInfo.avatar}` : "default-avatar.jpg"} 
                                            alt={therapist.account?.accountInfo?.fullName || "Bác sĩ"}
                                            className="w-full h-full object-cover rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "tranhuunghia1.png";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-red-500 mb-2">
                                            {therapist.account?.accountInfo?.fullName || "Chưa cập nhật tên"}
                                        </h3>

                                        <p className="text-gray-600 flex items-center space-x-2 mb-2">
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2L2 6l8 4 6-3.1V14h2V6l-8-4zM2 14h2v-3.1l-2-1V14zm8 4l-5-2.5V12.6l5 2.5 5-2.5v2.9L10 18z" />
                                            </svg>
                                            <span>{therapist.specialization || "Chuyên khoa chưa cập nhật"}</span>
                                        </p>

                                        <p className="text-gray-600 flex items-center space-x-2 mb-3">
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-3H9V5h2v5z" />
                                            </svg>
                                            <span>{therapist.experience || "Kinh nghiệm chưa cập nhật"}</span>
                                        </p>
                                        <p className="text-gray-600 flex items-center space-x-2 mb-3">
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-3H9V5h2v5z" />
                                            </svg>
                                            <span>{therapist.introduction || "Kinh nghiệm chưa cập nhật"}</span>
                                        </p>
                                        
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>


        </div>
    )
}

export default AllTherapist;
