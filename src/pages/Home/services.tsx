import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules';

export default function Services() {
    return (
        <div className="w-full min-h-screen bg-white">
            <header className="flex justify-between items-center my-4 mx-72">
                <div className="flex items-center">
                    <Link to="/" className="text-3xl font-bold text-red-600">
                        <span className="text-xl text-red-600">Thẩm Mỹ Viện</span> Luxspa.vn
                    </Link>
                </div>
                <div className="flex flex-col items-end space-y-3 ">
                    <div className="flex justify-between items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <Button className="text-xl ">Hotline: 1800 3333</Button>
                        </div>
                        <div className="flex space-x-4 ">
                            <input
                                type="text"
                                placeholder="Tìm kiếm ..."
                                className="px-4 py-2 border rounded-lg text-gray-600 "
                            />
                        </div>
                    </div>

                    <nav className="flex justify-center space-x-8 w-full">
                        <Link to="/about" className="text-red-600 font-bold hover:text-gray-800">VỀ CHÚNG TÔI</Link>
                        <Link to="/services" className="text-red-600 font-bold hover:text-gray-800">DỊCH VỤ LÀM ĐẸP</Link>
                        <Link to="/phun-xam" className="text-red-600 font-bold hover:text-gray-800">PHUN XĂM THẨM MỸ</Link>
                        <Link to="/doctor" className="text-red-600 font-bold hover:text-gray-800">BÁC SĨ</Link>
                        <Link to="/tips" className="text-red-600 font-bold hover:text-gray-800">TIPS LÀM ĐẸP</Link>
                        <Link to="/franchise" className="text-red-600 font-bold hover:text-gray-800">NHƯỢNG QUYỀN</Link>
                    </nav>
                </div>
            </header>

            <div className="mt-8 flex justify-center">
                <div className="max-w-[1200px] w-full">
                    <h2 className="text-5xl font-bold text-[#AF1F45] text-center mb-6">
                        Chăm sóc da
                    </h2>

                    <div className="grid grid-cols-4 gap-6 mx-auto">
                        {[
                            { src: "/tesst.webp", text: "Enzym Ức Chế Tuyến Mồ Hôi Chân" },
                            { src: "/test.webp", text: "Enzyme Ức Chế Tuyến Mồ Hôi Tay" },
                            { src: "/tesst.webp", text: "Enzym Ức Chế Tuyến Mồ Hôi Nách" },
                            { src: "/test.webp", text: "Phục Hồi Vùng Lưng" },
                            { src: "/tesst.webp", text: "Trẻ Hóa LS 2025" },
                            { src: "/test.webp", text: "CSD Cấp Tốc LS 2025" },
                            { src: "/tesst.webp", text: "CSD Tầng Sâu – Infusion" },
                            { src: "/test.webp", text: "CSD Peptide HA Infusion" },
                        ].map((item, index) => (
                            <div key={index} className="relative w-[270px] h-[200px] rounded-[20px] overflow-hidden shadow-lg">
                                <img src={item.src} alt="Service" className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 w-full bg-[rgba(175,31,69,0.7)] text-white text-sm font-semibold px-3 py-2 text-center rounded-b-[20px]">
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>



            <footer className="bg-[#F8F8F8] text-gray-900 py-12 mt-12">
                <div className="container mx-auto flex flex-col lg:flex-row justify-between">

                    <div className="flex flex-col mb-8 lg:mb-0 w-full lg:w-1/3">
                        <div className="flex items-center mb-4">
                            <img src="/mun.jpg" alt="LuxSpa Logo" className="w-12 h-12 mr-4" />
                            <p className="font-bold text-xl text-[#F1588D]">TÁI ĐỊNH VỊ THƯƠNG HIỆU</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Thẩm mỹ viện LuxSpa.Vn với nhiều chi nhánh trải dài trên toàn quốc, tự hào sở hữu đội ngũ bác sĩ chuyên môn cao, tiên phong công nghệ tiên tiến để đem đến giải pháp làm đẹp tối ưu.
                        </p>
                        <div className="space-y-2">
                            <p className="text-lg font-semibold">THÔNG TIN LIÊN HỆ</p>
                            <p className="text-sm text-gray-600">120 Ni Sư Huỳnh Liên, Phường 10, Tân Bình, TP.HCM</p>
                            <p className="text-sm text-gray-600">1800 3333 (CSKH)</p>
                            <p className="text-sm text-gray-600">0911 025 477 (Tư Vấn Nhượng Quyền)</p>
                            <p className="text-sm text-gray-600">cskh@luxspa.vn</p>
                            <p className="text-sm text-gray-600">Thời gian làm việc: Từ 8:45 đến 19:30 hàng ngày</p>
                            <p className="text-sm text-gray-600">-----------------</p>
                            <p className="text-sm text-gray-600">Theo dõi chúng tôi tại</p>
                            <div className="flex space-x-1">
                                <img
                                    src="/facebook.png"
                                    alt="facebook"
                                    className="w-[35px] h-[35px] object-cover rounded-lg" />
                                <img
                                    src="/instagram.png"
                                    alt="Instagram"
                                    className="w-[35px] h-[35px] object-cover rounded-lg" />
                                <img
                                    src="/youtube.png"
                                    alt="Youtube"
                                    className="w-[35px] h-[35px] object-cover rounded-lg" />
                                <img
                                    src="/gmail.png"
                                    alt="gmail"
                                    className="w-[35px] h-[35px] object-cover rounded-lg" />
                            </div>


                        </div>
                    </div>

                    <div className="flex flex-col w-full lg:w-1/3 mb-8 lg:mb-0">
                        <p className="font-bold text-xl text-[#F1588D] mb-4">BÀI VIẾT NỔI BẬT</p>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li><a href="#" className="hover:text-[#F1588D]">Bảng giá dịch vụ spa</a></li>
                            <li><a href="#" className="hover:text-[#F1588D]">Điều khác chân mày giá bao nhiêu</a></li>
                            <li><a href="#" className="hover:text-[#F1588D]">Tắm trắng bao nhiêu tiền</a></li>
                            <li><a href="#" className="hover:text-[#F1588D]">Triệt lông vĩnh viễn giá bao nhiêu</a></li>
                        </ul>

                        <p className="font-bold text-xl text-[#F1588D] mt-8 mb-4">CHÍNH SÁCH</p>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li><a href="#" className="hover:text-[#F1588D]">Chính sách bảo mật thông tin</a></li>
                            <li><a href="#" className="hover:text-[#F1588D]">Chính sách biên tập nội dung</a></li>
                            <li><a href="#" className="hover:text-[#F1588D]">Chính sách đổi trả hàng</a></li>
                            <li><a href="#" className="hover:text-[#F1588D]">Chính sách vận chuyển và thanh toán</a></li>
                        </ul>
                    </div>

                    <div className="flex flex-col w-full lg:w-1/3 text-center">
                        <p className="font-bold text-xl text-[#F1588D] mb-4">TẢI ỨNG DỤNG</p>
                        <div className="flex justify-center space-x-4 mb-6">
                            <a href="#" className="text-white">
                                <img src="/Googleplay.png" alt="Google Play" className="w-32" />
                            </a>
                            <a href="#" className="text-white">
                                <img src="/Appstore.png" alt="App Store" className="w-32" />
                            </a>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <a href="#" className="text-white text-xl hover:text-[#F1588D]">
                                <i className="fab fa-facebook"></i>
                            </a>
                            <a href="#" className="text-white text-xl hover:text-[#F1588D]">
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a href="#" className="text-white text-xl hover:text-[#F1588D]">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
