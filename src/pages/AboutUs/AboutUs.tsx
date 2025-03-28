import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

export default function AboutUs() {
  const awards = [
    {
      title: "Sản phẩm - Dịch vụ chất lượng châu Á",
      image: "sp-dvcl.jpg",
    },
    {
      title: "Chứng nhận nhà lãnh đạo xuất sắc châu Á",
      image: "lanhdao.jpg",
    },
    {
      title: "Chứng nhận thương hiệu xuất sắc châu Á",
      image: "thuonghieu.jpg",
    },
    {
      title: "Thương hiệu xuất sắc châu Á 2023",
      image: "xuatsac2023.jpg",
    },
    {
      title: "Nhà lãnh đạo xuất sắc châu Á",
      image: "nhalanhdao.jpg",
    },
  ];

  const customers = [
    {
      image: "khach1.jpg",
      name: "Chị Minh Thư",
      feedback: "Liệu trình trẻ hóa da thật sự tuyệt vời!",
    },
    {
      image: "khach2.jpg",
      name: "Chị Lan Anh",
      feedback: "Làn da của tôi thay đổi rõ rệt sau khi trị nám.",
    },
    {
      image: "khach3.jpg",
      name: "Chị Hồng Nhung",
      feedback: "Rất hài lòng với dịch vụ tại LuxSpa.",
    },
    {
      image: "khachdacbiet.jpg",
      name: "Anh Đức Hoàng",
      feedback: "Trải nghiệm dịch vụ massage rất thư giãn.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex items-center justify-center h-[520px] mt-6 mb-12 bg-gray-100">
        <div className="w-[1120px]  rounded-2xl relative border-2 border-rose-300 px-5 flex bg-white">
          <div className="w-1/2 flex items-center justify-center">
            <img
              src="aboutus.jpg"
              alt="Cơ sở vật chất"
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-center px-6 overflow-y-scroll pr-2">
            <h2 className="text-red-500 text-2xl font-semibold">
              Thẩm Mỹ Viện <span className="text-pink-500">Luxspa.vn</span>
            </h2>
            <div className="h-[200px] overflow-y-scroll small-scrollbar pr-1">
              <p className="text-gray-700 mt-4">
                Hệ thống Thẩm mỹ viện Luxspa.vn là một trong những thương hiệu
                làm đẹp hàng đầu Việt Nam, chi nhánh phủ sóng trong và ngoài
                nước, cung cấp hơn 300 dịch vụ làm đẹp...
                <br />
                Hệ thống Thẩm mỹ viện Luxspa.vn là một trong những thương hiệu
                làm đẹp hàng đầu Việt Nam, chi nhánh phủ sóng trong và ngoài
                nước, cung cấp hơn 300 dịch vụ làm đẹp...
                <br />
                Hệ thống Thẩm mỹ viện Luxspa.vn là một trong những thương hiệu
                làm đẹp hàng đầu Việt Nam, chi nhánh phủ sóng trong và ngoài
                nước, cung cấp hơn 300 dịch vụ làm đẹp...
              </p>
              <p className="text-gray-700 mt-2">
                Năm 2023,{" "}
                <span className="text-red-500 font-semibold">
                  Luxspa.vn đã hoàn tất quá trình tái định vị thương hiệu
                </span>
                , đánh dấu bước ngoặt quan trọng trong hành trình phát triển...
              </p>
              <p className="text-red-500 font-semibold mt-4">
                Năm 2024, Luxspa.vn triển khai chương trình nhượng quyền thương
                hiệu...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-red-600 mb-12">
            HÀNH TRÌNH PHÁT TRIỂN
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute w-full h-1 bg-pink-200 top-[45px]"></div>

            {/* Timeline items */}
            <div className="flex justify-between relative">
              {[
                {
                  year: "2018",
                  description: "Thành lập chi nhánh đầu tiên tại TP.HCM",
                },
                {
                  year: "2020",
                  description: "Mở rộng 5 chi nhánh tại các tỉnh thành lớn",
                },
                {
                  year: "2022",
                  description: "Đạt chứng nhận thương hiệu uy tín châu Á",
                },
                {
                  year: "2023",
                  description: "Tái định vị thương hiệu, nâng cấp công nghệ",
                },
                {
                  year: "2024",
                  description: "Triển khai chương trình nhượng quyền",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center w-[200px]"
                >
                  <div className="w-[90px] h-[90px] rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    {item.year}
                  </div>
                  <p className="text-center text-sm mt-4 uppercase">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
                TẦM NHÌN
              </h2>
              <p className="mt-4 text-center text-red-500">Đến năm 2025</p>
              <hr className="border-t-2 border-gray-300 w-30 mx-auto mt-2" />
              <p className="text-base h-[240px] overflow-y-scroll pr-1">
                Với tầm nhìn đến năm 2025 sẽ trở thành thương hiệu hàng đầu Quốc
                gia về làm đẹp và thẩm mỹ. Chúng tôi đặt mục tiêu dẫn đầu thị
                trường, vươn tầm quốc tế, đặc biệt tại khu vực Đông Nam Á, phục
                vụ hàng triệu khách hàng bằng chất lượng dịch vụ vượt trội.
                Thương hiệu cam kết không ngừng đổi mới và tiên phong cập nhật
                những xu hướng thẩm mỹ hiện đại nhất, để mang đến trải nghiệm
                hoàn hảo cho mọi khách hàng.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="sumenh.webp"
                alt="Sứ mệnh"
                className="w-[50px] h-[50px] rounded-xl mx-auto mb-4"
              />

              <h2 className="text-center text-xl font-semibold text-indigo-800">
                SỨ MỆNH
              </h2>
              <p className="mt-4 text-center text-red-500">
                Triết lý "Phụng sự từ tâm"
              </p>
              <hr className="border-t-2 border-gray-300 w-30 mx-auto mt-2" />
              <p className="text-base h-[240px] overflow-y-scroll pr-1">
                Với triết lý "Phụng sự từ tâm", thương hiệu không chỉ đơn thuần
                cung cấp dịch vụ làm đẹp, mà còn mang đến trải nghiệm trọn vẹn,
                nơi sự hài lòng của khách hàng là thước đo giá trị đích thực.
                Đội ngũ chúng tôi sẽ dành trọn sự tận tâm, chân thành và chuyên
                môn để phục vụ, kiến tạo vẻ đẹp và lan tỏa những giá trị Chân –
                Thiện – Mỹ đến từng khách hàng. Đặc biệt, cam kết đồng hành cùng
                khách hàng trên hành trình tìm kiếm và tỏa sáng vẻ đẹp ấy.{" "}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <img
                src="giatri.webp"
                alt="Tầm nhìn"
                className="w-[50px] h-[50px] rounded-xl mx-auto mb-4"
              />

              <h2 className="text-center text-xl font-semibold text-indigo-800">
                GIÁ TRỊ CỐT LÕI
              </h2>
              <p className="mt-4 text-center text-red-500">6 GIÁ TRỊ CỐT LÕI</p>
              <hr className="border-t-2 border-gray-300 w-30 mx-auto mt-2" />
              <div className="h-[240px] overflow-y-scroll pr-1">
                <p className="text-base">
                  Thương hiệu cam kết 6 giá trị cốt lõi:
                </p>
                <ol className="list-decimal pl-6 text-base">
                  <li>
                    <span className="font-bold">Tử tế:</span> Phục vụ khách hàng
                    bằng sự yêu thương và trân trọng.
                  </li>
                  <li>
                    <span className="font-bold">Tốc độ:</span> Phản hồi nhanh
                    chóng, quy trình tối ưu, tiết kiệm thời gian.
                  </li>
                  <li>
                    <span className="font-bold">Trí tuệ:</span> Đội ngũ chuyên
                    gia giàu kinh nghiệm, trau dồi kiến thức mới, cập nhật công
                    nghệ hiện đại.
                  </li>
                  <li>
                    <span className="font-bold">Trách nhiệm:</span> Đảm bảo dịch
                    vụ chất lượng, an toàn và bảo hành tận tâm.
                  </li>
                  <li>
                    <span className="font-bold">Trung thực:</span> Thông tin
                    minh bạch, giá cả rõ ràng, quy trình chuẩn Y Khoa.
                  </li>
                  <li>
                    <span className="font-bold">Thay đổi không ngừng:</span>{" "}
                    Tiên phong công nghệ mới, sáng tạo không ngừng, tối ưu hiệu
                    quả.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
            GIẢI THƯỞNG VINH DANH
          </h2>
          <h2 className="text-xl text-center text-black mb-8">
            Thẩm mỹ viện LuxSpa.Vn vinh dự nhận được những giải thưởng cao quý
            trong lĩnh vực làm đẹp
          </h2>
          <div className="px-4 md:px-16">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              loop={true}
              // autoplay={{ delay: 3000 }}
              navigation
              className="w-full"
            >
              {awards.map((award, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="h-[250px] object-contain"
                  />
                  <p className="mt-4 text-base text-pink-600 font-medium">
                    {award.title}
                  </p>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">
            KHÁCH HÀNG ĐÃ TIN CHỌN LUXSPA
          </h2>
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={3}
            loop={true}
            // autoplay={{ delay: 3000 }}
            navigation
            className="w-full select-none"
          >
            {customers.map((customer, index) => (
              <SwiperSlide key={index} className="flex flex-col items-center">
                <div className="bg-white rounded-lg shadow-md p-4 w-[500px]">
                  <img
                    src={customer.image}
                    alt={customer.name}
                    className="w-full h-[300px] object-cover rounded-lg"
                  />
                  <div className="bg-pink-500 text-white text-center py-3 rounded-b-lg">
                    <h3 className="font-bold">{customer.name}</h3>
                    <p className="text-sm italic">"{customer.feedback}"</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section
        className="relative bg-white py-16"
        style={{
          backgroundImage:
            "url(https://cdn.diemnhangroup.com/seoulcenter/2023/08/Group-1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-1/2 mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="https://cdn.diemnhangroup.com/seoulcenter/2023/08/HINH-BAC-SY-1.png"
              alt="Đội ngũ bác sĩ"
              className="w-full max-w-md object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-pink-500 mb-2 text-center">
              ĐĂNG KÝ NGAY
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              để được tư vấn miễn phí
            </p>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-l-4"
              />
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border-l-4"
              />
              <button className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-pink-600">
                NHẬN TƯ VẤN
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
