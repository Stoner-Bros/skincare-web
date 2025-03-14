import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules';

export default function AllTherapist() {
    return (
        <div className='w-full h-screen bg-white'>
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
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            {
                                img: "chuyengia1.webp",
                                name: "Chuyên gia phun xăm - tư vấn phong thủy Trang Nguyễn",
                                title1: "Chuyên gia phun xăm phong thủy",
                                title2: "Tư vấn phun xăm mày môi mí",
                            },
                            {
                                img: "chuyengia2.webp",
                                name: "Nguyễn Thúy Hằng",
                                title1: "Giảng viên",
                                title2: "Đào tạo chăm sóc da",
                            },
                            {
                                img: "chuyengia3.webp",
                                name: "Nguyễn Kim Khoa",
                                title1: "Bác sĩ",
                                title2: "Da liễu, Tạo hình thẩm mỹ",
                            },
                            {
                                img: "chuyengia4.webp",
                                name: "Mai Hữu Nghĩa",
                                title1: "Bác sĩ",
                                title2: "Da liễu, Phẫu thuật thẩm mỹ",
                            },
                        ].map((doctor, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4"
                            >
                                <img
                                    src={doctor.img}
                                    alt={doctor.name}
                                    className="w-40 h-40 object-cover "
                                />
                                <div>
                                    <h3 className="text-xl font-semibold text-red-500">{doctor.name}</h3>
                                    {/* Dòng đầu tiên với icon học vấn */}
                                    <p className="text-gray-600 flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2L2 6l8 4 6-3.1V14h2V6l-8-4zM2 14h2v-3.1l-2-1V14zm8 4l-5-2.5V12.6l5 2.5 5-2.5v2.9L10 18z" />
                                        </svg>
                                        <span>{doctor.title1}</span>
                                    </p>
                                    {/* Dòng thứ hai với icon chuyên môn */}
                                    <p className="text-gray-600 flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-1h2v1zm0-3H9V5h2v5z" />
                                        </svg>
                                        <span>{doctor.title2}</span>
                                    </p>
                                    <button className="mt-2 text-white bg-red-500 px-4 py-2 rounded">
                                        Xem thêm
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    )
}
