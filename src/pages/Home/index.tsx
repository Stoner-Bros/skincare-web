import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Autoplay, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { useState } from "react";


export default function Home() {
  const [index, setIndex] = useState(0);
  const bacSi = [
    {
      name: "Trần Tiến Sang",
      description: "Bác sĩ Trần Tiến Sang là chuyên gia nội khoa với hơn 15 năm kinh nghiệm trong việc điều trị các bệnh lý tim mạch và huyết áp. Ông đã từng công tác tại nhiều bệnh viện lớn và hiện đang làm việc tại Bệnh viện Đại học Y Dược TP.HCM. Trần Tiến Sang đặc biệt nổi bật trong việc chẩn đoán sớm các bệnh lý tim mạch, giúp nhiều bệnh nhân cải thiện sức khỏe.",
      image: "/test.webp"
    },
    {
      name: "Huỳnh Đoàn Thanh Phong",
      description: "Bác sĩ Huỳnh Đoàn Thanh Phong là bác sĩ chuyên khoa sản phụ khoa, với hơn 10 năm kinh nghiệm trong lĩnh vực chăm sóc sức khỏe sinh sản. Bà đã thực hiện hàng nghìn ca phẫu thuật thành công và là chuyên gia trong việc điều trị các vấn đề về sinh lý nữ và vô sinh. Bác sĩ Minh Anh hiện là trưởng khoa tại Bệnh viện Phụ sản Trung ương.",
      image: "/tesst.webp"
    },
    {
      name: "Lê Văn Tùng",
      description: "Bác sĩ Lê Văn Tùng là chuyên gia phẫu thuật chỉnh hình, đặc biệt giỏi trong việc điều trị các chấn thương xương khớp và thay khớp. Ông đã có hơn 20 năm kinh nghiệm và là người sáng lập khoa phẫu thuật chỉnh hình tại Bệnh viện Chợ Rẫy. Bác sĩ Tùng cũng có nhiều nghiên cứu và công trình khoa học về phẫu thuật thay khớp và phục hồi chức năng.",
      image: "/test.webp"
    },
    {
      name: "Phan Thị Lan",
      description: "Bác sĩ Phan Thị Lan là bác sĩ chuyên khoa da liễu, với kinh nghiệm hơn 12 năm trong việc điều trị các bệnh về da như mụn, viêm da, eczema, và các vấn đề da liễu khác. Cô hiện đang làm việc tại Bệnh viện Da liễu TP.HCM và là giảng viên của Đại học Y Dược TP.HCM. Bác sĩ Lan luôn chú trọng đến việc điều trị các bệnh lý da từ nguyên nhân sâu xa và giúp bệnh nhân đạt được làn da khỏe mạnh.",
      image: "/tesst.webp"
    },
    {
      name: "Trương Thanh Tâm",
      description: "Bác sĩ Trương Thanh Tâm là chuyên gia về các bệnh lý tiêu hóa, với hơn 18 năm kinh nghiệm trong việc điều trị bệnh lý dạ dày, đại tràng và gan mật. Ông là giảng viên tại Trường Đại học Y Dược TP.HCM và là bác sĩ chính tại Bệnh viện Bạch Mai. Bác sĩ Tâm đã nghiên cứu và phát triển nhiều phương pháp điều trị mới cho các bệnh lý tiêu hóa.",
      image: "/test.webp"
    }
  ];

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
            <img src="/test.webp" alt="Slide 1" className="w-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/test.webp" alt="Slide 2" className="w-full object-cover" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="/test.webp" alt="Slide 3" className="w-full object-cover" />
          </SwiperSlide>
        </Swiper>
      </section>



      <section className="bg-pink-50 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-600 mb-8">DỊCH VỤ NỔI BẬT</h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="border rounded-lg p-4 border-red-500">
              <img src="/mun.jpg" alt="Chăm sóc da" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold text-red-600 mt-4">Chăm sóc da</h3>
              <div className="flex mt-4 items-center justify-center">
                <Button className="bg-red-600 text-white">Xem chi tiết</Button>
                <Button className="bg-gray-300 text-gray-800">Nhận tư vấn</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 border-red-500">
              <img src="/mun.jpg" alt="Điều trị mụn" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold text-red-600 mt-4">Điều trị mụn</h3>
              <div className="flex justify-center mt-4">
                <Button className="bg-red-600 text-white">Xem chi tiết</Button>
                <Button className="bg-gray-300 text-gray-800">Nhận tư vấn</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 border-red-500">
              <img src="/mun.jpg" alt="Tắm trắng" className="w-full h-48 object-cover rounded-t-lg" />
              <h3 className="text-xl font-semibold text-rose-600 mt-4">Tắm trắng</h3>
              <div className="flex justify-center mt-4">
                <Button className="bg-red-600 text-white">Xem chi tiết</Button>
                <Button className="bg-gray-300 text-gray-800">Nhận tư vấn</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="swiper2-container relative w-full py-10">
        <h2 className="text-center text-2xl font-bold text-pink-500 mb-6">CÔNG NGHỆ ĐỘC QUYỀN</h2>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{ delay: 3000 }}
          navigation
          className="w-3/5 mx-auto select-none"
        >
          <div className="grid grid-cols-2 gap-4">
            <SwiperSlide>
              <div className="bg-white rounded-2xl shadow-lg flex items-center border border-pink-300"  >
                <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                <div className="h-[200px] px-4 py-2 flex flex-col grow">
                  <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                  <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                  </p>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="bg-white rounded-2xl shadow-lg flex items-center border border-pink-300"  >
                <img src="/tesst.webp" alt="MD-CODE" className="aspect-[11/9] h-[200px] object-cover rounded-xl" />
                <div className="h-[200px] px-4 py-2 flex flex-col grow">
                  <h3 className="text-pink-500 font-semibold text-lg mb-2">MD-CODE</h3>
                  <p className="text-gray-600 text-sm tracking-widest">Công nghệ MD-DYNAMIC CODE tái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất có thể cho bạn để làm việc nhanh nhất. Công nghệ MD-DYNAMIC CODE cái cấu trúc da minh họa động và đầy đủ cấp độ tốt nhất
                  </p>
                </div>
              </div>
            </SwiperSlide>
          </div>
        </Swiper>
      </section>

      <section className="w-[80%] mx-auto py-10">
        <div className="w-full grid grid-cols-12 gap-4">
          <div className="col-span-4 flex justify-end">
            <img src={bacSi[index].image} alt="MD-CODE" className="aspect-[9/16] h-[600px] object-cover rounded-xl" />
          </div>
          <div className="col-span-8">
            <div className="w-full text-center text-4xl font-semibold mb-8 uppercase">Đội ngũ chuyên gia</div>
            <div className="w-80% h-[260px] mx-16 rounded-2xl relative border-2 border-red-500 px-8">
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-5 bg-white px-8 text-red-500 text-2xl font-semibold">
                {bacSi[index].name}
              </div>
              <div className="my-8 h-[200px] overflow-y-scroll pr-2">
                {bacSi[index].description}
              </div>
            </div>
            <div className="mt-8 px-16">
              <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                loop={true}
                // autoplay={{ delay: 3000 }}
                navigation
                className="w-full h-[200px] grid grid-cols-5 gap-4 select-none"
                onSlideChange={(e) => {
                  setIndex((index + 1) % bacSi.length)
                }}
              // className="w-80%"
              >
                <SwiperSlide>
                  <img src="/tesst.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/test.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/tesst.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/test.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/tesst.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/tesst.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/tesst.webp" alt="MD-CODE" className="aspect-square rounded-full h-[200px] object-cover" />
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">

          <h2 className="text-3xl font-bold text-rose-600">THÔNG TIN LUXSPA</h2>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Thẩm mỹ viện LuxSpa.Vn liên tục mang đến những sự kiện hấp dẫn cho khách hàng.
            Cùng với đó là các ưu đãi “cực hot” khi sử dụng dịch vụ làm đẹp tại tất cả chi nhánh trên toàn quốc.
          </p>


          <div className="flex justify-between mt-6 space-x-4">
            <Button className="bg-red-600 text-white px-4 py-2 font-bold rounded-lg">
              THÔNG TIN SỰ KIỆN
            </Button>
            <Button className="bg-rose-400 text-white px-4 py-2 font-bold rounded-lg">
              BÀI VIẾT MỚI NHẤT
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8 w-full">
            <div className="flex flex-col w-full h-full">
              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-full h-[386px] object-cover rounded-lg" />
              <div className="flex flex-col w-full text-left flex-grow justify-end">
                <h3 className="text-lg font-bold text-red-600 mt-4 leading-snug">
                  Nhượng quyền LuxSpa.Vn với vốn đầu tư hợp lý, lợi nhuận hấp dẫn
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Bạn đang có một số vốn và có ý định hợp tác kinh doanh với mong muốn giảm thiểu rủi ro và đạt được tiềm năng lớn...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>
            <div className="flex flex-col w-full h-full">
              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-full h-[386px] object-cover rounded-lg" />
              <div className="flex flex-col w-full text-left flex-grow justify-end">
                <h3 className="text-lg font-bold text-red-600 mt-4 leading-snug">
                  Nhượng quyền LuxSpa.Vn với vốn đầu tư hợp lý, lợi nhuận hấp dẫn
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Bạn đang có một số vốn và có ý định hợp tác kinh doanh với mong muốn giảm thiểu rủi ro và đạt được tiềm năng lớn...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-16 mt-8">
            <div className="flex w-full h-[145px]">

              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>



            <div className="flex w-full h-[145px]">

              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>


            <div className="flex w-[598px] h-[145px]">

              <img src="/mun.jpg"
                alt="Nhượng quyền LuxSpa.Vn"
                className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>


            <div className="flex w-[598px] h-[145px]">

              <img src="/mun.jpg" alt="Nhượng quyền LuxSpa.Vn" className="w-[200px] h-full object-cover rounded-lg" />

              <div className="flex flex-col w-full text-left pl-4 justify-between">
                <h3 className="text-lg font-bold text-red-600 leading-snug">
                  Lễ ký kết hợp tác chuyên giao công nghệ thẩm mỹ lão hóa ngược và cấy mô sinh học
                </h3>
                <p className="text-gray-600 text-sm mt-2">
                  Ngày 05/09/2024 vừa qua, Thẩm mỹ viện Seoul Center đã tổ chức buổi lễ ký kết chuyển giao 2 công nghệ tiên tiến...
                </p>
                <a href="#" className="text-blue-600 font-semibold mt-2">Xem chi tiết</a>
              </div>
            </div>

          </div>
        </div>
      </section>






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
  );
}
