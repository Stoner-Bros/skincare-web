import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules';

export default function Treatment() {
    return (
        <div className="w-full min-h-screen bg-white">

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

        </div>
    )
}
